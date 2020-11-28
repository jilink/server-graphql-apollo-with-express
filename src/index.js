import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

const app = express();

const schema = gql`
  type Query {
    me: User
  }

  type User {
    usernmae: String!
  }
`;
const resolvers = {
  Query: {
    me: () => {
      return {
        username: "Robin wieruch",
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on localost8000/graphql");
});
