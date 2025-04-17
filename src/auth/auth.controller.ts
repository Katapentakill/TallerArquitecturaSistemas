import { Controller, Post, Body, Res, HttpStatus, HttpException, Req, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../DTO/auth.dto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from 'src/DTO/changePass.dto';

/**
 * Controlador de autenticación que gestiona las solicitudes relacionadas con el inicio de sesión y cambio de contraseña.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Endpoint para iniciar sesión en el sistema.
   * 
   * @param authDto - Objeto con las credenciales de acceso (email y password).
   * @param res - Objeto de respuesta de Express para manejar la respuesta HTTP.
   * @returns Respuesta JSON con el estado de la autenticación y el token si es exitoso.
   */
  @Post('login')
  async login(@Body() authDto: AuthDto, @Res() res: Response) {
    const timestamp = new Date().toISOString();

    try {
      // Se llama al servicio de autenticación para validar credenciales y obtener el token
      const { token } = await this.authService.login(authDto);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Login exitoso',
        data: { token }, // Se retorna solo el token sin anidación extra
        code: HttpStatus.OK,
        timestamp,
        errors: [],
      });
    } catch (error) {
      // Manejo de errores en la autenticación
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.response?.message || 'Error en el inicio de sesión',
        data: null,
        code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp,
        errors: error.response?.errors || [error.message || 'Ocurrió un error al intentar iniciar sesión'],
      });
    }
  }

 /**
 * Endpoint para cambiar la contraseña de un usuario autenticado.
 * 
 * @param req - Objeto de solicitud con el token JWT en los headers.
 * @param id - ID del usuario enviado en la URL.
 * @param body - Contiene la contraseña actual (`oldPassword`), nueva (`newPassword`) y confirmación (`confirmPassword`).
 * @param res - Objeto de respuesta HTTP.
 * @returns Un mensaje de confirmación si el cambio de contraseña es exitoso.
 */
  @Patch(':id')
  async changePassword(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: ChangePasswordDto,
    @Res() res: Response
  ) {
    const timestamp = new Date().toISOString();

    try {
      // Se extrae el token JWT del encabezado de la solicitud
      const token = this.extractToken(req);

      // Se decodifica el token para obtener el ID del usuario autenticado
      const decoded = this.jwtService.verify(token);

      // Se verifica que el ID del token coincida con el ID en la URL
      if (decoded.sub !== id) {
        throw new HttpException(
          { message: 'No autorizado para cambiar esta contraseña.', errors: [] },
          HttpStatus.FORBIDDEN
        );
      }

      // Llamamos al servicio para cambiar la contraseña
      const result = await this.authService.changePassword(
        token,
        body.oldPassword,
        body.newPassword,
        body.confirmPassword
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: null,
        code: HttpStatus.OK,
        timestamp,
        errors: [],
      });
    } catch (error) {
      // Manejo de errores en el cambio de contraseña
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.response?.message || 'Error al cambiar la contraseña',
        data: null,
        code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp,
        errors: error.response?.errors || [error.message],
      });
    }
  }


  /**
   * Extrae y valida el token del encabezado de autorización de la solicitud.
   * 
   * @param req - Objeto de solicitud HTTP.
   * @returns Token JWT extraído del encabezado de la solicitud.
   * @throws HttpException si el token es inválido o no se proporciona.
   */
  private extractToken(req: Request): string {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new HttpException({ message: 'Token no proporcionado.', errors: [] }, HttpStatus.UNAUTHORIZED);
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      throw new HttpException({ message: 'Formato de token inválido.', errors: [] }, HttpStatus.UNAUTHORIZED);
    }

    return tokenParts[1];
  }
}