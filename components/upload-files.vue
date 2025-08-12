<template>
  <div class="uploader">
    <div class="preview">
      <div v-if="previewUrl" class="preview__content">
        <template v-if="file?.type.startsWith('image/')">
          <img
            class="preview__image preview__item"
            :src="previewUrl"
            alt="preview"
          >
        </template>
        <template v-else-if="file?.type === 'application/pdf'">
          <div class="preview__pdf preview__item">
            <span>PDF файл выбран</span>
            <a :href="previewUrl" target="_blank">Открыть PDF</a>
          </div>
        </template>

        <textarea
          v-model="description"
          class="preview__description preview__item"
          placeholder="Введите описание файла"
          :disabled="!file"
          rows="4"
        />
      </div>
    </div>

    <div class="uploader__contols">
      <input
        ref="fileInput"
        class="uploader__input"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml,image/x-icon,application/pdf"
        @change="chooseFile"
      >
      <UButton
        type="button"
        class="cursor-pointer"
        @click="fileInput?.click()"
      >
        {{ fileNameOnButton }}
      </UButton>
      <UButton
        :disabled="!file"
        class="cursor-pointer"
        @click="uploadFile"
      >
        Загрузить
      </UButton>
      <UButton v-if="name" class="cursor-pointer" @click="navigateToProduct()">
        Перейти к файлу
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UButton } from "#components";
import { useProducts } from "~/composables/use-products";
import { computed, ref } from "vue";

const emit = defineEmits<{
  (e: "uploaded"): void;
}>();

const name = ref<string | null>(null);
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const fileName = ref<string>("");
const description = ref<string>("");
const fileInput = ref<HTMLInputElement | null>(null);

const { uploadProductFiles } = useProducts();

const fileNameOnButton = computed(() => {
  return file.value ? `Выбран ${file.value.name}` : "Загрузите изображение или PDF";
});

const navigateToProduct = () => {
  if (name.value) navigateTo(`/product/${name.value}`);
};

const chooseFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files.length) return;

  const selectedFile = target.files[0];

  if (
    !selectedFile.type.startsWith("image/") &&
    selectedFile.type !== "application/pdf"
  ) {
    resetForm();
    return;
  }

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  file.value = selectedFile;
  previewUrl.value = URL.createObjectURL(selectedFile);
  description.value = "";
};

const uploadFile = async () => {
  if (!file.value) return;

  const formData = new FormData();
  fileName.value = file.value.name;

  formData.append("file", file.value);
  formData.append("name", fileName.value);
  formData.append("description", description.value);

  const response = await uploadProductFiles(formData);

  if (response) {
    name.value = response.file.replace(/^.*\/([^/]+)$/, "$1");
    resetForm();
    emit("uploaded");
  }
};

const resetForm = (): void => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  file.value = null;
  description.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};
</script>

<style scoped>
.preview {
  height: 300px;
}
.preview__content {
  display: flex;
  gap: 20px;
}
.preview__item {
  border: 1px solid #ddd;
  border-radius: 12px;
}
.preview__description {
  background-color: #fafafa;
  padding: 20px;
  width: 300px;
}
.preview__image {
  min-width: 300px;
  max-height: 300px;
}
.preview__pdf {
  min-width: 300px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}
.uploader__contols {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.uploader__input {
  display: none;
}
</style>
