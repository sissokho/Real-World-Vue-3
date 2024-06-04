import { createRouter, createWebHistory } from 'vue-router'
import EventListView from '../views/EventListView.vue'
import EventDetailsView from '../views/event/DetailsView.vue'
import EventRegisterView from '../views/event/RegisterView.vue'
import EventEditView from '../views/event/EditView.vue'
import EventLayoutView from '../views/event/LayoutView.vue'
import AboutView from '../views/AboutView.vue'
import NotFound from '../views/NotFound.vue'
import NetworkError from '../views/NetworkError.vue'
import nProgress from 'nprogress'
import { inject } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'event-list',
      component: EventListView,
      props: (route) => ({ page: parseInt(route.query.page) || 1 })
    },
    {
      path: '/events/:id',
      name: 'event-layout',
      props: true,
      component: EventLayoutView,
      children: [
        {
          path: '',
          name: 'event-details',
          component: EventDetailsView
        },
        {
          path: 'register',
          name: 'event-register',
          component: EventRegisterView
        },
        {
          path: 'edit',
          name: 'event-edit',
          component: EventEditView,
          meta: { requireAuth: true }
        }
      ]
    },
    {
      path: '/event/:afterEvent(.*)',
      // redirect: (to) => ({ name: 'event-list', params: { id: to.params.id } })
      redirect: (to) => ({ path: `/events/${to.params.afterEvent}` })
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFound
    },
    {
      path: '/404/:resource',
      name: '404-resource',
      component: NotFound,
      props: true
    },
    {
      path: '/network-error',
      name: 'network-error',
      component: NetworkError
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from) => {
  const GStore = inject('GStore')

  nProgress.start()

  const notAuthorized = true
  if (to.meta.requireAuth && notAuthorized) {
    GStore.flashMessage = 'Sorry, you are not authorized to view this page'

    setTimeout(() => {
      GStore.flashMessage = ''
    }, 3000)

    if (from.href) {
      return false
    }

    return { path: '/' }
  }
})

router.afterEach((to, from) => {
  nProgress.done()
})

export default router
