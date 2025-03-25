import { Controller, Post, Body, Res, HttpStatus, HttpException, Req, Patch, Get, Param, Query, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../DTO/createUserDto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

/**
 * Controlador de usuarios encargado de gestionar operaciones sobre usuarios.
 */
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Endpoint para registrar un nuevo usuario en el sistema.
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const timestamp = new Date().toISOString();

    try {
      const result = await this.usersService.register(createUserDto);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Usuario registrado con éxito',
        data: { user: result },  // Aquí retornamos el usuario registrado, sin el hash de la contraseña
        code: HttpStatus.CREATED,
        timestamp,
        errors: [],
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error al registrar el usuario',
        data: null,
        code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp,
        errors: error.response?.errors || [error.message || 'Ocurrió un error'],
      });
    }
  }

   /**
   * Endpoint para eliminar un usuario (soft delete).
   * 
   * - Solo los administradores pueden realizar esta acción.
   * - Se requiere autenticación (token JWT).
   * - Se marca al usuario como `status = false` en la base de datos.
   */
   @Delete(':id')
   async deleteUser(@Req() req: Request, @Param('id') id: number, @Res() res: Response) {
     const timestamp = new Date().toISOString();
 
     try {
       const token = this.extractToken(req);
       const decodedToken = this.jwtService.verify(token);
 
       if (decodedToken.role !== 'Administrador') {
         throw new HttpException('Acceso denegado. Solo Administradores pueden eliminar usuarios.', HttpStatus.FORBIDDEN);
       }
 
       await this.usersService.deleteUser(id);
 
       return res.status(HttpStatus.OK).json({
         success: true,
         message: 'Usuario eliminado con éxito',
         data: null,
         code: HttpStatus.OK,
         timestamp,
         errors: []
       });
     } catch (error) {
       return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
         success: false,
         message: error.message || 'Error al eliminar el usuario',
         data: null,
         code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
         timestamp,
         errors: error.response?.errors || [error.message || 'Ocurrió un error']
       });
     }
   }

  /**
   * Endpoint para que un usuario autenticado actualice sus propios datos.
   */
  @Patch('update')
  async updateUser(@Req() req: Request, @Body() body: { email?: string; name?: string; lastname?: string }, @Res() res: Response) {
    const timestamp = new Date().toISOString();

    try {
      const token = this.extractToken(req);
      const decodedToken = this.jwtService.verify(token);
      const updatedUser = await this.usersService.updateUser(decodedToken.sub, body);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Usuario actualizado con éxito',
        data: updatedUser,
        code: HttpStatus.OK,
        timestamp,
        errors: []
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error al actualizar el usuario',
        data: null,
        code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp,
        errors: error.response?.errors || [error.message || 'Ocurrió un error']
      });
    }
  }

  /**
   * Endpoint para consultar la cuenta del usuario autenticado.
   */
  @Get('profile')
  async getUserProfile(@Req() req: Request, @Res() res: Response) {
    const timestamp = new Date().toISOString();

    try {
      const token = this.extractToken(req);
      const decodedToken = this.jwtService.verify(token);
      const userProfile = await this.usersService.getUserProfile(decodedToken.sub);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Perfil del usuario obtenido con éxito',
        data: userProfile,
        code: HttpStatus.OK,
        timestamp,
        errors: []
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error al obtener el perfil del usuario',
        data: null,
        code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp,
        errors: error.response?.errors || [error.message || 'Ocurrió un error']
      });
    }
  }

  /**
   * Endpoint para que un Administrador consulte los datos de cualquier usuario.
   */
  @Get(':id')
  async getUserByAdmin(@Req() req: Request, @Param('id') id: number, @Res() res: Response) {
    const timestamp = new Date().toISOString();

    try {
      const token = this.extractToken(req);
      const decodedToken = this.jwtService.verify(token);

      if (decodedToken.role !== 'Administrador') {
        throw new HttpException('Acceso denegado. Solo Administradores pueden consultar usuarios.', HttpStatus.FORBIDDEN);
      }

      const userProfile = await this.usersService.getUserByAdmin(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Datos del usuario obtenidos con éxito',
        data: userProfile,
        code: HttpStatus.OK,
        timestamp,
        errors: []
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error al obtener los datos del usuario',
        data: null,
        code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp,
        errors: error.response?.errors || [error.message || 'Ocurrió un error']
      });
    }
  }

  /**
   * Endpoint para que un Administrador liste todos los usuarios registrados.
   */
  @Get()
  async getAllUsers(@Req() req: Request, @Res() res: Response, @Query('email') email?: string, @Query('name') name?: string, @Query('lastname') lastname?: string) {
    const timestamp = new Date().toISOString();

    try {
      const token = this.extractToken(req);
      const decodedToken = this.jwtService.verify(token);

      if (decodedToken.role !== 'Administrador') {
        throw new HttpException('Acceso denegado. Solo Administradores pueden listar usuarios.', HttpStatus.FORBIDDEN);
      }

      const usersList = await this.usersService.getAllUsers({ email, name, lastname });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Lista de usuarios obtenida con éxito',
        data: usersList,
        code: HttpStatus.OK,
        timestamp,
        errors: []
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error al obtener la lista de usuarios',
        data: null,
        code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp,
        errors: error.response?.errors || [error.message || 'Ocurrió un error']
      });
    }
  }

  /**
   * Extrae y valida el token del encabezado de autorización.
   */
  private extractToken(req: Request): string {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new HttpException('Token no proporcionado.', HttpStatus.UNAUTHORIZED);
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      throw new HttpException('Formato de token inválido.', HttpStatus.UNAUTHORIZED);
    }

    return tokenParts[1];
  }
}