import { NestFactory } from '@nestjs/core';
import { onRequest } from 'firebase-functions/v2/https';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';

const expressServer = express();
let app: NestExpressApplication;

const initializeNestApp = async (): Promise<NestExpressApplication> => {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(expressServer),
    );

    app.enableCors({
    });

    await app.init();
    console.log(`Server initialized`);
  }
  return app;
}

export const api = onRequest(async (request, response) => {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  await initializeNestApp();
  expressServer(request, response);
});

async function bootstrap() {
  const app = await initializeNestApp();
  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

if (process.env.IS_LOCAL === 'true') {
  bootstrap();
}
