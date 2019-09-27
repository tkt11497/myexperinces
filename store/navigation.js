export const state = () => ({
  url: "",
  show: false
});

export const mutations = {
  setUrl(state, url) {
    state.url = url;
  },
  setShow(state, show) {
    state.show = show;
  }
};

export const actions = {
  setUrl({ commit }, url) {
    commit("setUrl", url);
  },
  setShow({ commit }, show) {
    commit("setShow", show);
  }
};

export const getters = {
  url: ({ url }) => url,
  show: ({ show }) => show
};
