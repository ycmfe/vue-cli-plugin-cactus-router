import Vue from 'vue'
<%_ if (hasTypeScript) { _%>
import VueRouter, { RouteConfig } from 'vue-router'
<%_ } else { _%>
import VueRouter from 'vue-router'
<%_ } _%>
import autoRoutes from 'vue-auto-routing'
import { createRouterLayout } from 'vue-router-layout'

Vue.use(VueRouter)

const RouterLayout = createRouterLayout(layout => {
  return import('@/layouts/' + layout + '.vue')
})

<%_ if (hasTypeScript) { _%>
const routes: Array<RouteConfig> = [
<%_ } else { _%>
  const routes = [
<%_ } _%>
  {
    path: '/',
    component: RouterLayout,
    children: autoRoutes,
  },
  {
    path: '*',
    component: () => import('@/views/404.vue')
  }
]

const router = new VueRouter({
<%_ if (historyMode) { _%>
  mode: 'history',
  base: process.env.BASE_URL,
<%_ } _%>
  routes,
})

export default router
