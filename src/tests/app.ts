import express, { Express } from 'express';
import RegisterRouter from '@config/RegisterRouter';

export default class App extends RegisterRouter {
  static defaultTimeout = 40000;

  init(): Express {
    const app = express();
    app.use(express.json());
    app.use('/', ...this.public());
    app.use('/api', ...this.api());

    return app;
  }
}
