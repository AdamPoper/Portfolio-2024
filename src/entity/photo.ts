import { RowDataPacket } from "mysql2";

export const PHOTO_TABLE = 'Photo';

export interface Photo extends RowDataPacket {
    id: number;
    name: string;
    filepath: string;
    prefix: string;
}

export interface PhotoRequestBody {
    name: string,
    buffer: string;
    type: string;
}

export interface PhotoModel {
    name: string,
    id: number;
    buffer: string;
}

export const PhotoQueries = {
    GET_PHOTO_BY_ID: 'SELECT * FROM photo where id = ?',
    GET_ALL_PHOTOS: 'SELECT * FROM photo',
}