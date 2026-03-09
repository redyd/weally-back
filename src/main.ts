import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser(process.env.COOKIE_SECRET));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Prefix global
    app.setGlobalPrefix('api/v1');

    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [
            'http://localhost:3001',
        ],
        credentials: true,
    });

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`API started on http://localhost:${port}/api/v1`);
}

bootstrap();
