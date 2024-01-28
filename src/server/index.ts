import express from 'express';
import router from '../routes/';
import cors from 'cors';
import { runQuery } from '../config/database';

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(router);

app.listen(process.env.PORT || 3000);
console.log('Iniciou...');
