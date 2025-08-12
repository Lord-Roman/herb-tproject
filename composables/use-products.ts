import { Method } from "#shared/enum/method.enum";
import type { Pagination } from "#shared/types/pagination";
import { useAuthorization } from "~/composables/use-authorization";
import type { Error } from "#shared/types/error";
import { ApiStatus } from "#shared/enum/api-status";
import type { Product } from "~/shared/types/product";

// Сервис для работы с API "Продуктов"
export const useProducts = () => {
  const { refresh } = useAuthorization();
  const toast = useToast();

  /**
   * Метод для работы с API "Продуктов"
   * Когда метод возвращает 401 (Unauthorized), отправляется запрос на обновление токена
   */

    const getAllProductFiles = async (): Promise<Pagination<Product> | null> => {
    try {
      return await getProductFilesAPI();
    } catch (e: unknown) {
      if ((e as Error).status === ApiStatus.Unauthorized) {
        await refresh();
        return await getProductFilesAPI();
      }
      toast.add({
        title: "Ошибка",
        color: "error",
        description: ((e as Error).data?.detail as string) ?? "",
      });
      return null;
    }
  };
  
  // Метод для получения всех данных о продукте
  const getProductFilesAPI = async (): Promise<Pagination<Product>> => {
    return await $fetch<Pagination<Product>>("/api/product_files/", {
      method: Method.GET,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  };


  const uploadProductFiles = async (body: FormData): Promise<Product | null> => {
    try {
      return await uploadProductFilesAPI(body);
    } catch (e: unknown) {
      if ((e as Error).status === ApiStatus.Unauthorized) {
        await refresh();
        return await uploadProductFilesAPI(body);
      }
      toast.add({
        title: "Ошибка",
        color: "error",
        description: ((e as Error).data?.detail as string) ?? "",
      });
      return null;
    }
  };

  // Метод для загрузки изображения в базу
  const uploadProductFilesAPI = async (body: FormData): Promise<Product> => {
    return await $fetch<Product>("/api/product_files/", {
      method: Method.POST,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body
    });
  };

  return {
    getAllProductFiles,
    uploadProductFiles
  };
};
