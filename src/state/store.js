import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    header: {
      title: "Bookstore",
      tagline: "The store you can't afford to miss.",
    },
    searchParams: {
      category: "",
      keywords: [],
    },
  },
  mutations: {
    setSearchParams(state, value) {
      state.searchParams.category = value.category;
      state.searchParams.keywords = value.keywords;
    },
  },
  getters: {
    getSearchParams: (state) => state.searchParams,
  },
});

export default store;
