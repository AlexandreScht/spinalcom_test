// src/store/building.js
import prepareServices from '@/services/index';
import { serializeFetchingBuildingData } from '@/utils/serializeFetchingData';

const services = prepareServices();

const state = {
  building: null,
};

const mutations = {
  SET_BUILDING_RESULT(state, result) {
    state.building = result;
  },
};

const actions = {
  async getAllInBuilding({ commit }) {
    const { data, err } = await services.getGeoGraphicContext();
    if (err) {
      return { err };
    }
    const result = serializeFetchingBuildingData(data);
    commit('SET_BUILDING_RESULT',result);
    return { err: null, result };
  },
};

const getters = {
  building: state => state.building,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
