import type { ApiMeta, PaginatedResponse } from "@/types/common";
import type { AuthUser } from "@/types/auth";

export interface ProfilePictureVariants {
  original?: string | null;
  thumb?: string | null;
  card?: string | null;
  profile?: string | null;
}

export interface UserProfile {
  id: number;
  user?: AuthUser;
  first_name?: string;
  last_name?: string;
  gender?: string | null;
  profile_picture?: string | null;
  profile_picture_variants?: ProfilePictureVariants;
  public_match?: boolean | null;
  date_of_birth?: string;
  time_of_birth?: string;
  place_of_birth?: string;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProfileRequest {
  first_name?: string;
  last_name?: string;
  gender?: string | null;
  profile_picture?: File | null;
  remove_profile_picture?: boolean;
  public_match: boolean;
  date_of_birth?: string;
  time_of_birth?: string;
  place_of_birth?: string;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string;
}

export interface UpdateProfileRequest extends CreateProfileRequest {}

export interface ProfileListResponse extends PaginatedResponse<UserProfile> {
  meta?: ApiMeta;
}

export interface ProfileResponse extends UserProfile {
  meta?: ApiMeta;
}
