<template>
  <h1 style="font-size: 40px; text-align: center; margin-bottom: 30px">
    Вид платы - {{ route.params.id }}
  </h1>
  <div class="flex flex-col lg:flex-row">
    <div class="lg:w-2/3 relative">
      <div class="overflow-auto">
        <div class="relative" ref="boardContainer">
          <img
            :src="currentBoard.image"
            alt="Motherboard"
            class="w-full h-auto"
            ref="boardImage"
          />
          <div
            v-for="(placement, index) in placements"
            :key="index"
            :style="{
              left: `${placement.x}%`,
              top: `${placement.y}%`,
              width: `${placement.width}%`,
              height: `${placement.height}%`,
              borderRadius: '50%',
            }"
            :class="[
              'absolute border-2 border-blue-500',
              { 'cursor-move': !quizCompleted },
            ]"
            @mousedown="startDrag($event, index)"
            @touchstart="startDrag($event, index)"
          >
            <span
              class="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 text-sm whitespace-nowrap"
            >
              {{ placement.component }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="lg:w-1/3 p-4">
      <h2 class="text-xl font-bold mb-4">Компоненты:</h2>
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="component in availableComponents"
          :key="component"
          class="bg-gray-200 p-2 rounded cursor-move"
          draggable="true"
          @dragstart="dragStart($event, component)"
          @touchstart="touchStart($event, component)"
        >
          {{ component }}
        </div>
      </div>
      <button
        v-if="!quizCompleted"
        @click="checkAnswers"
        :class="isVisibleError ? 'bg-red-500' : 'bg-green-500'"
        class="mt-4 w-full hover:opacity-80 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Проверить
      </button>
      <button
        v-else
        @click="restartQuiz"
        class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Начать сначала
      </button>
      <p v-if="isVisibleError" class="mt-2 text-red-500 text-lg font-bold">
        Должны быть указаны все Компоненты
      </p>
      <div v-if="showResults" class="mt-4 p-4 bg-white rounded shadow">
        <h3 class="text-xl font-bold mb-2">Результаты:</h3>
        <ul>
          <li
            v-for="(result, index) in results"
            :key="index"
            :class="result.correct ? 'text-green-600' : 'text-red-600'"
          >
            {{ result.component }}:
            {{ result.correct ? "Правильно" : "Неправильно" }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";

// Import your images here
import FirstImage from "./images/ATX.jpg";
import SecondImage from "./images/Micro-ATX.jpg";
import ThirdImage from "./images/E-ATX.jpg";

const route = useRoute();
const boardImage = ref(null);
const boardContainer = ref(null);
const placements = ref([]);
const showResults = ref(false);
const results = ref([]);
const draggedElement = ref(null);
const dragOffset = ref({ x: 0, y: 0 });
const quizCompleted = ref(false);
const isVisibleError = ref(false);

const boards = {
  "e-atx": {
    image: ThirdImage,
    components: [
      "Процессор",
      "Оперативная память",
      "PCI-E",
      "SATA-порты",
      "CMOS-батарея",
      "Разъем для питания материнской платы",
    ],
    correctPlacements: {
      Процессор: { x: 53, y: 26, width: 23, height: 16 },
      "Оперативная память": { x: 43.4, y: 7.5, width: 44, height: 12 },
      "PCI-E": { x: 24, y: 58, width: 25, height: 3 },
      "SATA-порты": { x: 71, y: 76.5, width: 12, height: 7 },
      "CMOS-батарея": { x: 17, y: 59, width: 5, height: 5 },
      "Разъем для питания материнской платы": {
        x: 24,
        y: 2,
        width: 15,
        height: 5,
      },
    },
  },
  atx: {
    image: FirstImage,
    components: [
      "Процессор",
      "Оперативная память",
      "Разъем для питания материнской платы",
      "SATA порты",
      "2-ой PCI-E слоты",
      "M.2 Слот",
    ],
    correctPlacements: {
      Процессор: { x: 43, y: 19, width: 15, height: 20 },
      "Оперативная память": { x: 67, y: 8, width: 14.5, height: 43 },
      "Разъем для питания материнской платы": {
        x: 84,
        y: 17.5,
        width: 5,
        height: 15.5,
      },
      "SATA порты": { x: 84, y: 72.5, width: 7, height: 10 },
      "2-ой PCI-E слоты": { x: 25, y: 64, width: 25, height: 4.5 },
      "M.2 Слот": { x: 79.5, y: 82, width: 4.5, height: 6 },
    },
  },
  "micro-atx": {
    image: SecondImage,
    components: [
      "Процессор",
      "Оперативная память",
      "8-пиновый разъём",
      "M.2 Слот",
      "CMOS-батарея",
    ],
    correctPlacements: {
      Процессор: { x: 36, y: 18, width: 18, height: 22 },
      "Оперативная память": { x: 72, y: 8, width: 9, height: 50 },
      "8-пиновый разъём": { x: 27.5, y: 5, width: 7.5, height: 4 },
      "M.2 Слот": { x: 53, y: 68, width: 7, height: 9.5 },
      "CMOS-батарея": { x: 18, y: 67, width: 7, height: 7 },
    },
  },
};

const currentBoard = computed(() => boards[route.params.id]);
const availableComponents = ref([]);

onMounted(() => {
  resetQuiz();
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("touchmove", onTouchMove);
  window.addEventListener("touchend", onTouchEnd);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("touchend", onTouchEnd);
});

function dragStart(event, component) {
  if (!quizCompleted.value) {
    event.dataTransfer.setData("text/plain", component);
  } else {
    event.preventDefault();
  }
}

function touchStart(event, component) {
  if (!quizCompleted.value) {
    event.preventDefault();
    const touch = event.touches[0];
    const dropEvent = new DragEvent("drop", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    dropEvent.dataTransfer = {
      getData: () => component,
    };
    onDrop(dropEvent);
  }
}

function startDrag(event, index) {
  if (!quizCompleted.value) {
    event.preventDefault();
    draggedElement.value = index;
    const rect = event.target.getBoundingClientRect();
    const containerRect = boardContainer.value.getBoundingClientRect();
    dragOffset.value = {
      x:
        (((event.clientX || event.touches[0].clientX) - rect.left) /
          containerRect.width) *
        100,
      y:
        (((event.clientY || event.touches[0].clientY) - rect.top) /
          containerRect.height) *
        100,
    };
  }
}

function onMouseMove(event) {
  handleMove(event.clientX, event.clientY);
}

function onTouchMove(event) {
  const touch = event.touches[0];
  handleMove(touch.clientX, touch.clientY);
}

function handleMove(clientX, clientY) {
  if (draggedElement.value !== null && !quizCompleted.value) {
    const containerRect = boardContainer.value.getBoundingClientRect();
    const newX = ((clientX - containerRect.left) / containerRect.width) * 100;
    const newY = ((clientY - containerRect.top) / containerRect.height) * 100;

    placements.value[draggedElement.value].x = Math.max(
      0,
      Math.min(
        newX - dragOffset.value.x,
        100 - placements.value[draggedElement.value].width
      )
    );
    placements.value[draggedElement.value].y = Math.max(
      0,
      Math.min(
        newY - dragOffset.value.y,
        100 - placements.value[draggedElement.value].height
      )
    );
  }
}

function onMouseUp() {
  draggedElement.value = null;
}

function onTouchEnd() {
  draggedElement.value = null;
}

function checkAnswers() {
  if (
    Object.keys(currentBoard.value.correctPlacements).length !=
    placements.value.length
  ) {
    isVisibleError.value = true;
    return;
  }
  isVisibleError.value = false;

  results.value = placements.value.map((placement) => {
    const correctPlacement =
      currentBoard.value.correctPlacements[placement.component];
    const isCorrect =
      placement.x >= correctPlacement.x - 5 &&
      placement.x <= correctPlacement.x + 5 &&
      placement.y >= correctPlacement.y - 5 &&
      placement.y <= correctPlacement.y + 5;
    return {
      component: placement.component,
      correct: isCorrect,
    };
  });
  showResults.value = true;
  quizCompleted.value = true;
}

function restartQuiz() {
  resetQuiz();
  showResults.value = false;
  quizCompleted.value = false;
}

function resetQuiz() {
  availableComponents.value = [...currentBoard.value.components];
  placements.value = [];
}

function onDrop(e) {
  if (!quizCompleted.value) {
    e.preventDefault();
    const component = e.dataTransfer.getData("text");
    const rect = boardContainer.value.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const correctPlacement = currentBoard.value.correctPlacements[component];
    placements.value.push({
      component,
      x: Math.max(
        0,
        Math.min(x - correctPlacement.width / 2, 100 - correctPlacement.width)
      ),
      y: Math.max(
        0,
        Math.min(y - correctPlacement.height / 2, 100 - correctPlacement.height)
      ),
      width: correctPlacement.width,
      height: correctPlacement.height,
    });

    const index = availableComponents.value.indexOf(component);
    if (index > -1) {
      availableComponents.value.splice(index, 1);
    }
  }
}

onMounted(() => {
  boardContainer.value.addEventListener("dragover", (e) => e.preventDefault());
  boardContainer.value.addEventListener("drop", onDrop);
});
</script>

<style scoped>
.cursor-move {
  cursor: move;
}
</style>
