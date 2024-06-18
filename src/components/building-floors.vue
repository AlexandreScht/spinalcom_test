<template>
  <div class="content">
    <h2 class="title">Liste des étages</h2>
    <div class="wrapper">
      <div class="header">
        <span class="name">étages</span>
        <span class="legend">occupé</span>
        <span class="legend">undefined</span>
      </div>
      <button :class="['row', { selected: floor.name === choosed }]" @click="selectFloor(floor.name)"
        v-for="(floor, i) in floors" :key="i">
        <span class="name">{{ floor.name }}</span>
        <div class="graph">
          <floorPercentage :rooms="floor.rooms" />
        </div>
        <div class="graph">
          <floorPercentage :reserved="true" :rooms="floor.rooms" />
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex';
import floorPercentage from '@/components/floor-percentage.vue';

export default {
  components: {
    floorPercentage,
  },
  data() {
    return {
      choosed: null,
      error: null,
      floors: null,
    };
  },
  computed: {
    ...mapGetters({
      buildingFromStore: 'geoGraphicContext/building',
    }),
  },
  methods: {
    ...mapActions({
      fetchAllRoomsData: 'rooms/fetchAllRoomsData',
    }),
    async getFloors(building) {
      const floors = building?.floors?.map(floor => ({
        name: floor.name,
        rooms: floor.rooms,
      }));
      this.floors = floors;
      this.choosed = floors[0].name
      await this.fetchAllRoomsData(floors.flatMap(floor => floor.rooms));
    },
    selectFloor(floorName) {
      this.choosed = floorName;
      this.$emit('update:choosed',floorName); 
    },

  },
  created() {
    if (this.buildingFromStore) {
      this.getFloors(this.buildingFromStore);
    }
  },
};
</script>

<style lang="scss" scoped>
@mixin box-shadow($color) {
  box-shadow: 0px 0px 3px 0px $color;
}

@mixin choosed-one {
  background-color: white;
  @include box-shadow(rgba(0, 0, 0, 0.18));
}

@mixin line-type {
    display: grid;
    padding: 2px 0;
    outline: none;
    border: none;
    border-radius: 5px;
    background-color: transparent;
    align-items: center;
    grid-template-columns: 35% 4rem 5.5rem;
    gap: 0 0.725rem;
    width: 100%;
}

.content {
  width: 100% !important;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    width: 100%;
    text-align: center;
    font-size: 1.5rem;
    margin: 0;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem 0;
    width: 80%;
    margin-top: 1.5rem;
    .header{
      @include line-type;
      font-size: 1.1rem;
      span{
        font-weight:600;
      }
      .name{
        text-align: right;
        margin-right: 0.25rem;
      }
      .legend{
        text-align: center;
      }
    }
    .row {
      @include line-type;
      &:hover{ 
        @include choosed-one;
        cursor: pointer;
      }
      .name {
        text-align: right;
        font-weight: lighter;
        font-size: 1.1rem;
        margin-right: 0.25rem;
      }
      .graph{
        width: 100%;
        display: flex;
        justify-content: center;
      }
      &.selected {
        @include choosed-one;
      }
    }
  }
}
</style>
