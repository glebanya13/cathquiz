import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Reg from '../views/Reg.vue';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue';
import QuizList from '../views/QuizList.vue';
import Quiz from '../views/Quiz.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/regForAdmin',
    name: 'reg',
    component: Reg
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin
  },
  {
    path: '/quiz/:id',
    name: 'quiz',
    component: Quiz
  },
  {
    path: '/quizlist',
    name: 'QuizList',
    component: QuizList
  },
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;
