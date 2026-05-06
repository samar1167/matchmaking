import { apiClient } from "@/services/api/client";
import type {
  ConfirmCheckoutSessionRequest,
  ConfirmCheckoutSessionResponse,
  CreateCheckoutSessionResponse,
  PaymentHistoryResponse,
  PlanMeResponse,
  PlanParametersResponse,
} from "@/types/plan";

const toRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const getNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const getString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const getArray = (value: unknown): unknown[] | undefined =>
  Array.isArray(value) ? value : undefined;

const normalizePlanMeResponse = (payload: unknown): PlanMeResponse => {
  const record = toRecord(payload);

  if (!record) {
    return {};
  }

  const totalCredits =
    getNumber(record.total_credits) ??
    getNumber(record.credits) ??
    getNumber(record.remaining_credits);

  return {
    free_credits: getNumber(record.free_credits),
    paid_credits: getNumber(record.paid_credits),
    total_credits: totalCredits,
    paid_credit_price_usd: getString(record.paid_credit_price_usd),
    credits_per_purchase: getNumber(record.credits_per_purchase),
    credits: totalCredits,
  };
};

const normalizePaymentHistoryItem = (payload: unknown) => {
  const record = toRecord(payload);

  if (!record) {
    return null;
  }

  return {
    id:
      getNumber(record.id) ??
      getString(record.id) ??
      getString(record.payment_reference) ??
      "payment-record",
    amount_usd: getString(record.amount_usd),
    credits_purchased: getNumber(record.credits_purchased),
    payment_reference:
      getString(record.payment_reference),
    created_at: getString(record.created_at),
    completed_at: getString(record.completed_at),
    status: getString(record.status),
  };
};

const normalizePaymentHistoryResponse = (payload: unknown): PaymentHistoryResponse => {
  if (Array.isArray(payload)) {
    return {
      payments: payload
        .map((item) => normalizePaymentHistoryItem(item))
        .filter((item): item is NonNullable<typeof item> => item !== null),
    };
  }

  const record = toRecord(payload);

  if (!record) {
    return { payments: [] };
  }

  const rawPayments =
    getArray(record.payments) ??
    getArray(record.results) ??
    getArray(record.history) ??
    getArray(record.items) ??
    [];

  return {
    payments: rawPayments
      .map((item) => normalizePaymentHistoryItem(item))
      .filter((item): item is NonNullable<typeof item> => item !== null),
    meta: toRecord(record.meta) as PaymentHistoryResponse["meta"],
  };
};

let getCurrentRequest: Promise<PlanMeResponse> | null = null;
let getParametersRequest: Promise<PlanParametersResponse> | null = null;

export const planService = {
  async getCurrent(): Promise<PlanMeResponse> {
    if (!getCurrentRequest) {
      getCurrentRequest = apiClient
        .get("/plan/me/")
        .then(({ data }) => normalizePlanMeResponse(data))
        .finally(() => {
          getCurrentRequest = null;
        });
    }

    return getCurrentRequest;
  },

  async getParameters(): Promise<PlanParametersResponse> {
    if (!getParametersRequest) {
      getParametersRequest = apiClient
        .get<PlanParametersResponse>("/plan/parameters/")
        .then(({ data }) => data)
        .finally(() => {
          getParametersRequest = null;
        });
    }

    return getParametersRequest;
  },

  async getPaymentHistory(): Promise<PaymentHistoryResponse> {
    const { data } = await apiClient.get<PaymentHistoryResponse>(
      "/plan/payment_history/",
    );
    return normalizePaymentHistoryResponse(data);
  },

  async createCheckoutSession(): Promise<CreateCheckoutSessionResponse> {
    const { data } = await apiClient.post<CreateCheckoutSessionResponse>(
      "/plan/purchase/",
      {},
    );
    return data;
  },

  async confirmCheckoutSession(
    payload: ConfirmCheckoutSessionRequest,
  ): Promise<ConfirmCheckoutSessionResponse> {
    const { data } = await apiClient.post<ConfirmCheckoutSessionResponse>(
      "/plan/purchase_confirm/",
      payload,
    );
    return data;
  },
};
