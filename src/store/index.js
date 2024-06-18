import Vue from 'vue';
import Vuex from 'vuex';
import geoGraphicContext from './building';
import rooms from './rooms';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    geoGraphicContext,
    rooms,
  },
});
