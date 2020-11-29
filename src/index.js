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
  context: async () => ({
    models,
    me: await models.User.findByLogin("Jilink"),
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
