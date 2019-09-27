import localforage from "localforage";

export default async context => {
  const jwt = await localforage.getItem("jwt");
  const user = await localforage.getItem("user");
  if (!jwt || !user) {
    context.store.dispatch("auth/resetAuth");
    return context.redirect("/login");
  }
  context.store.dispatch("auth/setJwt", jwt);
  context.store.dispatch("auth/setUser", user);
};
