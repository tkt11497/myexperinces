// import * as auth from "./modules/auth";
// import * as title from "./modules/title";

// // const state = () => ({
// //   ...auth.state,
// //   ...title.state
// // });
// const state = function() {
//   auth.state, title.state;
// };

// const mutations = {
//   ...auth.mutations,
//   ...title.mutations
// };

// const actions = {
//   ...auth.actions,
//   ...title.actions
// };

// const getters = {
//   ...auth.getters,
//   ...title.getters
// };

// export default {
//   state,
//   mutations,
//   actions,
//   getters
// };
export const state = () => ({
  counter: 0
});

export const mutations = {
  increment(state) {
    state.counter++;
  }
};
