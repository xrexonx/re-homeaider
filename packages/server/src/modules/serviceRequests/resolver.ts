import { ServiceRequestProgressPayload } from "./interfaces";
import { UserModel } from "./../../models/User";
import { MyContext } from "./../../types/Context";
import { ServiceRequestModel } from "./../../models/ServiceRequest";
import {
  Resolver,
  Query,
  Mutation,
  Authorized,
  Arg,
  Ctx,
  Subscription,
  ResolverFilterData,
  Root,
  Args,
  PubSub,
  Publisher,
} from "type-graphql";
import { ObjectId } from "mongodb";
import { ServiceRequest } from "../../types/objects/ServiceRequest";
import { ServiceRequestInput } from "./input";
import { ServiceRequestResponse } from "./response";
import { ServiceRequestProgressArgs } from "./args";

@Resolver(ServiceRequest)
export class ServiceRequestResolver {
  constructor() {}

  @Authorized()
  @Mutation(() => ServiceRequestResponse, { nullable: true })
  async createServiceRequest(
    @Arg("input") serviceRequestInput: ServiceRequestInput,
    @Ctx() ctx: MyContext
  ): Promise<ServiceRequestResponse> {
    try {
      await ServiceRequestModel.create({
        ...serviceRequestInput,
        serviceSeeker: ctx.req.session!.userId,
      });
    } catch (err) {
      return {
        errors: [
          {
            path: "create",
            message: "Something went wrong while booking a service",
          },
        ],
      };
    }

    return { errors: [] };
  }

  @Authorized()
  @Mutation(() => ServiceRequestResponse, { nullable: true })
  async updateServiceRequest(
    @Arg("serviceRequestId") serviceRequestId: ObjectId,
    @Arg("input") serviceRequestInput: ServiceRequestInput,
    @PubSub("SERVICE_REQUEST_PROGRESS")
    publish: Publisher<ServiceRequestProgressPayload>
  ): Promise<ServiceRequestResponse> {
    try {
      await ServiceRequestModel.updateOne(
        { _id: serviceRequestId },
        { ...serviceRequestInput }
      );
    } catch (err) {
      return {
        errors: [
          {
            path: "update",
            message: "Something went wrong with the service request",
          },
        ],
      };
    }

    const serviceRequest = await ServiceRequestModel.findOne({
      _id: serviceRequestId,
    })
      .lean()
      .exec();

    if (serviceRequest) {
      await publish({ serviceRequestId, serviceRequest });
    }

    return { errors: [] };
  }

  @Authorized()
  @Query(() => [ServiceRequest], { nullable: true })
  async availableBookingRequest(
    @Ctx() ctx: MyContext
  ): Promise<ServiceRequest[]> {
    const newUser = await UserModel.findOne({ _id: ctx.req.session!.userId });
    if (newUser) {
      const serviceRequest = await ServiceRequestModel.find({
        service: { $in: newUser.services },
        provider: null,
        canceledAt: null,
        accepted: false,
        startedAt: null,
        ignoredAt: null,
        completedAt: null,
      })
        .sort({ createdAt: -1 })
        .populate("serviceSeeker")
        .populate("provider")
        .populate({
          path: "service",
          populate: { path: "category" },
        })
        .lean()
        .exec();

      return serviceRequest;
    }

    return [];
  }

  @Authorized()
  @Query(() => [ServiceRequest], { nullable: true })
  async availableHiringRequest(
    @Ctx() ctx: MyContext
  ): Promise<ServiceRequest[]> {
    const serviceRequest = await ServiceRequestModel.find({
      provider: ctx.req.session!.userId,
      canceledAt: null,
      accepted: false,
      startedAt: null,
      ignoredAt: null,
    })
      .populate("aidee")
      .populate("provider")
      .populate({
        path: "service",
        populate: { path: "category" },
      })
      .lean()
      .exec();

    return serviceRequest;
  }

  @Authorized()
  @Subscription(() => ServiceRequest, {
    topics: "SERVICE_REQUEST_PROGRESS",
    filter: ({
      payload,
      args,
    }: ResolverFilterData<
      ServiceRequestProgressPayload,
      ServiceRequestProgressArgs
    >) => {
      return payload.serviceRequestId === args.serviceRequestId;
    },
  })
  serviceRequestProgress(
    @Root() newServiceRequest: ServiceRequestProgressPayload,
    @Args() args: ServiceRequestProgressArgs
  ): ServiceRequest {
    const { serviceRequest } = newServiceRequest;

    return serviceRequest;
  }
}
