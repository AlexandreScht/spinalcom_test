<template>
  <v-select v-model="selectedCountry" :options="buildingList" placeholder="Etablissement" searchable />
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      buildingList: [],
      selectedCountry: '',
      loading: true,
    };
  },
  computed: {
    ...mapGetters({
      buildingFromStore: 'geoGraphicContext/building',
    }),
  },
  watch: {
    buildingFromStore(newVal) {
      if (newVal) {
        this.getBuildingList(newVal);
      }
    },
  },
  methods: {
    async getBuildingList(building) {
      this.loading = false;
      this.buildingList.push(building.name)
      this.selectedCountry = building.name
    },
  },
};
</script>

<style lang="scss" scoped>
.vs__selected{
  font-size: 0.5rem;
}
</style>