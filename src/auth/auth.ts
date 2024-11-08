import { Request, Response } from "express";
import { Persistance } from "../persistance/persistance";
import { User, USER_TABLE, UserQueries } from "../entity/user";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import {Role} from './roles';

dotenv.config();

export const basicAuth = (req: Request, res: Response, next: () => void): void => {
    const user = req.user;
    if (!user) {
        res.status(401).send('No user provided');
        return;
    }

    next();
}

export const setUser = (req: Request, res: Response, next: () => void): void => {
    const id = req.query.userId;
    if (!id) {
        res.status(401).send('No user id');
        return;
    }

    Persistance.selectEntityByNamedQuery<User>(UserQueries.GET_USER_BY_ID, [id])
        .then((user: User) => {
            req.user = user;
            next();
        })
        .catch(() => res.status(500).send('Unable to find user ' + id));
}

export const authRole = (role: string) => {
    return (req: Request, res: Response, next: () => void) => {
        if (req.user.role !== role) {
            return res.status(401).send('Not allowed');
        }

        next();
    }
}

export const createAdmin = async () => {
    const saltRounds = 10;
    const pw = process.env.ADMIN_PASSWORD;
    const hash = await bcrypt.hash(pw, saltRounds);
    const admin = {
        role: Role.ADMIN,
        username: process.env.ADMIN_USERNAME,
        password: hash,
        file_loc_ind: 0
    } as User;

    Persistance.persistEntity<User>(USER_TABLE, admin)
        .then(() => console.log('Successfully created admin'))
        .catch(e => console.error(e));
}