import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import store from "./state/store.js";
import VueResize from "vue-resize";

Vue.use(Vuex);
Vue.use(VueResize);
Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
