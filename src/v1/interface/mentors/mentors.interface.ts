export interface MentorsInterface {
  id?: string;
  intraId: string;
  name?: string;
  email?: string;
  company?: string;
  duty?: string;
  profileImage?: string;
  availableTime?: string;
  introduction?: string;
  tags?: string[];
  isActive: boolean;
  markdownContent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
