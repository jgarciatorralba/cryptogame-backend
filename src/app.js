import express from 'express';
import cors from 'cors';
import config from './config/app-config.js';
import authRouter from './routers/auth.js';
import apiPublicRouter from './routers/apiPublic.js';
import apiPrivateRouter from './routers/apiPrivate.js';
import userRouter from './routers/user.js';
import adminRouter from './routers/admin.js';
import coinTicker from './database/cointicker.js';
import rankingTicker from './database/rankingticker.js';

const app = express();

app.use(cors({ origin: config.app.clientDomain }));
app.use(express.json());

app.use('/', authRouter);
app.use('/api', apiPublicRouter);
app.use('/api', apiPrivateRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.listen(config.app.port);

coinTicker.watch();
setInterval(rankingTicker.update, 1000);
