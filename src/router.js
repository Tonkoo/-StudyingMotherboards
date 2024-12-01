import { createRouter, createWebHistory } from "vue-router";
import MainMenu from "./MainMenu.vue";
import Quiz from "./Quiz.vue";

const routes = [
  { path: "/", component: MainMenu },
  { path: "/quiz/:id", name: "Quiz", component: Quiz },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
