<template>
  <div>
    <h1 class="loading" v-if="loading">
      Loading
    </h1>
    <div v-else class="rooms-list">
      <input type="text" v-model="searchQuery" placeholder="Rechercher une pièce par nom ou numéro" />
      <ul>
        <li @click="selectRoom(item)" v-for="item in filteredRooms" :key="item.id"
          :class="['row', { selected: item.id === choosedRoom }]">
          <div>
            <span>{{ item.name }}</span>
            <span :class="getChipClass(item)" class="chips">{{ getChipText(item) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      loading: true,
      rooms: [],
      searchQuery: '',
      choosedRoom: undefined,
    };
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
    filteredRooms() {
      if (!this.searchQuery) {
        return this.rooms;
      }
      return this.rooms.filter((room) => {
        const [numberPart,namePart] = room.name.split('-');
        const searchQueryLower = this.searchQuery.toLowerCase();
        return (
          numberPart.startsWith(this.searchQuery) ||
          (namePart && namePart.toLowerCase().startsWith(searchQueryLower))
        );
      });
    },
  },
  watch: {
    roomsData(newVal) {
      if (newVal.length) {
        this.displayFloorRooms(newVal);
      }
    },
    floorName() {
      if (this.roomsData.length) {
        this.displayFloorRooms(this.roomsData);
      }
    }
  },
  methods: {
    mergeArrays(arrayA,arrayB) {
      const arrayBMap = arrayB.reduce((map,obj) => {
        map[obj.roomId] = obj;
        return map;
      },{});

      return arrayA.map(objA => {
        const objB = arrayBMap[objA.id];
        return objB ? { ...objA,...objB } : objA;
      });
    },
    displayFloorRooms(data) {
      this.loading = false;
      const roomsInFloor = this.buildingFromStore.floors.find(floor => floor.name === this.floorName).rooms.map(v => ({ id: v.id,name: v.name }));
      this.rooms = this.mergeArrays(roomsInFloor,data);
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
    selectRoom(room) {
      this.choosedRoom = room.id;
      this.$emit('update:choosed',room.id); 
    }
  },
};
</script>


<style lang="scss" scoped>
@mixin box-shadow($color) {
  box-shadow: 0px 0px 3px 0px $color;
}
@mixin line-type {
  background-color: white;
  transform: scale(1.025);
  @include box-shadow(rgba(0, 0, 0, 0.18));
}
.loading{
  width: 100%;
  text-align: center;
}
.rooms-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 3rem 0 0;
  input{
    background-color: transparent;
    border: none;
    border-bottom: solid 1px black;
    padding-bottom: 0.125rem;
    font-size: 1.125rem;
    outline: none;
  }
  li{
    &:not(:last-child){
    margin-bottom: 0.795rem;
    }
    padding: 0.125rem 0;
    &:hover{
      cursor: pointer;
      @include line-type;
    }
    &.selected{
      @include line-type;
    }
    div{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .chips{
        border-radius: 8px;
        width: fit-content;
        height: fit-content;
        padding: 0.2em 0.5em;
        font-size: 0.95rem;
        &.valid{
          background-color: #c0f3c0;
        }
        &.invalid{
          background-color: #fcc0c0;
        }
        &.undefined{
          background-color: #dfdfdf;
        }
      }
    }
  }
}
</style>
