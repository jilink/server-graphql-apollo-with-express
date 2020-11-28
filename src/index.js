import cors from "cors";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

const app = express();

app.use(cors());

let users = {
  1: {
    id: "1",
    username: "Jimmy Soussan",
  },
  2: {
    id: "2",
    username: "Dave Davis",
  },
};

const me = users[1];

const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User
  }

  type User {
    id: ID!
    username: String!
  }
`;
const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, { id }) => {
      return users[id];
    },
    me: () => {
      return me;
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
