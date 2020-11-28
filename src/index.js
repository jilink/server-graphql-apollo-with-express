import cors from "cors";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(cors());

let messages = {
  1: {
    id: "1",
    text: "Helloooo ZAWARUDDO",
    userId: "1",
  },
  2: {
    id: "2",
    text: "bye world :'(",
    userId: "2",
  },
};

let users = {
  1: {
    id: "1",
    username: "Jimmy Soussan",
    messageIds: [1],
  },
  2: {
    id: "2",
    username: "Dave Davis",
    messageIds: [2],
  },
};

const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
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
    me: (parent, args, { me }) => {
      return me;
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    },
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };
      messages[id] = message;
      users[me.id].messageIds.push(id);
      return message;
    },

    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      messages = otherMessages;

      return true;
    },
  },

  Message: {
    user: (message) => {
      return users[message.userId];
    },
  },

  User: {
    messages: (user) =>
      Object.values(messages).filter((message) => message.userId === user.id),
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on localost8000/graphql");
});
