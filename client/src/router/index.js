import Vue from "vue";
import VueRouter from "vue-router";
import Tracking from "../views/Tracking/Tracking.vue";
import Guide from "../views/Tracking/Guide.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "tracking",
    component: Tracking,
  },
  {
    path: "/guide",
    name: "guide",
    component: Guide,
  },
  {
    path: '/*',
    redirect: { name: 'home' }
}
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

export default router;