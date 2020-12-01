import { ForbiddenError } from "apollo-server";
import { skip } from "graphql-resolvers";

export const isAuthenticated = (parent, args, { me }) => {
  me ? skip : new ForbiddenError("Not authenticated bro");
};

export const isMessageOwner = async (parent, { id }, { models, me }) => {
  const message = await models.Message.findByPk(id, { raw: true });
  if (message.userId !== me.id) {
    throw new Error("You can't delete someone else's message GOD");
  }
  return skip;
};
