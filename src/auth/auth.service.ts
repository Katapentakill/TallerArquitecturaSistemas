import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthUser } from '../entities/authUser.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../DTO/auth.dto';

/**
 * Servicio de autenticación encargado de gestionar el inicio de sesión y cambio de contraseña.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User, 'userConnection') private userRepository: Repository<User>,
    @InjectRepository(AuthUser, 'authConnection') private authUserRepository: Repository<AuthUser>,
    private jwtService: JwtService
  ) {}

  /**
   * Método para autenticar un usuario y generar un token de sesión.
   * 
   * @param authDto - Objeto con las credenciales de acceso (email y password).
   * @returns Un objeto con el token JWT si la autenticación es exitosa.
   * @throws HttpException si la autenticación falla.
   */
  async login(authDto: AuthDto): Promise<{ token: string }> {
    try {
      const { email, password } = authDto;
      const errors: string[] = [];

      // Verificar existencia del usuario en la base de datos de autenticación
      const existingUserInAuth = await this.authUserRepository.findOne({ where: { email } });
      if (!existingUserInAuth) errors.push('El correo electrónico no está asociado a una cuenta válida.');

      // Verificar existencia del usuario en la base de datos de usuarios
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (!existingUser) errors.push('El correo electrónico no está registrado.');

      // Verificar si la cuenta está activa
      if (existingUser && !existingUser.status) {
        errors.push('La cuenta está inactiva. Contacte a un administrador.');
      }

      // Verificar la contraseña
      if (existingUserInAuth) {
        const passwordMatch = await bcrypt.compare(password, existingUserInAuth.password);
        if (!passwordMatch) errors.push('La contraseña ingresada es incorrecta.');
      }

      if (errors.length > 0) {
        throw new HttpException({ message: 'Error en el inicio de sesión', errors }, HttpStatus.UNAUTHORIZED);
      }

      // Generar token JWT si las credenciales son correctas
      if (existingUser && existingUserInAuth) {
        const payload = { email: existingUser.email, sub: existingUser.id, role: existingUser.role };
        const token = this.jwtService.sign(payload);
        return { token };
      } else {
        throw new HttpException('Error inesperado en el proceso de login', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw new HttpException(
        { message: 'Error inesperado en el proceso de login', errors: [error.message] },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Método para cambiar la contraseña de un usuario autenticado.
   * 
   * @param token - Token de autenticación del usuario.
   * @param oldPassword - Contraseña actual del usuario.
   * @param newPassword - Nueva contraseña a establecer.
   * @returns Un mensaje de confirmación si el cambio de contraseña es exitoso.
   * @throws HttpException si la validación falla o ocurre un error.
   */
  async changePassword(token: string, oldPassword: string, newPassword: string, confirmPassword: string): Promise<{ message: string }> {
    try {
      const decoded = this.jwtService.verify(token);
      const email = decoded.email;
  
      const authUser = await this.authUserRepository.findOne({ where: { email } });
      if (!authUser) {
        throw new HttpException({ message: 'Usuario no encontrado.', errors: [] }, HttpStatus.NOT_FOUND);
      }
  
      // Verificar que las contraseñas coinciden
      if (newPassword !== confirmPassword) {
        throw new HttpException({ message: 'Las contraseñas nuevas no coinciden.', errors: [] }, HttpStatus.BAD_REQUEST);
      }
  
      const isPasswordValid = await bcrypt.compare(oldPassword, authUser.password);
      if (!isPasswordValid) {
        throw new HttpException({ message: 'La contraseña actual es incorrecta.', errors: [] }, HttpStatus.UNAUTHORIZED);
      }
  
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      authUser.password = hashedNewPassword;
      await this.authUserRepository.save(authUser);
  
      return { message: 'Contraseña actualizada con éxito.' };
    } catch (error) {
      throw new HttpException(
        { message: 'Error al cambiar la contraseña.', errors: [error.message] },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}