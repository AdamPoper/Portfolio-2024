import { RowDataPacket } from "mysql2";

export const USER_TABLE = 'User';

export interface User extends RowDataPacket {
    id: number;
    role: string;
    username: string;
    password: string;
}

export interface UserRequestBody {
    username: string;
    password: string;
}

export const UserQueries = {
    GET_USER_BY_ID: "SELECT * FROM USER WHERE id = ?",
    GET_USER_BY_USERNAME: "SELECT * FROM USER WHERE username = ?",
}