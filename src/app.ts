import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

export { app };
