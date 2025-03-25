import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastname: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  confirmPassword: string; // Aquí agregamos solo el campo confirmación de la contraseña

  @IsOptional()
  role: string; // Por defecto, 'Cliente'
}
