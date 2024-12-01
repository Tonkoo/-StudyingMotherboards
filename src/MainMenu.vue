<template>
  <div class="flex flex-col items-center justify-center h-[80vh]">
    <h2 class="text-2xl font-bold mb-6">
      Выберите форм-фактор материнской платы:
    </h2>
    <div class="grid grid-cols-2 gap-4">
      <router-link
        v-for="formFactor in formFactors"
        :key="formFactor.id"
        :to="{ name: 'Quiz', params: { id: formFactor.id } }"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        {{ formFactor.name }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const formFactors = ref([
  { id: "atx", name: "ATX" },
  { id: "e-atx", name: "E-ATX" },
  { id: "micro-atx", name: "Micro-ATX" },
]);
</script>
