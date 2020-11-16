import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import firebaseConfig from './config/firebase';
import firebase from 'firebase';
import VuetifyConfirm from 'vuetify-confirm'
import vueAwesomeCountdown from 'vue-awesome-countdown'
import VueClipboard from 'vue-clipboard2'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueClipboard)
Vue.use(vueAwesomeCountdown, 'vac')
Vue.use(VueLocalStorage)

const moment = require('moment')
require('moment/locale/ru')

Vue.use(require('vue-moment'), {
    moment
})

Vue.config.productionTip = false;

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

Vue.$db = db;

Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: 'Да',
  buttonFalseText: 'Нет',
  color: 'warning',
  icon: 'warning',
  title: 'Опасно',
  width: 350,
  property: '$confirm'
})  

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    let vm = this;
    firebase.auth().onAuthStateChanged(function (user) {
      vm.$store.dispatch('STATE_CHANGED', user);
    });

  }
}).$mount('#app');
