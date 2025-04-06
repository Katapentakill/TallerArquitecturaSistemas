import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './scripts/seed'; // Importar el SeederService

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Hacer explícito el tipo `string` para evitar el error
  const environment: string = 'development'; // Establecer manualmente el entorno como tipo string

  // Ejecutar el Seeder solo en desarrollo
  if (environment === 'development') { // Comparación correcta
    const seederService = app.get(SeederService); // Obtener la instancia del SeederService
    await seederService.seed(); // Llamar al método seed para insertar los datos
  }

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
