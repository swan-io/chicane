import { createRouter } from "react-chicane";

export const { createURL, useLink, useLocation, useRoute } = createRouter({
  5: "/",
  7: "/groups",
  13: "/groups/:groupId?:foo&:bar[]#:baz",
  14: "/groups/mine",
  19: "/groups/:groupId/users*",
  20: "/groups/:groupId/users",
  21: "/groups/mine/users",
  24: "/:one/:two/:three/:four",
  26: "/groups/:groupId/users/:userId",
  27: "/groups/:groupId/users/me",
  28: "/groups/mine/users/me",
  30: "/:one/:two/:three/:four/:five",
});
