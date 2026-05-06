import { apiClient } from "@/services/api/client";
import type {
  CompatibilityRequest,
  CompatibilityResponse,
  CompatibilityHistoryResponse,
  TopMatchesResponse,
} from "@/types/compatibility";

let historyRequest: Promise<CompatibilityHistoryResponse> | null = null;
let topMatchesRequest: Promise<TopMatchesResponse> | null = null;
let transactionsRequest: Promise<CompatibilityHistoryResponse> | null = null;

export const compatibilityService = {
  async calculate(payload: CompatibilityRequest): Promise<CompatibilityResponse> {
    const { data } = await apiClient.post<CompatibilityResponse>(
      "/compatibility/check/",
      payload,
    );
    return data;
  },

  async history(): Promise<CompatibilityHistoryResponse> {
    if (!historyRequest) {
      historyRequest = apiClient
        .get<CompatibilityHistoryResponse>("/compatibility/history/")
        .then(({ data }) => data)
        .finally(() => {
          historyRequest = null;
        });
    }

    return historyRequest;
  },

  async transactions(): Promise<CompatibilityHistoryResponse> {
    if (!transactionsRequest) {
      transactionsRequest = apiClient
        .get<CompatibilityHistoryResponse>("/compatibility/transactions/")
        .then(({ data }) => data)
        .finally(() => {
          transactionsRequest = null;
        });
    }

    return transactionsRequest;
  },

  async topMatches(): Promise<TopMatchesResponse> {
    if (!topMatchesRequest) {
      topMatchesRequest = apiClient
        .get<TopMatchesResponse>("/compatibility/top_matches/")
        .then(({ data }) => data)
        .finally(() => {
          topMatchesRequest = null;
        });
    }

    return topMatchesRequest;
  },
};
