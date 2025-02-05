<template>
  <teleport to="body">
    <div class="no-scroll" v-if="active">
      <div class="text-center progress-loader">
        <div class="download-icon">
          <v-img
            width="50"
            height="50"
            :src="require('@/assets/zip-icon.svg')"
          ></v-img>
        </div>

        <v-progress-circular
          :model-value="value"
          :rotate="360"
          :size="100"
          :width="15"
          color="white"
          :indeterminate="isIndeterminate"
        >
        </v-progress-circular>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, defineProps, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  value: {
    type: Number,
    default: null,
  },
});

const active = ref(true); // Manage whether the overlay should be shown

const isIndeterminate = computed(() => {
  return props.value === null || props.value === undefined;
});

// Disable and enable scroll
const disableScroll = () => {
  document.body.style.overflow = "hidden";
};

const enableScroll = () => {
  document.body.style.overflow = "";
};

onMounted(() => {
  disableScroll();
});

onUnmounted(() => {
  enableScroll();
});
</script>

<style scoped>
.no-scroll {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  z-index: 9999999 !important;
}

.progress-loader {
  position: relative;
  z-index: 9999999 !important;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}
.download-icon {
  padding: 1rem;
  border-radius: 100%;
  background: #ffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
