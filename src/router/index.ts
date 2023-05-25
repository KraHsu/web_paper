import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import User from '@/views/User.vue'
import Home from '@/views/Home.vue'
import PaperStatus from '@/components/user/PaperStatus.vue';
import Messages from '@/components/user/Messages.vue';
import Announcement from '@/components/user/Announcement.vue';
import Personal from '@/components/user/Personal.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/user',
      name: 'user',
      meta: {
        requireAuth: true,
        transition: ''
        // requireIdentify: true
      },
      children: [
        {
          path: 'message',
          component: Messages,
        },
        {
          path: 'announcement',
          component: Announcement,
        },
        {
          path: 'personaldata',
          component: Personal,
        },
        {
          path: 'papers',
          component: PaperStatus,
        },
        {
          path: '',
          component: PaperStatus,
        },
      ],
      component: User
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (localStorage.getItem("access_token")) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
});

export default router
