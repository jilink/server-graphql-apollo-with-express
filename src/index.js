import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const app = express();

app.use(cors());

const getMe = async (req) => {
  const token = req.headers["x-token"];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError("Your session has expired. Sign in again.");
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: (error) => {
    // remove the internal qeuelize error messages
    // leave only the important validation error
    const message = error.message
      .replace("SequelizeValidationError: ", "")
      .replace("Validation error: ", "");
    return {
      ...error,
      message,
    };
  },
  context: async ({ req }) => {
    const me = await getMe(req);
    return {
      models,
      //me: await models.User.findByLogin("Jilink"),
      me,
      secret: process.env.SECRET,
    };
  },
});

server.applyMiddleware({ app, path: "/graphql" });

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(new Date());
  }
  app.listen({ port: 8000 }, () => {
    console.log("Apollo Server on localost8000/graphql");
  });
});

const createUsersWithMessages = async (date) => {
  await models.User.create(
    {
      username: "Jilink",
      email: "jilink@htotmail.fr",
      password: "chutsvp",
      role: "ADMIN",
      messages: [
        {
          text: "Published a cool thing",
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    }
  );

  await models.User.create(
    {
      username: "John",
      email: "johnbg@htotmail.fr",
      password: "johnisbg",
      messages: [
        {
          text: "ZAWARDU thing",
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: "ZAWARDU BUT SECOND MESSAGE",
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};
