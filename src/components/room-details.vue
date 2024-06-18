<template>
  <div class="no_pick" v-if="!choosedRoom">
    <span>Veuillez séléctioner une pièce</span>
  </div>
  <div class="picked" v-else>
    <div class="top">
      <span>{{ choosedRoom.name }}</span>
      <span :class="getChipClass(choosedRoom)" class="chips">{{ getChipText(choosedRoom) }}</span>
    </div>
    <div class="room_value" v-for="(props, i) in propsRoom" :key="i">
      <span class="legend">{{ props }}:</span>
      <span>{{ displayData(props) }}</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      choosedRoom: null,
      propsRoom: ["Température","Consigne de température","Lumière","Consigne de lumière","Humidité","CO2", "Niveau  sonore"]
    }
  },
  props: {
    roomId: {
      type: Number,
      required: false,
    },
  },
  computed: {
    ...mapGetters({
      roomsData: 'rooms/roomsData',
      buildingFromStore: 'geoGraphicContext/building',
    }),
  },
  watch: {
    roomId(id) {
      if (id) {
        this.extractData(id)
      }
    }
  },
  methods: {
    getRoomById(id) {
      if (!this.buildingFromStore || !this.buildingFromStore.floors) {
        return null;
      }
      for (const floor of this.buildingFromStore.floors) {
        const room = floor.rooms.find(room => room.id === id);
        if (room) {
          return room;
        }
      }

      return null;
    },
    extractData(id) {
      const roomData = this.roomsData.find(v => v.roomId === id)
      const room = this.getRoomById(id)
      this.choosedRoom = { ...roomData,...room }
    },
    displayData(props) {
      const data = (this.choosedRoom?.endpoints || []).find(endpoint => [props] in endpoint)
      if (!data) {
        return 'Non précisé'
      }
      const value = data[props];
      if (typeof value === 'number') {
        return value.toFixed(2)
      }
      if (typeof value === 'boolean') {
        return value === true ? 'Oui' : 'Non'
      }
      return `${props}: ${value}`
    },
    isOccupied(obj) {
      if (!obj?.endpoints) {
        return null;
      }
      if (obj.endpoints && Array.isArray(obj.endpoints)) {
        const occupationObj = obj.endpoints.find(endpoint => 'Occupation' in endpoint);
        if (occupationObj && occupationObj.Occupation === true) {
          return true;
        }
      }
      return false;
    },
    getChipClass(item) {
      const status = this.isOccupied(item);
      if (status === null) {
        return 'chips undefined';
      }
      return status ? 'chips valid' : 'chips invalid';
    },
    getChipText(item) {
      const status = this.isOccupied(item);
      if (status === null) {
        return 'Undefined';
      }
      return status ? 'Disponible' : 'Occupé';
    },
  }
};
</script>

<style lang="scss" scoped>
@mixin content{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
  .no_pick{
    @include content;
  }
  .picked{
    @include content;
    padding: 1em;
    width: auto;
    justify-content: start;
    flex-direction: column;
    .top{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      .chips {
        border-radius: 8px;
        width: fit-content;
        height: fit-content;
        padding: 0.2em 0.5em;
        font-size: 1.15rem;
    
        &.valid {
          background-color: #c0f3c0;
        }
    
        &.invalid {
          background-color: #fcc0c0;
        }
    
        &.undefined {
          background-color: #dfdfdf;
        }
      }
    }
    .room_value{
      display: grid;
      align-items: center;
      grid-template-columns: 1.3fr 0.7fr;
      gap: 0 0.725rem;
      width: 100%;
      margin-top: 1rem;
      .legend{
      text-align: right;
      margin-right: 0.5rem
      }
    }
  }
</style>
