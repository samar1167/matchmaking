"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ApiErrorResponse } from "@/types/common";

type ServerMessagePayload =
  | ApiErrorResponse
  | string
  | string[]
  | Record<string, string | string[] | Record<string, string[]>>;

const missingProfileMessage = "Profile not found.";

const getServerMessage = (payload: ServerMessagePayload | undefined) => {
  if (!payload) {
    return null;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.find((value): value is string => typeof value === "string") || null;
  }

  if ("message" in payload && typeof payload.message === "string") {
    return payload.message;
  }

  if ("detail" in payload && typeof payload.detail === "string") {
    return payload.detail;
  }

  if ("error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return null;
};

export const isMissingProfileError = (error: unknown) =>
  isAxiosError<ServerMessagePayload>(error) &&
  error.response?.status === 404 &&
  getServerMessage(error.response?.data) === missingProfileMessage;

export function MissingProfileMessage({
  destination = "continue",
}: {
  destination?: string;
}): ReactNode {
  return (
    <>
      Your profile is not set yet.{" "}
      <Link
        className="text-[#7F533E] underline underline-offset-4 transition hover:text-[#5f3c2c]"
        href="/profile"
      >
        Complete your profile
      </Link>{" "}
      first to {destination}.
    </>
  );
}
