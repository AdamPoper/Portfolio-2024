import express from 'express';
import photoRouter from './routes/photo';
import projectRouter from './routes/project';
import adminRouter from './routes/admin';
import dotenv from 'dotenv';
import path from 'path';
import { basicAuth, setUser, authRole } from './auth/auth';
import { Role } from './auth/roles';

dotenv.config();

const app = express();

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: false}));

app.use('/photos', photoRouter);
app.use('/projects', projectRouter);
app.use('/admin', setUser, basicAuth, authRole(Role.ADMIN), adminRouter);

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('server is listening on ' + PORT));