import { Controller, Post, Body, Res, HttpStatus, HttpException, Req, Patch, Get, Param, Query, Delete } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from '../DTO/createInvoiceDto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('invoices')
export class InvoicesController {0
    constructor(
        private readonly invoicesService: InvoicesService,
        private readonly jwtService: JwtService
    ) {}

    @Post('facturas')
    async createInvoice(@Body() req: Request, createInvoiceDto: CreateInvoiceDto, @Res() res: Response) {
        const timestamp = new Date().toISOString();
        
        try {
            const token = this.extractToken(req);
            const decodedToken = this.jwtService.verify(token);

            if (decodedToken.role !== 'Administrador') {
                throw new HttpException('Acceso denegado. Solo los Administradores pueden crear facturas.', HttpStatus.FORBIDDEN);
            }

            const result = await this.invoicesService.addInvoice(createInvoiceDto);
            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Factura creada con éxito',
                data: { invoice: result },
                code: HttpStatus.CREATED,
                timestamp,
                errors: [],
            });
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error al crear la factura',
                data: null,
                code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp,
                errors: error.response?.errors || [error.message || 'Ocurrió un error'],
            });
        }
    }

    @Get('facturas/:id')
    async getInvoice(@Req() req: Request,  @Param('id') id: number, @Res() res: Response) {
        const timestamp = new Date().toISOString();
        
        try {
            const token = this.extractToken(req);
            const decodedToken = this.jwtService.verify(token);

            const result = await this.invoicesService.getInvoiceById(id);

            if (decodedToken.role !== 'Administrador' || decodedToken.sub !== result.userId) {
                throw new HttpException('Acceso denegado. No tienes permitido ver esta factura.', HttpStatus.FORBIDDEN);
            }
            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Factura obtenida con éxito',
                data: { invoice: result },
                code: HttpStatus.OK,
                timestamp,
                errors: [],
            });
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error al obtener la factura',
                data: null,
                code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp,
                errors: error.response?.errors || [error.message || 'Ocurrió un error'],
            });
        }
    }

    @Patch('facturas/:id')
    async updateInvoice(@Req() req: Request, @Param('id') id: number, @Body() body: any, @Res() res: Response) {
        const timestamp = new Date().toISOString();
        
        try {
            const token = this.extractToken(req);
            const decodedToken = this.jwtService.verify(token);

            if (decodedToken.role !== 'Administrador') {
                throw new HttpException('Acceso denegado. Solo los Administradores pueden actualizar facturas.', HttpStatus.FORBIDDEN);
            }

            const result = await this.invoicesService.updateInvoiceStatus(id, body.status);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Factura actualizada con éxito',
                data: { invoice: result },
                code: HttpStatus.OK,
                timestamp,
                errors: [],
            });
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error al actualizar la factura',
                data: null,
                code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp,
                errors: error.response?.errors || [error.message || 'Ocurrió un error'],
            });
        }
    }

    @Delete('facturas/:id')
    async deleteInvoice(@Req() req: Request, @Param('id') id: number, @Res() res: Response) {
        const timestamp = new Date().toISOString();

        try {
            const token = this.extractToken(req);
            const decodedToken = this.jwtService.verify(token);

            if (decodedToken.role !== 'Administrador') {
                throw new HttpException('Acceso denegado. Solo los Administradores pueden eliminar facturas.', HttpStatus.FORBIDDEN);
            }

            await this.invoicesService.deleteInvoice(id);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Factura eliminada con éxito',
                data: null,
                code: HttpStatus.OK, 
                timestamp,
                errors: [],
            });
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error al eliminar la factura',
                data: null,
                code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp,
                errors: error.response?.errors || [error.message || 'Ocurrió un error'],
            });
        }
    }

    @Get('facturas')
    async getUserInvoices(@Req() req: Request, @Query('status') status: string, @Res() res: Response) {
        const timestamp = new Date().toISOString();
        
        try {
            const token = this.extractToken(req);
            const decodedToken = this.jwtService.verify(token);
            const isAdmin = decodedToken.role === 'Administrador';
            const result = await this.invoicesService.getUserInvoices(decodedToken.sub, isAdmin,status);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Facturas obtenidas con éxito',
                data: { invoices: result },
                code: HttpStatus.OK,
                timestamp,
                errors: [],
            });
        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error al obtener las facturas',
                data: null,
                code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp,
                errors: error.response?.errors || [error.message || 'Ocurrió un error'],
            });
        }
    }


    private extractToken(req: Request): string { 
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new HttpException('Token no proporcionado', HttpStatus.UNAUTHORIZED);
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new HttpException('Token no válido', HttpStatus.UNAUTHORIZED);
        }
        return token;
    }
}
