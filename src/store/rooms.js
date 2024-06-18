// src/store/index.js
import prepareServices from '@/services/index';
import { serializeFetchingRoomData } from '@/utils/serializeFetchingData';

const services = prepareServices();


  const state = {
    roomsData: null,
  }
  const mutations = {
    SET_ALL_ROOM_DATA(state, roomData) {
      state.roomsData = roomData;
    },
  }
  const actions = {
    async fetchAllRoomsData({ commit },rooms) {
      const results = [];
        for (const room of rooms) {
          const { data,err } = await services.getRoomData(room.id);
          if (err) {
            return
          }
        const roomData = serializeFetchingRoomData(data, room.id);
        results.push(roomData);
        }
      commit('SET_ALL_ROOM_DATA',results.filter(v => v));
      return results;
    },
  }
  const getters =  {
    roomsData: state =>  state.roomsData,
  }
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
