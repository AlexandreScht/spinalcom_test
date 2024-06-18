// src/main.js
import store from '@/store';
import Vue from 'vue';
import VueEllipseProgress from 'vue-ellipse-progress';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import App from './App.vue';

Vue.use(VueEllipseProgress);
Vue.component('v-select', vSelect);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
