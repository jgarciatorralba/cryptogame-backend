import express from 'express';
import config from './config/app-config.js';
import authRouter from './routers/auth.js';
import mainRouter from './routers/main.js';

const app = express();

app.use(express.json());

app.use('/', authRouter);
app.use('/api', mainRouter);

app.listen(config.app.port);
