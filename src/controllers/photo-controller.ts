import {Request, Response} from 'express';
import {Photo, PHOTO_TABLE, PhotoModel, PhotoQueries, PhotoRequestBody} from '../entity/photo';
import {Persistance} from '../persistance/persistance';
import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';

dotenv.config();

const getAllPhotos = async (req: Request, res: Response) => {
    const photos: Photo[] = await Persistance.selectEntitiesByNamedQuery<Photo>(PhotoQueries.GET_ALL_PHOTOS);
    const models = photos.map(p => photoToModel(p));
    res.status(200).json(models);
}

const addNewPhoto = (req: Request, res: Response) => {
    const photoRequestBody = req.body as PhotoRequestBody;

    if (!process.env.PHOTO_ROOT_DIR) {
        res.sendStatus(500).send('Photo directory is not set');
        return;
    }

    const fileName = photoRequestBody.name + '.' + photoRequestBody.type;
    const filePath = path.join(os.homedir(), process.env.PHOTO_ROOT_DIR, fileName);

    const dataParts = photoRequestBody.buffer.split(',');
    const base64Data = dataParts[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const photo = {
        name: fileName,
        filepath: filePath.toString(),
        prefix: dataParts[0]
    } as Photo;

    Persistance.persistEntity<Photo>(PHOTO_TABLE, photo)
        .then(() => fs.writeFile(filePath, buffer, (error) => {
            if (error) {
                res.sendStatus(500).send('Error saving file');
            }

            res.send('Successfully persisted ' + photo.name);
        }));
}

const photoToModel = (photo: Photo): PhotoModel => {
    const imageBuffer = fs.readFileSync(photo.filepath);
    const base64String = imageBuffer.toString('base64');
    const result = [photo.prefix, base64String].join(',');
    return {
        name: photo.name,
        id: photo.id,
        buffer: result
    } as PhotoModel;
}

export default {getAllPhotos, addNewPhoto};