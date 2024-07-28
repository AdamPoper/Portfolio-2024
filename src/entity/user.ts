import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
    id: number;
    name: string;
    role: string;
}

export const UserQueries = {
    GET_USER_BY_ID: "SELECT * FROM USER WHERE id = ?"
}