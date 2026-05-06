"use client";

import { cn } from "@/lib/cn";
import type { ProfilePictureVariants, UserProfile } from "@/types/profile";

type NamedPerson = {
  first_name?: string;
  last_name?: string;
  user?: {
    username?: string;
    first_name?: string;
    last_name?: string;
    profile_picture?: string | null;
    profile_picture_variants?: ProfilePictureVariants;
  };
  profile_picture?: string | null;
  profile_picture_variants?: ProfilePictureVariants;
};

const getNameParts = (person?: NamedPerson | null) => {
  const firstName = person?.first_name ?? person?.user?.first_name ?? "";
  const lastName = person?.last_name ?? person?.user?.last_name ?? "";

  return { firstName, lastName };
};

export const getPersonDisplayName = (
  person?: NamedPerson | null,
  fallback = "Unknown profile",
) => {
  const { firstName, lastName } = getNameParts(person);
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || person?.user?.username || fallback;
};

export const getPersonInitials = (person?: NamedPerson | null, fallback = "CN") => {
  const displayName = getPersonDisplayName(person, fallback);
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || fallback;
};

export const getPersonImageUrl = (person?: NamedPerson | UserProfile | null) =>
  person?.profile_picture_variants?.thumb ??
  person?.profile_picture_variants?.card ??
  person?.profile_picture_variants?.profile ??
  person?.profile_picture ??
  person?.user?.profile_picture_variants?.thumb ??
  person?.user?.profile_picture_variants?.card ??
  person?.user?.profile_picture_variants?.profile ??
  person?.user?.profile_picture ??
  null;

export function PersonAvatar({
  className,
  fallback = "CN",
  imageUrl,
  label,
}: {
  className?: string;
  fallback?: string;
  imageUrl?: string | null;
  label: string;
}) {
  const initials =
    label
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || fallback;

  if (imageUrl) {
    return (
      <img
        alt=""
        className={cn(
          "shrink-0 rounded-full border border-[#C07771] object-cover",
          className,
        )}
        src={imageUrl}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-[#C07771] bg-[#EABFB9] text-sm font-bold text-[#901214]",
        className,
      )}
    >
      {initials}
    </div>
  );
}
