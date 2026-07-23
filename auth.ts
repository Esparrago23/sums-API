import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

process.on('uncaughtException', (err) => {
  fs.appendFileSync('crash.log', 'UNCAUGHT EXCEPTION: ' + err.stack + '\n');
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  fs.appendFileSync('crash.log', 'UNHANDLED REJECTION: ' + reason + '\n');
  console.error('UNHANDLED REJECTION:', reason);
});

import express from 'express';
import cors from 'cors';
import { db } from './src/core/db_postgresql';
import { loginUserController } from './src/User/infraestructure/user_dependencies';

const app = express();

app.use(cors({
  origin: process.env.ORIGIN_URL_1 && process.env.ORIGIN_URL_2 ?
    [process.env.ORIGIN_URL_1, process.env.ORIGIN_URL_2].filter(Boolean) :
    '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const authRouter = express.Router();
authRouter.post('/login', loginUserController.run.bind(loginUserController));
authRouter.get('/ping', async (_req, res) => {
  try {
    const result = await db.executePreparedQuery('SELECT 1', []);
    res.json({ message: 'auth-pong', result: result.rows });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.use('/sums', authRouter);
app.use('/sums/auth', authRouter);

const PORT = process.env.AUTH_PORT || process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Auth server running at http://localhost:${PORT}/sums`);
});
