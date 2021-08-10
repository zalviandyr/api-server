import 'dotenv/config';

import swaggerUi from 'swagger-ui-express';
import fsPromise from 'fs/promises';
import { app } from './app';
import { RegisterRouter } from '@config/RegisterRouter';

class App extends RegisterRouter {
  async init(): Promise<void> {
    const port = process.env.PORT || 4000;

    // setup swagger
    const swaggerDocument = JSON.parse(
      await fsPromise.readFile('./swagger-output.json', 'utf-8'),
    );

    app.enable('trust proxy');
    app.use('/', ...this.public());
    app.use('/api', ...this.api());
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(this.errorHandler());

    app.listen(port, () => {
      console.log(`Server started at port: ${port}`);
    });
  }
}

// run application
new App().init();
