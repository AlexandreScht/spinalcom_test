<template>
  <main>
    <div class="mainContent">
      <div class="Top">
        <h1>Analyse de l'occupation</h1>
        <div class="selector">
          <buildingList />
        </div>
      </div>
      <div v-if="error">Error: {{ error }}</div>
      <div v-else-if="!building">Loading...</div>
      <div class="body" v-else>
        <div class="leftContent">
          <div class="leftWrapper">
            <div class="title">
              <span>Etablissement:</span>
              <b>{{ building.name }}</b>
            </div>
            <div class="stats">
              <span>{{ buildingStats() }}</span>
            </div>
          </div>
          <div class="floorContent">
            <buildingFloors @update:choosed="handleFloorChange" />
          </div>
          <div class="choosed_one">
            <choosedFloor :floor-name="floorName" />
          </div>
        </div>
        <div class="rooms_list">
          <roomsList @update:choosed="handleRoomChoose" :floor-name="floorName" />
        </div>
        <div class="rooms_description">
          <roomDetails :roomId="roomId" />
        </div>
      </div>
    </div>
    <div class="footer">
      <img src="https://www.groupe-stratos.com/acceleration/img/participant/spinalcom.png" class="lazy-image"
        ref="image" />
    </div>
  </main>
</template>

<script>
import { mapActions,mapGetters } from 'vuex';
import buildingFloors from '@/components/building-floors.vue';
import choosedFloor from '@/components/choosed-floor.vue';
import buildingList from '@/components/building-list.vue';
import roomsList from '@/components/rooms-list.vue';
import roomDetails from '@/components/room-details.vue';
export default {
  components: {
    buildingFloors,
    choosedFloor,
    buildingList,
    roomsList,
    roomDetails
  },
  data() {
    return {
      error: null,
      building: null,
      floorName: '',
      roomId: undefined
    };
  },
  computed: {
    ...mapGetters({
      buildingFromStore: 'geoGraphicContext/building',
    }),
  },
  methods: {
    ...mapActions({
      getAllInBuilding: 'geoGraphicContext/getAllInBuilding',
    }),
    async loadBuildData() {
      if (!this.buildingFromStore) {
        const { err,result } = await this.getAllInBuilding();
      if (err) {
        this.error = err;
        return;
      }
        this.building = result;
      } else {
        this.building = this.buildingFromStore;
      }
      this.floorName = this.building.floors[0].name;
    },
    handleFloorChange(newFloorName) {
      this.floorName = newFloorName
    },
    handleRoomChoose(newRoomId) {
      this.roomId = newRoomId
    },
    buildingStats() {
      const floors = this.buildingFromStore?.floors?.length || 0
      const rooms = this.buildingFromStore?.floors?.reduce((acc,value) => acc += value?.rooms?.length || 0,0)
      return `${floors} étage${floors > 1 ? "s" : ""} - ${rooms} pièce${rooms > 1 ? "s" : ""}`
    }
  },
  async created() {
    await this.loadBuildData();
  },
};
</script>

<style lang="scss" scoped>
@mixin box-shadow($color) {
  box-shadow: 0px 0px 3px 0px $color;
}

@mixin card-style {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.02);
  @include box-shadow(rgba(0, 0, 0, 0.18));
  font-size: 1.35rem;
  border-radius: 2px;
  padding: 1rem 0.5rem
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 95vh;

  .mainContent {
    width: 85%;
    border-radius: 25px;
    margin-top: 4rem;
    height: 70%;
    display: grid;
    grid-template-rows: 0.1fr 60vh;
    
    .Top{
      width: 100%;
      display: flex;
      align-items: end;
      flex-direction: row;
      justify-content: space-between;
      h1 {
        margin: 0 0 1rem 0;
        }
        .selector{
          @include card-style;
          width: 10rem;
          height: fit-content;
          padding: 0;
          margin: 0;
          }
    }
    
    .body {
      display: grid;
      margin-top: 1rem;
      gap: 0 5%;
      height: 100%;
      grid-template-columns: 0.95fr 1fr 1fr;

      .leftContent {
        display: flex;
        flex-direction: column;
        width: 100%;

        .leftWrapper {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;

          .title {
            @include card-style;

            b {
              margin-left: 0.45rem;
            }
          }

          .stats {
            @include card-style;
          }
        }

        .floorContent {
          margin: auto 0;
          @include card-style;
          width: 100%;
          padding: 1rem 0;
        }
        .choosed_one {
          min-height: 5rem;
          @include card-style;
          width: 100%;
          padding: 1rem 0;
        }
      }
      .rooms_list{
        @include card-style;
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden
      }
      .rooms_description{
        @include card-style;
        width: 100%;
        padding: 0;
      }
    }
  }
  .footer{
    width: 100%;
    display: flex;
    justify-content: center;
    height: 80px;
    align-items: center;
    margin-top: 4rem;
    .lazy-image{
      height: 100%;
      width: auto;
      display: block;
      margin: 0 auto;
      background-color: red;
    }
  }
}
</style>