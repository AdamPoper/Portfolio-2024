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

const getPhotosPaged = async (req: Request, res: Response) => {
    if (!req.params.pageNumber || !req.params.pageSize) {
        res.status(500).send('Pagination not correctly set');
    }

    const photos: Photo[] = await Persistance.selectEntitiesByNamedQueryPaged<Photo>(
        PhotoQueries.GET_ALL_PHOTOS_SORTED,
        parseInt(req.params.pageSize),
        parseInt(req.params.pageNumber)
    );

    const models = photos.map(p => photoToModel(p));
    res.status(200).json(models);
}

const getPhotosTotalCount = async (req: Request, res: Response) => {
    Persistance.selectEntityByNamedQuery(PhotoQueries.GET_TOTAL_PHOTO_COUNT)
        .then(result => Object.values(result))
        .then(([count]) => res.status(200).json({count}))
}

const addNewPhoto = async (req: Request, res: Response) => {
    const photoRequestBody = req.body as PhotoRequestBody;

    if (!process.env.PHOTO_ROOT_DIR) {
        res.sendStatus(500).send('Photo directory is not set');
        return;
    }

    const fileName = photoRequestBody.name + '.' + photoRequestBody.type;
    const existing = await Persistance.selectEntityByNamedQuery(PhotoQueries.GET_PHOTO_BY_FILENAME, [fileName]);
    if (existing) {
        res.status(500).send('Photo ' + fileName + ' already exists');
        return;
    }

    const filePath = path.join(os.homedir(), process.env.PHOTO_ROOT_DIR, fileName);

    const dataParts = photoRequestBody.buffer.split(',');
    const base64Data = dataParts[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const photo = {
        name: fileName,
        filepath: filePath.toString(),
        prefix: dataParts[0],
        date: Date.now()
    } as Photo;

    Persistance.persistEntity<Photo>(PHOTO_TABLE, photo)
        .then(() => fs.writeFile(filePath, buffer, (error) => {
            if (error) {
                res.sendStatus(500).json({message: 'Error saving file'});
            }

            res.json({message: 'Successfully persisted ' + photo.name});
        }));
}

const photoToModel = (photo: Photo): PhotoModel => {
    const imageBuffer = fs.readFileSync(photo.filepath);
    const base64String = imageBuffer.toString('base64');
    const result = [photo.prefix, base64String].join(',');
    return {
        name: photo.name,
        id: photo.id,
        buffer: result,
        timestamp: photo.date
    } as PhotoModel;
}

export default {getAllPhotos, addNewPhoto, getPhotosPaged, getPhotosTotalCount};