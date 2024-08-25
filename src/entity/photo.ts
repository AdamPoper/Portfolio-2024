import { RowDataPacket } from "mysql2";

export const PHOTO_TABLE = 'Photo';

export interface Photo extends RowDataPacket {
    id: number;
    name: string;
    filepath: string;
    prefix: string;
    date: number
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
    timestamp: number;
}

export const PhotoQueries = {
    GET_PHOTO_BY_ID: 'SELECT * FROM photo where id = ?',
    GET_ALL_PHOTOS: 'SELECT * FROM photo',
    GET_ALL_PHOTOS_SORTED: 'SELECT * FROM photo ORDER BY date DESC',
    GET_TOTAL_PHOTO_COUNT: 'SELECT COUNT(*) FROM photo',
    GET_PHOTO_BY_FILENAME: 'SELECT * FROM photo where name = ?'
}