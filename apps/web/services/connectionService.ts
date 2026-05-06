import { apiClient } from "@/services/api/client";
import type {
  Connection,
  ConnectionListResponse,
  ConnectionRequestPayload,
} from "@/types/connection";

const isConnection = (value: unknown): value is Connection =>
  typeof value === "object" && value !== null && "id" in value;

const normalizeConnectionListResponse = (payload: unknown): ConnectionListResponse => {
  if (payload && typeof payload === "object" && "results" in payload) {
    const results = (payload as { results?: unknown }).results;

    if (Array.isArray(results)) {
      return payload as ConnectionListResponse;
    }
  }

  if (Array.isArray(payload)) {
    return {
      count: payload.length,
      next: null,
      previous: null,
      results: payload.filter(isConnection),
    };
  }

  if (isConnection(payload)) {
    return {
      count: 1,
      next: null,
      previous: null,
      results: [payload],
    };
  }

  return {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
};

let receivedRequest: Promise<ConnectionListResponse> | null = null;
let sentRequest: Promise<ConnectionListResponse> | null = null;
let acceptedRequest: Promise<ConnectionListResponse> | null = null;

export const connectionService = {
  async list(params?: { status?: string; role?: string }): Promise<ConnectionListResponse> {
    const { data } = await apiClient.get<unknown>("/connections/", { params });
    return normalizeConnectionListResponse(data);
  },

  async pending(): Promise<ConnectionListResponse> {
    const { data } = await apiClient.get<unknown>("/connections/pending/");
    return normalizeConnectionListResponse(data);
  },

  async received(): Promise<ConnectionListResponse> {
    if (!receivedRequest) {
      receivedRequest = apiClient
        .get<unknown>("/connections/received/")
        .then(({ data }) => normalizeConnectionListResponse(data))
        .finally(() => {
          receivedRequest = null;
        });
    }

    return receivedRequest;
  },

  async sent(): Promise<ConnectionListResponse> {
    if (!sentRequest) {
      sentRequest = apiClient
        .get<unknown>("/connections/sent/")
        .then(({ data }) => normalizeConnectionListResponse(data))
        .finally(() => {
          sentRequest = null;
        });
    }

    return sentRequest;
  },

  async accepted(): Promise<ConnectionListResponse> {
    if (!acceptedRequest) {
      acceptedRequest = apiClient
        .get<unknown>("/connections/accepted/")
        .then(({ data }) => normalizeConnectionListResponse(data))
        .finally(() => {
          acceptedRequest = null;
        });
    }

    return acceptedRequest;
  },

  async request(matchedUserProfileId: number | string): Promise<Connection> {
    const payload: ConnectionRequestPayload = {
      matched_user_profile_id: matchedUserProfileId,
    };
    const { data } = await apiClient.post<Connection>("/connections/request/", payload);
    return data;
  },

  async accept(id: number | string): Promise<Connection> {
    const { data } = await apiClient.post<Connection>(`/connections/${id}/accept/`);
    return data;
  },

  async decline(id: number | string): Promise<Connection> {
    const { data } = await apiClient.post<Connection>(`/connections/${id}/decline/`);
    return data;
  },

  async cancel(id: number | string): Promise<Connection> {
    const { data } = await apiClient.post<Connection>(`/connections/${id}/cancel/`);
    return data;
  },

  async disconnect(id: number | string): Promise<Connection> {
    const { data } = await apiClient.post<Connection>(`/connections/${id}/disconnect/`);
    return data;
  },
};
