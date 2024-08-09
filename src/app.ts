import express from 'express';
import photoRouter from './routes/photo';
import projectRouter from './routes/project';
import adminRouter from './routes/admin';
import authRouter from './routes/auth';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { basicAuth, setUser, authRole, createAdmin } from './auth/auth';
import { Role } from './auth/roles';
import { Persistance } from './persistance/persistance';
import { UserQueries } from './entity/user';

dotenv.config();

const app = express();

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use('/photos', photoRouter);
app.use('/projects', projectRouter);
app.use('/admin', setUser, basicAuth, authRole(Role.ADMIN), adminRouter);
app.use('/authenticate', authRouter);

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server is listening on ' + PORT);
    onListen();
});

const onListen = async () => {
    const adminUsername = process.env.ADMIN_USERNAME;
    if (!adminUsername) {
        throw new Error('Admin username is not set');
    }
    
    const user = await Persistance.selectEntityByNamedQuery(UserQueries.GET_USER_BY_USERNAME, [adminUsername]);
    if (!user) {
        createAdmin();
    }
}