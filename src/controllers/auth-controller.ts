import { User, UserQueries, UserRequestBody } from "../entity/user";
import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import { Persistance } from "../persistance/persistance";

const getUser = async (req: Request, res: Response) => {
    const loginFailMessage = 'Invalid user name or password';
    const userRequest = req.body as UserRequestBody;
    const user: User = await Persistance.selectEntityByNamedQuery(UserQueries.GET_USER_BY_USERNAME, [userRequest.username]);
    if (!user) {
        res.status(404).send(loginFailMessage);
        return;
    }
    
    const match = await bcrypt.compare(userRequest.password, user.password);
    if (match) {
        res.status(200).json({user});
    } else {
        res.status(404).send(loginFailMessage);
    }
}

export default {getUser};