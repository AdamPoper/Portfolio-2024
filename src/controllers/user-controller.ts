import { User, UserQueries, USER_TABLE } from "../entity/user";
import { Request, Response } from "express";
import { Persistance } from "../persistance/persistance";

const updateFileStoragePreference = async (req: Request, res: Response) => {
    const requestBody = req.body as {userId: string, value: number};
    const userId = requestBody.userId;
    const user: User = await Persistance.selectEntityByNamedQuery<User>(UserQueries.GET_USER_BY_ID, [userId]);
    if (!user) {
        res.status(404).json({message: 'unable to find user with id: ' + userId});
        return;
    }

    if (requestBody.value < 0 || requestBody.value > 1) {
        res.status(400).json({message: 'Invalid value for file location indicator'});
        return;
    }

    user.file_loc_ind = requestBody.value;
    Persistance.updateEntity<User>(USER_TABLE, user).then(() => res.status(200).json({message: 'Successfully updated user'}));
}

export default {updateFileStoragePreference};