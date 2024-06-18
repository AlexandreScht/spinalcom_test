

<template>
    <vue-ellipse-progress :progress="percentage" :size="30" :loading="loading" fontSize="0.78rem" color="black"
      :thickness="2">
      <span slot="legend-value">%</span>
    </vue-ellipse-progress>
</template>

<script>
import { mapGetters } from 'vuex';
import { VueEllipseProgress } from "vue-ellipse-progress";

export default {
  components: {
    VueEllipseProgress
  },
  data() {
    return {
      loading: true,
      percentage: null,
    }
  },
  props: {
    rooms: {
      type: Array,
      required: true,
      validator(value) {
        return value.every(item => item.id && typeof item.id === 'number');
      },
    },
    reserved: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      roomsData: 'rooms/roomsData',
    }),
  },
  watch: {
    roomsData(newVal) {
      if (newVal.length) {
        this.displayFloorPercentage(newVal);
      }
    },
  },
  methods: {
    displayFloorPercentage(data) {
      this.loading = false
      const roomsIdInFloor = this.rooms.map(v => v.id)
      const roomsInCurrentFloor = data.filter(room => roomsIdInFloor.includes(room.roomId))
      const percentage = roomsInCurrentFloor.reduce((acc,item) => {
        if (item.endpoints && Array.isArray(item.endpoints) && !this.reserved) {
          const occupationObj = item.endpoints.find(endpoint => 'Occupation' in endpoint);
          if (occupationObj && occupationObj.Occupation === false) {
            return acc + 1;
          }
        }
        if ((this.reserved && !item.endpoints) || (this.reserved && !item.endpoints?.find(endpoint => 'Occupation' in endpoint))) {
          return acc + 1;
        }
        return acc;
      },0) / roomsInCurrentFloor.length * 100;

      this.percentage = Math.round(percentage);
    },
  },
};
</script>