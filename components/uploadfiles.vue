<template>
    <div class="uploader">
        <div class="preview">
            <div v-if="previewUrl" class="preview__content">
                <img
                    class="preview__image preview__item"
                    :src="previewUrl"
                    alt="preview"
                />
                <textarea
                    class="preview__description preview__item"
                    placeholder="Введите описание файла"
                    v-model="description"
                    :disabled="!file"
                    rows="4"
                ></textarea>
            </div>
        </div>

        <div class="uploader__contols">
            <input
                class="uploader__input"
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml,image/x-icon"
                @change="chooseFile"
            />
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
      <UButton v-if="id" class="cursor-pointer" @click="navigateToProduct()">Перейти к файлу</UButton>

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

const id = ref<string | null>(null);
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const fileName = ref<string>("");
const description = ref<string>("");
const fileInput = ref<HTMLInputElement | null>(null);

const { uploadProductFiles } = useProducts();

const fileNameOnButton = computed(() => {
    return file.value ? `Выбран ${file.value.name}` : "Выберите изображение";
});

const navigateToProduct = async () => {
  navigateTo(`/product/${id.value}`);
}

const chooseFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || !target.files.length) return;

    const selectedFile = target.files[0];

    if (!selectedFile.type.startsWith("image/")) {
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
    fileName.value = file.value.name.replace(/\.[^/.]+$/, "");

    formData.append("file", file.value);
    formData.append("name", fileName.value);
    formData.append("description", description.value);

    const response = await uploadProductFiles(formData);

    if (response) {
        id.value = response.id.toString();
        resetForm();
        emit("uploaded"); // Для обновления списка
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
