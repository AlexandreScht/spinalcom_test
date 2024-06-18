<template>
  <div class="floor_stat_wrapper">
    <h1>{{ floorName }}</h1>
    <span v-if="loading">Loading</span>
    <span v-else>
      {{ roomAvailability }}
    </span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      loading: true,
      availableRoomsNumber: 0,
    }
  },
  props: {
    floorName: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      roomsData: 'rooms/roomsData',
      buildingFromStore: 'geoGraphicContext/building',
    }),
    roomAvailability() {
      const roomCount = this.availableRoomsNumber.length;
      return `${roomCount} pièce${roomCount > 1 ? 's' : ''} encore disponible${roomCount > 1 ? 's' : ''}`;
    }
  },
  watch: {
    roomsData(newVal) {
      if (newVal.length) {
        this.displayFloorStats(newVal);
      }
    },
    floorName() {
      if (this.roomsData.length) {
        this.displayFloorStats(this.roomsData);
      }
    }
  },
  methods: {
    mergeArrays(arrayA,arrayB) {
      const arrayBMap = arrayB.reduce((map,obj) => {
        map[obj.id] = obj;
        return map;
      },{});

      const mergedArray = arrayA.map(objA => {
        const objB = arrayBMap[objA.id];
        return objB ? { ...objA,...objB } : { ...objA };
      });

      return mergedArray;
    },
    displayFloorStats(data) {
      this.loading = false
      const roomsIdInFloor = this.buildingFromStore.floors.find(floor => floor.name === this.floorName).rooms.map(v => v.id)
      const roomsAvailableInCurrentFloor = data.filter(room => roomsIdInFloor.includes(room.roomId) && room?.endpoints?.some(endpoint => endpoint.Occupation))
      this.availableRoomsNumber = roomsAvailableInCurrentFloor
    },
  },
};
</script>

<style lang="scss" scoped>
  .floor_stat_wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%; height: 100%;
    h1{
      margin: 0;
    }
    span{
      margin-top: 0.25rem;
    }
  }
</style>
