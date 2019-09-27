export const state = () => ({
  jwt: "",
  user: null
});

export const mutations = {
  setJwt(state, jwt) {
    state.jwt = jwt;
  },
  setUser(state, user) {
    state.user = user;
  },
  resetAuth(state) {
    state.jwt = "";
    state.user = "";
  }
};

export const actions = {
  resetAuth({ commit }) {
    commit("resetAuth");
  },
  setJwt({ commit }, jwt) {
    commit("setJwt", jwt);
  },
  setUser({ commit }, user) {
    commit("setUser", user);
  }
};

export const getters = {
  jwt: ({ jwt }) => jwt,
  user: ({ user }) => user,
  isAuthenticated: ({ jwt }) => !!jwt
};
