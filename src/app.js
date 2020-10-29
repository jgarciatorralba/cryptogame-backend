import express from 'express';
import cors from 'cors';
import path from 'path';
import config from './config/app-config.js';
import authRouter from './routers/auth.js';
import apiPublicRouter from './routers/apiPublic.js';
import apiPrivateRouter from './routers/apiPrivate.js';
import userRouter from './routers/user.js';
import adminRouter from './routers/admin.js';
import coinTicker from './database/cointicker.js';
import ranking from './database/ranking.js';
import historical from './database/historical.js';

const app = express();

app.use(cors({ origin: config.app.clientDomain }));
app.use(express.json());

app.use('/', authRouter);
app.use('/api', apiPublicRouter);
app.use('/api', apiPrivateRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.use('/avatar', express.static(path.join(process.cwd(), 'uploads/avatar')));

app.listen(config.app.port);

coinTicker.watch();

setInterval(ranking.update, 1 * 60 * 1000);
setInterval(historical.update8h, 60 * 1000);
setInterval(historical.update24h, 3 * 60 * 1000);
setInterval(historical.update7d, 30 * 60 * 1000);
