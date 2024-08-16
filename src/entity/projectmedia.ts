import { RowDataPacket } from "mysql2";

export const PROJECT_MEDIA_TABLE = 'project_media';

export interface ProjectMedia extends RowDataPacket {
    id: number;
    project_id: number;
    prefix: string;
    filepath: string;
    name: string;
}

export interface ProjectMediaModel {
    name: string;
    buffer: string;
}