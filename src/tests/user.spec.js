import { expect } from "chai";
import * as userApi from "./api";

describe("user", () => {
  describe("user(id: String!): User", () => {
    it("returns a user when user can be found", async () => {
      const expectedResult = {
        data: {
          user: {
            id: "1",
            username: "Jilink",
            email: "jilink@htotmail.fr",
            role: "ADMIN",
          },
        },
      };
      const result = await userApi.user({ id: "1" });
      expect(result.data).to.eql(expectedResult);
    });
    it("return ull when no user can be found", async () => {
      const expectedResult = {
        data: {
          user: null,
        },
      };

      const result = await userApi.user({ id: "42" });
      expect(result.data).to.eql(expectedResult);
    });
  });

  describe("deleteUser(id:String!): Boolean!", () => {
    it("returns an error becauuse only admins can delete a user", async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await userApi.signIn({ login: "John", password: "johnisbg" });

      const {
        data: { errors },
      } = await userApi.deleteUser({ id: "1" }, token);

      expect(errors[0].message).to.eql("Not an admin bro");
    });
  });
});
