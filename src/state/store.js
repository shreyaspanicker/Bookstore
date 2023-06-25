import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    header: {
      title: "Bookstore",
      tagline: "The store you can't afford to miss",
    },
  },
  actions: {},
  mutations: {},
});

export default store;
