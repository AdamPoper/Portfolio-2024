import { Persistance } from '../persistance/persistance';
import { Request, Response } from 'express';
import { Project, PROJECT_TABLE, ProjectRequestBody } from '../entity/project';
import { PROJECT_MEDIA_TABLE, ProjectMedia, ProjectMediaModel } from '../entity/projectmedia';
import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';

dotenv.config();

const addProject = (req: Request, res: Response, next: () => void): void => {
    const body = req.body as ProjectRequestBody;
    const project = {
        title: body.title,
        technologies: body.technologies,
        description: body.description,
        url: body.url,
        github: body.github,
    } as Project;


    Persistance.persistEntity<Project>(PROJECT_TABLE, project)
        .then(([result]) => {
            const mediaFiles = body.media.map(media => saveMediaFile(media, result.insertId));
            return Persistance.persistEntities<ProjectMedia>(PROJECT_MEDIA_TABLE, mediaFiles);
        })
        .then(() => res.status(200).send('Successfully saved project ' + project.title))
        .catch(() => res.status(500).send('Error saving project ' + project.title));
}

function saveMediaFile(media: ProjectMediaModel, project_id: number): ProjectMedia {
    const filename = [media.name, media.type].join('.');
    const bufferParts = media.buffer.split(',');
    const base64Data = bufferParts[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const mediaDir = process.env.PROJECT_MEDIA_DIR;
    if (!mediaDir) {
        throw new Error('Project media directory is not set');
    }

    const filepath = path.join(os.homedir(), process.env.PROJECT_MEDIA_DIR, filename);
    console.log(filepath);
    fs.writeFile(filepath, buffer, (error) => {
        if (error) {
            throw new Error('Error saving project media');
        }
    });

    return {
        name: media.name,
        filetype: media.type,
        prefix: bufferParts[0],
        project_id,
        filepath,
    } as ProjectMedia;
}

export default {addProject};