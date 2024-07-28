import { RowDataPacket } from "mysql2";
import { ProjectMediaModel } from "./projectmedia";

export const PROJECT_TABLE = 'Project';

export interface Project extends RowDataPacket {
    id: number;
    title: string;
    technologies: string;
    description: string;
    url?: string;
    github?: string;
}

export interface ProjectRequestBody {
    title: string;
    technologies: string;
    description: string;
    url?: string;
    github?: string;
    media: ProjectMediaModel[];
}
