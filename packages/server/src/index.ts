import "reflect-metadata";
require("dotenv-safe").config();
import { ApolloServer, ApolloError } from "apollo-server-express";
import { v4 } from "uuid";
import { GraphQLError } from "graphql";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import * as express from "express";
import { buildSchema } from "type-graphql";
import { ObjectId } from "mongodb";
import * as cors from "cors";

import { redis } from "./redis";

import { createMongooseConn } from "./utils/createMongooseConn";
import { ObjectIdScalar } from "./scalars/ObjectIDScalar";

const RedisStore = connectRedis(session as any);

const startServer = async () => {
  await createMongooseConn();

  const app = express();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/modules/**/resolver.*"],
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
      authChecker: ({ context }) => {
        return context.req.session && context.req.session.userId; // or false if access denied
      },
    }),
    context: ({ req }: any) => ({
      req,
    }),
    formatError: (error: GraphQLError) => {
      if (error.originalError instanceof ApolloError) {
        return error;
      }

      const errId = v4();
      console.log("errId: ", errId);
      console.log(error);

      return new GraphQLError(`Internal Error: ${errId}`);
    },
  });

  app.set("trust proxy", 1);

  app.use(
    cors({
      credentials: true,
      origin:
        process.env.NODE_ENV === "production"
          ? "https://www.codeponder.com"
          : "http://localhost:3000",
    })
  );

  app.use((req, _, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
      try {
        const qid = authorization.split(" ")[1];
        req.headers.cookie = `qid=${qid}`;
      } catch (_) {}
    }

    return next();
  });

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    } as any)
  );

  server.applyMiddleware({ app, cors: false }); // app is from an existing express app

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
