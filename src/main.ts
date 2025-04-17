import 'dotenv/config'; // Importante: carga variables desde .env
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Imprimir la variable TEST (para verificar que funciona)
  // Imprimir la variable TEST (para verificar que funciona)
  if (process.env.TEST) {
    console.log('TEST ENV VARIABLE:', process.env.TEST);
  } else {
    console.log('No funcionó la variable de entorno TEST');
  }

  try {
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Servidor iniciado en el puerto ${port}`);
  } catch (error) {
    console.error('Error al conectar a las bases de datos:', error);
    process.exit(1);
  }
}

bootstrap();