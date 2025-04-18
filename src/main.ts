import { NestFactory } from '@nestjs/core';
import { onRequest } from 'firebase-functions/v2/https';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as cors from 'cors';
import { AppModule } from './app.module';

const expressServer = express();
let app: NestExpressApplication;

// Configure CORS options
const corsOptions: cors.CorsOptions = {
  origin: [
    'http://localhost:3000',
    'https://technical-interview-front.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true,
};

expressServer.use(cors(corsOptions));

const initializeNestApp = async (): Promise<NestExpressApplication> => {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(expressServer),
    );
    // Still keep this for local development
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'https://technical-interview-front.vercel.app'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
      credentials: true,
    });

    await app.init();
    console.log(`Server initialized`);
  }
  return app;
}

export const api = onRequest(async (request, response) => {
  // No need for manual OPTIONS handling, cors middleware will handle it
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
