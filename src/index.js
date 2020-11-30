import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const app = express();

app.use(cors());

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
  context: async () => ({
    models,
    me: await models.User.findByLogin("Jilink"),
    secret: process.env.SECRET,
  }),
});

server.applyMiddleware({ app, path: "/graphql" });

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }
  app.listen({ port: 8000 }, () => {
    console.log("Apollo Server on localost8000/graphql");
  });
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: "Jilink",
      email: "jilink@htotmail.fr",
      password: "chutsvp",
      messages: [
        {
          text: "Published a cool thing",
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
        },
        {
          text: "ZAWARDU BUT SECOND MESSAGE",
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};
