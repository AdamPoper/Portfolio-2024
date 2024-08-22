import { Persistance } from '../persistance/persistance';
import { Request, Response } from 'express';
import { Project, PROJECT_TABLE, ProjectModel, ProjectQueries } from '../entity/project';
import { PROJECT_MEDIA_TABLE, ProjectMedia, ProjectMediaModel, ProjectMediaQueries } from '../entity/projectmedia';
import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';

dotenv.config();

const addProject = (req: Request, res: Response, next: () => void): void => {
    const body = req.body as ProjectModel;
    const project = {
        title: body.title,
        technologies: body.technologies,
        description: body.description,
        url: body.url,
        github: body.github,
    } as Project;

    Persistance.persistEntity<Project>(PROJECT_TABLE, project)
        .then(([result]) => {
            if (body.media) {
                const mediaFiles = body.media.map(media => saveMediaFile(media, result.insertId));
                return Persistance.persistEntities<ProjectMedia>(PROJECT_MEDIA_TABLE, mediaFiles);
            }
        })
        .then(() => res.status(200).json({message: 'Successfully saved project ' + project.title}))
        .catch(() => res.status(500).json({message: 'Error saving project ' + project.title}));
}

const fetchAllProjects = (req: Request, res: Response): void => {
    Persistance.selectEntitiesByNamedQuery<Project>(ProjectQueries.QUERY_ALL)
        .then((projects: Project[]) => res.status(200).json(projects));
}

const fetchProjectMedia = (req: Request, res: Response): void => {
    if (!req.params.id) {
        throw new Error("No project id");
    }

    Persistance.selectEntitiesByNamedQuery<ProjectMedia>(ProjectMediaQueries.QUERY_BY_PROJECT_ID, [req.params.id])
        .then((media: ProjectMedia[]) => media.map(pm => projectMediaToModel(pm)))
        .then((models: ProjectMediaModel[]) => res.status(200).json(models));
}

const saveMediaFile = (media: ProjectMediaModel, project_id: number): ProjectMedia => {
    const filename = media.name;
    const bufferParts = media.buffer.split(',');
    const base64Data = bufferParts[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const mediaDir = process.env.PROJECT_MEDIA_DIR;
    if (!mediaDir) {
        throw new Error('Project media directory is not set');
    }

    const filepath = path.join(os.homedir(), process.env.PROJECT_MEDIA_DIR, filename);
    fs.writeFile(filepath, buffer, (error) => {
        if (error) {
            throw new Error('Error saving project media');
        }
    });

    return {
        name: filename,
        prefix: bufferParts[0],
        project_id,
        filepath,
    } as ProjectMedia;
}

const projectMediaToModel = (media: ProjectMedia): ProjectMediaModel => {
    const buffer = fs.readFileSync(media.filepath);
    const base64String = buffer.toString('base64');
    const result = [media.prefix, base64String].join(',');
    return {
        buffer: result,
        name: media.name
    } as ProjectMediaModel
}

export default {addProject, fetchAllProjects, fetchProjectMedia};