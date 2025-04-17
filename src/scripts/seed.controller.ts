import { Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { SeederService } from './seed';
import { Response } from 'express';

@Controller('seed')
export class SeedController {
  constructor(private readonly seederService: SeederService) {}

  @Post()
  async runSeeder(@Res() res: Response) {
    try {
      await this.seederService.seed();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Seeder ejecutado con éxito',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al ejecutar el seeder',
        error: error.message || error,
      });
    }
  }
  @Post('admin')
  async createAdmin(@Res() res: Response) {
    try {
      const result = await this.seederService.createAdmin();
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al crear administrador',
        error: error.message || error,
      });
    }
  }

  @Post('cliente')
  async createCliente(@Res() res: Response) {
    try {
      const result = await this.seederService.createCliente();
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al crear cliente',
        error: error.message || error,
      });
    }
  }
}