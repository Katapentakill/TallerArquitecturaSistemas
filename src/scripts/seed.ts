import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser } from '../entities/authUser.entity';
import { User } from '../entities/user.entity';
import { Invoice } from '../entities/invoice.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video } from '../entities/video.entity';  // Esquema de Video para MongoDB

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User, 'userConnection') private userRepository: Repository<User>,
    @InjectRepository(Invoice, 'invoiceConnection') private invoiceRepository: Repository<Invoice>,
    @InjectRepository(AuthUser, 'authConnection') private authUserRepository: Repository<AuthUser>,
    @InjectModel(Video.name) private videoModel: Model<Video>,  // Inyectamos el modelo Video para MongoDB
  ) {}

  // Método para generar datos de ejemplo usando Faker
  async seed() {
    // Limpiar las tablas antes de insertar los datos
    await this.userRepository.clear();
    await this.authUserRepository.clear();
    await this.invoiceRepository.clear();
    await this.videoModel.deleteMany({});  // Limpiar la colección de videos en MongoDB

    // Generar entre 100 y 200 usuarios
    const userCount = faker.number.int({ min: 100, max: 200 });
    const users: User[] = [];

    for (let i = 0; i < userCount; i++) {
      const name = faker.name.firstName();
      const lastname = faker.name.lastName();
      const email = faker.internet.email(); // Generar un email único

      const user = this.userRepository.create({
        email,
        name,
        lastname,
        role: faker.helpers.arrayElement(['Cliente', 'Administrador']), // Aleatorio entre 'Cliente' y 'Administrador'
        status: true,
      });

      users.push(user);
    }

    await this.userRepository.save(users);

    // Crear los AuthUser correspondientes
    const authUsers = users.map(user => {
      return this.authUserRepository.create({
        email: user.email,
        password: bcrypt.hashSync('12345', 10), // Usar una contraseña fija cifrada con bcrypt
      });
    });

    await this.authUserRepository.save(authUsers);

    // Generar entre 300 y 400 facturas
    const invoiceCount = faker.number.int({ min: 300, max: 400 });
    const invoices: Invoice[] = [];

    for (let i = 0; i < invoiceCount; i++) {
      const user = faker.helpers.arrayElement(users); // Seleccionar un usuario aleatorio
      const invoice = this.invoiceRepository.create({
        userId: user.id, // Asignamos el userId directamente
        amount: faker.number.int({ min: 100, max: 1000 }), // Generamos una cantidad aleatoria entre 100 y 1000
        status: faker.helpers.arrayElement(['Pendiente', 'Pagado', 'Vencido']), // Estado aleatorio
        paidAt: faker.date.past(), // Fecha aleatoria en el pasado
      });

      invoices.push(invoice);
    }

    await this.invoiceRepository.save(invoices);

    // Generar entre 400 y 600 videos
    const videoCount = faker.number.int({ min: 400, max: 600 });
    const videos: { 
      title: string; 
      description: string; 
      genre: "Acción" | "Comedia" | "Drama" | "Aventura"; 
      status: boolean; 
    }[] = [];  // Especificamos el tipo explícito para el array

    for (let i = 0; i < videoCount; i++) {
      const title = faker.lorem.words(3);  // Genera un título aleatorio
      const description = faker.lorem.sentence();  // Descripción aleatoria
      const genre = faker.helpers.arrayElement(['Acción', 'Comedia', 'Drama', 'Aventura']);  // Género aleatorio

      // Crear un documento de video
      const video = {
        title,
        description,
        genre,
        status: faker.datatype.boolean(),  // Estado aleatorio (activo o inactivo)
      };

      videos.push(video);
    }

    // Guardar los videos en la base de datos MongoDB
    await this.videoModel.insertMany(videos);

    console.log('Datos de ejemplo insertados correctamente.');
  }

  async createAdmin() {
    const plainPassword = faker.internet.password();
    const email = faker.internet.email();

    const user = this.userRepository.create({
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email,
      role: 'Administrador',
      status: true,
    });
    await this.userRepository.save(user);

    const authUser = this.authUserRepository.create({
      email,
      password: bcrypt.hashSync(plainPassword, 10),
    });
    await this.authUserRepository.save(authUser);

    return {
      success: true,
      message: 'Administrador creado correctamente',
      user: {
        ...user,
        password: plainPassword,
      },
    };
  }

  async createCliente() {
    const plainPassword = faker.internet.password();
    const email = faker.internet.email();

    const user = this.userRepository.create({
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email,
      role: 'Cliente',
      status: true,
    });
    await this.userRepository.save(user);

    const authUser = this.authUserRepository.create({
      email,
      password: bcrypt.hashSync(plainPassword, 10),
    });
    await this.authUserRepository.save(authUser);

    return {
      success: true,
      message: 'Cliente creado correctamente',
      user: {
        ...user,
        password: plainPassword,
      },
    };
  }
}