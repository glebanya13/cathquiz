import Vue from 'vue';
import Vuex from 'vuex';
import userModule from './modules/user.js';
import generalModule from './modules/general.js';
import userDataModule from './modules/userData.js';
import quizModule from './modules/quiz.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userModule,
    generalModule,
    userDataModule,
    quizModule
  }
});
