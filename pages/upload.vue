<script setup lang="ts">
import { useAuthorization } from "~/composables/use-authorization";
import { useProducts } from "~/composables/use-products";
import type { Pagination } from "#shared/types/pagination";
import CarouselComponent from "~/components/carousel-component.vue";
import Uploadfiles from "~/components/uploadfiles.vue";
import type { Product } from "~/shared/types/product";

const { logout } = useAuthorization();
const { getAllProductFiles } = useProducts();
const products = ref<Pagination<Product> | null>(null);

onMounted(async () => {
  await init();
});

const init = async () => {
  products.value = await getAllProductFiles();
};

const onLogout = async () => {
  await logout();
  navigateTo("/auth");
};
</script>

<template>

  <div class = content>
      <Uploadfiles @uploaded="init()"></Uploadfiles>
    <div class="flex flex-col justify-center items-center gap-3">
      <CarouselComponent :items="products?.results" title="Продукт №" />
      <UButton class="cursor-pointer" @click="onLogout()">Выйти</UButton>
    </div>
  </div>

</template>
<style scoped lang="css">
.content {
  display: flex;
  gap: 100px;
}
</style>