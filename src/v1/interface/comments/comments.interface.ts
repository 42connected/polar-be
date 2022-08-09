import { CadetsInterface } from "../cadets/cadets.interface";

export interface CommentsInterface {
    mentors : string;
    cadets: CadetsInterface;
    content: string;    
    isDeleted?: boolean;
    deletedAt: Date;
    createdAt: Date;
}