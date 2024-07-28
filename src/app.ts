import express from 'express';
import photoRouter from './routes/photo';
import dotenv from 'dotenv';

import path from 'path';

dotenv.config();

const app = express();

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: false}));

app.use('/photos', photoRouter);

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server is listening on ' + PORT);
});