import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  try {

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Servidor iniciado en el puerto ${port}`);
  } catch (error) {
    console.error('Error al conectar a las bases de datos:', error);
    process.exit(1); // Detén la aplicación si no se puede conectar a las bases de datos
  }
}

bootstrap();