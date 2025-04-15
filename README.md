<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```
## Configuración inicial de las bases de datos

Antes de ejecutar el proyecto, es necesario instalar y configurar las siguientes bases de datos:

- **MariaDB** (para usuarios y facturación)
- **PostgreSQL** (para autenticación)
- **MongoDB** (para gestión de videos)

### Opcional pero recomendado:
- Instala también los **paneles de control** como DBeaver, HeidiSQL, pgAdmin o MongoDB Compass para facilitar la gestión visual de las bases de datos.

### Pasos para la configuración

1. **Inicia los servidores de MariaDB, PostgreSQL y MongoDB.**

2. **Desde la herramienta de query (como pgAdmin, DBeaver o similar), crea las siguientes bases de datos:**

   - Para **MariaDB** puedes usar cualquier nombre, por ejemplo: `users_db`
   - Para **PostgreSQL** cualquier nombre también, por ejemplo: `auth_db`
   - Para **MongoDB** no es necesario crear previamente la base de datos (`videos_db` se creará automáticamente al insertar datos)

3. **Asegúrate de recordar el nombre de cada base de datos y la contraseña del usuario.**

   Por defecto, este proyecto utiliza las siguientes credenciales en `app.module.ts`:

   - **MariaDB**
     - Usuario: `root`
     - Contraseña: `123`
     - Base de datos: `users_db`

   - **PostgreSQL**
     - Usuario: `postgres`
     - Contraseña: `123`
     - Base de datos: `auth_db`

   - **MongoDB**
     - Conexión: `mongodb://localhost:27017/videos_db`

4. **Modificar `AppModule` si cambiaste el nombre o la contraseña.**

   Abre el archivo `src/app.module.ts` y edita las propiedades `username`, `password`, y `database` en las configuraciones de `TypeOrmModule.forRoot(...)` y `MongooseModule.forRoot(...)`.

5. **Listo. Al ejecutar el proyecto por primera vez, las tablas se crearán automáticamente** en cada base de datos correspondiente gracias a la propiedad `synchronize: true`. Esto solo debe usarse durante el desarrollo, no en producción.

## Activar el Seeder

Para ejecutar el Seeder y agregar datos de ejemplo, debes asegurarte de que la variable `environment` esté correctamente configurada.

### ¿Cómo activar el Seeder?

En el archivo `main.ts`, la variable `environment` debe ser `'development'` para que el Seeder se ejecute correctamente.

```typescript
const environment: string = 'develoment'; // Si se escribe correctamente
```
Si no deseas que el Seeder se ejecute siempre que inicies el proyecto, puedes cambiar el valor de la variable `environment` a algo diferente a `'development'`. Esto evitará que el Seeder se ejecute automáticamente.

### Recomendación: Para garantizar que el Seeder funcione correctamente, sigue estos pasos:

1. **Paso 1**: Deja la variable `environment` escrita como `'development'` y corre el proyecto.
2. **Paso 2**: Detén el proyecto.
3. **Paso 3**: Cambia la variable `environment` a cualquier otra palabra, por ejemplo, `'production'`.
4. **Paso 4**: Vuelve a correr el proyecto. El Seeder se ejecutará correctamente solo en el primer paso cuando esté escrito correctamente como `'development'`.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
