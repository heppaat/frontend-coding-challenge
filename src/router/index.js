import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Winners from "@/views/Winners.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/winners",
    name: "Winners",
    component: Winners,
    props: (route) => ({
      winnersArray: route.query.winners ? JSON.parse(route.query.winners) : [],
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
