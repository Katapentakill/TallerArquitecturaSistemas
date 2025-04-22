<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">Un framework progresivo para crear aplicaciones del lado del servidor eficientes y escalables utilizando Node.js.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord" /></a>
</p>

## Descripción

Este es un proyecto basado en el framework **NestJS**, una herramienta poderosa para crear aplicaciones del lado del servidor utilizando Node.js.

## Setup del Proyecto

### Requisitos Previos

1. **Instalar Node.js**  
   Puedes descargarlo desde: https://nodejs.org/

2. **Instalar NestJS CLI globalmente**

```bash
npm install -g @nestjs/cli
```

### Instalación de Dependencias

Una vez clonado el repositorio, ejecuta:

```bash
npm install
```

### Configuración del archivo .env

Este archivo almacena las variables de entorno necesarias para el funcionamiento del backend.

Solicitar los valores a: alexander.tapia@alumnos.ucn.cl o nicolas.tapia02@alumnos.ucn.cl

Ejemplo de `.env`:

```bash
DATABASE_URL=tu_url_de_base_de_datos
JWT_SECRET=tu_clave_secreta
```

### Ejecutar en Modo Desarrollo

```bash
npm run start:dev
```

Esto iniciará el servidor y generará las tablas automáticamente si la conexión a base de datos es correcta.

## Seeders (Cargadores de Datos)

El sistema incluye endpoints para generar datos de prueba.

- Crear administrador:
```bash
POST /seed/admin
```

- Crear cliente:
```bash
POST /seed/cliente
```

- Ejecutar seeder completo:
```bash
POST /seed
```

Estos endpoints poblarán las tablas de usuarios, credenciales, facturas y videos con datos aleatorios usando Faker.

### Ejemplo usando Postman

```http
POST http://localhost:3000/seed
POST http://localhost:3000/seed/admin
POST http://localhost:3000/seed/cliente
```

## Ejecutar Proyecto

```bash
# Modo desarrollo
npm run start

# Modo observación
npm run start:dev

# Modo producción
npm run start:prod
```

## Pruebas

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Deployment

Para desplegar en producción:

Ver guía oficial: https://docs.nestjs.com/deployment

También puedes usar **Mau** para desplegar en AWS:

```bash
npm install -g mau
mau deploy
```

## Recursos

- Documentación: https://docs.nestjs.com  
- Discord: https://discord.gg/G7Qnnhy  
- Cursos: https://courses.nestjs.com  
- Devtools: https://devtools.nestjs.com  
- Mau para despliegue: https://mau.nestjs.com  
- Soporte empresarial: https://enterprise.nestjs.com  
- Bolsa de trabajo: https://jobs.nestjs.com  
- Twitter: https://x.com/nestframework  
- LinkedIn: https://linkedin.com/company/nestjs  

## Soporte

NestJS es un proyecto de código abierto con licencia MIT. Puedes apoyarlo desde:

https://docs.nestjs.com/support

## Autor

- Kamil Myśliwiec — https://twitter.com/kammysliwiec  
- Web: https://nestjs.com  

## Licencia

MIT — https://github.com/nestjs/nest/blob/master/LICENSE
