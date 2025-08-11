<template>
  <div v-if="error" class="error">{{ error }}</div>
  <div v-else-if="loading">Загрузка...</div>
  <div v-else>
    {{ product }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProducts } from "~/composables/use-products";
import type { Product } from "~/shared/types/product";

const { getSingleProductFile } = useProducts();

const route = useRoute();
const product = ref<Product|null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted( async () => {
  const id = route.params.id as string;

  if (!id) {
    error.value = "ID файла не указан";
    loading.value = false;
    return;
  }

  const response = await getSingleProductFile(id);

  if(response){
    product.value = response;
    loading.value = false;
  }else[
    error.value = "Ошибка загрузки"
  ]
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
</style>
