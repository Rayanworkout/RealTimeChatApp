import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import './style.css'

import App from './App.vue';

// Import the pages
import Home from './pages/Home.page.vue';
import Login from './pages/Login.page.vue';


// I create a router to manage my pages
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // On sections within the same page, I use smooth scrollBehavior
    { path: '/', component: Home, name: 'Home' },
    { path: '/login', component: Login, name: 'Login' },
  ],

  scrollBehavior(to, _, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, top: 0 };
    }
  }
});

createApp(App).use(router).mount('#app');