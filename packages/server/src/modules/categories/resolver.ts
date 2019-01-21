import { Resolver, Query, Mutation, Authorized, Arg } from "type-graphql";
import { ObjectId } from "mongodb";
import { validCategorySchema } from "@homeaider/common";

import { CategoryModel } from "./../../models/Category";
import { Category } from "../../types/objects/Category";

import { CategoryResponse } from "./response";
import { CategoryInput } from "./input";

import { formatYupError } from "../../utils/formatYupError";

@Resolver(Category)
export class RoleResolver {
  constructor() {}

  @Authorized()
  @Mutation(() => CategoryResponse, { nullable: true })
  async createCategory(
    @Arg("input") categoryInput: CategoryInput
  ): Promise<CategoryResponse | null> {
    try {
      await validCategorySchema.validate(categoryInput, { abortEarly: false });
    } catch (err) {
      return { errors: formatYupError(err) };
    }

    const { name } = categoryInput;

    const categoryAlreadyExists = await CategoryModel.findOne({ name }, "_id", {
      lean: true,
    }).exec();

    if (categoryAlreadyExists) {
      return {
        errors: [
          {
            path: "name",
            message: "Name is already being used!",
          },
        ],
      };
    }

    const category = new CategoryModel(categoryInput);

    await category.save();

    return null;
  }

  @Authorized()
  @Mutation(() => CategoryResponse, { nullable: true })
  async updateCategory(
    @Arg("categoryId") categoryId: ObjectId,
    @Arg("input") categoryInput: CategoryInput
  ): Promise<CategoryResponse | null> {
    try {
      await validCategorySchema.validate(categoryInput, { abortEarly: false });
    } catch (err) {
      return { errors: formatYupError(err) };
    }

    const { name } = categoryInput;

    const categoryAlreadyExists = await CategoryModel.findOne(
      { name, _id: { $ne: categoryId } },
      "_id",
      {
        lean: true,
      }
    ).exec();

    if (categoryAlreadyExists) {
      return {
        errors: [
          {
            path: "name",
            message: "Name is already being used!",
          },
        ],
      };
    }

    await CategoryModel.updateOne({ _id: categoryId }, { ...categoryInput });

    return null;
  }

  @Authorized()
  @Mutation(() => CategoryResponse, { nullable: true })
  async deleteCategory(
    @Arg("categoryId") categoryId: ObjectId
  ): Promise<CategoryResponse | null> {
    try {
      await CategoryModel.deleteOne({ _id: categoryId });
    } catch {
      return {
        errors: [
          {
            path: "role",
            message: "Something went wrong!",
          },
        ],
      };
    }

    return null;
  }

  @Authorized()
  @Query(() => [Category], { nullable: true })
  async categories(): Promise<Category[]> {
    const categories = await CategoryModel.find({})
      .lean()
      .exec();

    return categories;
  }
}