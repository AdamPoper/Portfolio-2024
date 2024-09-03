import { RowDataPacket } from "mysql2";
import { ProjectMediaModel } from "./projectmedia";

export const PROJECT_TABLE = 'project';

export interface Project extends RowDataPacket {
    id: number;
    title: string;
    technologies: string;
    description: string;
    url?: string;
    github?: string;
}

export interface ProjectModel {
    title: string;
    technologies: string;
    description: string;
    url?: string;
    github?: string;
    media: ProjectMediaModel[];
}

export const ProjectQueries = {
    QUERY_ALL: 'select * from project'
}