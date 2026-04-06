export interface ProfileData {
  firstName: string;
  lastName: string;
  role?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
}

export type AvatarProps = {
  firstName?: string;
  lastName?: string;
  name?: string;
  imageUrl?: string;
  className?: string;
  textClassName?: string;
};