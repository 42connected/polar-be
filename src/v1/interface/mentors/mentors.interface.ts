export interface MentorsInterface {
  id?: string;
  intraId: string;
  name: string;
  profileImage?: string;
  availableTime?: string;
  introduction?: string;
  isActive: boolean;
  markdownContent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
