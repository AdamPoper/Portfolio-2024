import { Request } from "express";
import { User } from "../entity/user";

export {};

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}