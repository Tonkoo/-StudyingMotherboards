<template>
  <div class="min-h-screen bg-gray-100">
    <header
      class="bg-blue-600 text-white p-4 flex items-center justify-between"
    >
      <h1 class="text-2xl font-bold">
        <a href="/">Изучение материнских плат</a>
      </h1>
      <button
        class="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
        @click="GoBackRoutes"
        v-if="$route.path !== '/'"
      >
        Назад
      </button>
    </header>
    <main class="container mx-auto p-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import router from "../src/router";
const GoBackRoutes = () => {
  if (window.history.state.back === null) {
    router.push((path = "/"));
  } else {
    router.back();
  }
};
</script>
