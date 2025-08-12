<template>
  <div v-if="error" class="error">{{ error }}</div>
  <div v-else-if="loading">Загрузка...</div>
  <div v-else>
    <template v-if="isImage">
      <img :src="url" alt="Просмотр файла" />
    </template>
    <template v-else-if="isPDF">
      <div class="pdf-view">
        <span>Это PDF файл</span>
        <a :href="url" download>Скачать</a>
        <a :href="url" target="_blank">Открыть в браузере</a>
      </div>
    </template>
    <template v-else>
      <div>Формат файла не поддерживается для предпросмотра</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
const config = useRuntimeConfig();

const route = useRoute();
const url = ref<string>();
const loading = ref(true);
const error = ref<string | null>(null);

const isImage = computed(() => {
  return url.value
    ? /\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg|ico)$/i.test(url.value)
    : false;
});

const isPDF = computed(() => {
  return url.value ? /\.pdf$/i.test(url.value) : false;
});

onMounted(() => {
  const name = route.params.id as string;

  if (!name) {
    error.value = "ID файла не указан";
    loading.value = false;
    return;
  } else {
    url.value = `${config.public.media}/files/${name}`;
    loading.value = false;
  }
});
</script>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}
img {
  max-width: 100%;
  max-height: 80vh;
  display: block;
  margin: 20px auto;
  border-radius: 12px;
}
.pdf-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
}
.pdf-view a {
  color: #007bff;
  text-decoration: none;
}
</style>
