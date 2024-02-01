import cors from 'cors';
import express from 'express';
import router from '../routes/';

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(router);

app.listen(process.env.PORT || 3000);
console.log('Iniciou...');
