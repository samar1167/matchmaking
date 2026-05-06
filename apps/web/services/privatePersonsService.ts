import { apiClient } from "@/services/api/client";
import type {
  CreatePrivatePersonRequest,
  DeletePrivatePersonResponse,
  PrivatePersonListResponse,
  PrivatePersonResponse,
  UpdatePrivatePersonRequest,
} from "@/types/private-persons";

const listRequests = new Map<string, Promise<PrivatePersonListResponse>>();

export const privatePersonsService = {
  async list(page?: number): Promise<PrivatePersonListResponse> {
    const requestKey = String(page ?? "first");
    const existingRequest = listRequests.get(requestKey);

    if (existingRequest) {
      return existingRequest;
    }

    const request = apiClient
      .get<PrivatePersonListResponse>("/private-persons/", {
        params: page ? { page } : undefined,
      })
      .then(({ data }) => data)
      .finally(() => {
        listRequests.delete(requestKey);
      });

    listRequests.set(requestKey, request);
    return request;
  },

  async getById(privatePersonId: string | number): Promise<PrivatePersonResponse> {
    const { data } = await apiClient.get<PrivatePersonResponse>(
      `/private-persons/${privatePersonId}/`,
    );
    return data;
  },

  async create(
    payload: CreatePrivatePersonRequest,
  ): Promise<PrivatePersonResponse> {
    const { data } = await apiClient.post<PrivatePersonResponse>(
      "/private-persons/",
      payload,
    );
    return data;
  },

  async update(
    privatePersonId: string | number,
    payload: UpdatePrivatePersonRequest,
  ): Promise<PrivatePersonResponse> {
    const { data } = await apiClient.put<PrivatePersonResponse>(
      `/private-persons/${privatePersonId}/`,
      payload,
    );
    return data;
  },

  async remove(privatePersonId: string | number): Promise<DeletePrivatePersonResponse> {
    await apiClient.delete(
      `/private-persons/${privatePersonId}/`,
    );
  },
};
