import { Invoice } from './../entities/invoice.entity';
import { Injectable, HttpException, HttpStatus, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateInvoiceDto } from '../DTO/createInvoiceDto';
import { InvoiceDataDto } from 'src/DTO/InvoiceDataDto';

@Injectable()
export class InvoicesService {
    constructor(
        @InjectRepository(Invoice, 'userConnection') private invoiceRepository: Repository<Invoice>,
        @InjectRepository(User, 'userConnection') private userRepository: Repository<User>
    ) {}

    async addInvoice(CreateInvoiceDto: CreateInvoiceDto): Promise<any> {
        try {
            const { userid, status, amount } = CreateInvoiceDto;
            const errors: string[] = [];

            // Verificar si el usuario existe
            const user = await this.userRepository.findOne({ where: { id: parseInt(userid) } });
            if (!user) errors.push('El usuario no existe.');

            if (errors.length > 0) {
                throw new HttpException({ message: 'Error al registrar factura', errors }, HttpStatus.BAD_REQUEST);
            }
            // Validar la cantidad de la factura
            const correctAmount = parseFloat(amount);
            if (isNaN(correctAmount) || correctAmount <= 0) {
                errors.push('El monto debe ser un número positivo.');
            }
            // Crear y guardar la factura
            const userId = parseInt(userid);
            const amountInt = parseFloat(amount);
            if (status === 'Pagado') {
                const paidAt = new Date(); // Asignar la fecha actual al campo paidAt
                const newInvoice = this.invoiceRepository.create({ userId, status, amount: amountInt, paidAt });
                await this.invoiceRepository.save(newInvoice);
                return { message: 'Factura registrada exitosamente', invoice: newInvoice };
            } else {
                const newInvoice = this.invoiceRepository.create({ userId, status, amount : amountInt});
                await this.invoiceRepository.save(newInvoice);
                return { message: 'Factura registrada exitosamente', invoice: newInvoice };
            }
        } catch (error) {
            throw new HttpException({ message: 'Error al registrar factura', error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getInvoiceById(id: number): Promise<InvoiceDataDto> {
        try {
            const invoice = await this.invoiceRepository.findOne({ where: { id } });
            if (!invoice) {
                throw new HttpException('Factura no encontrada', HttpStatus.NOT_FOUND);
            }
            const invoiceDto = {
                id: invoice.id,
                status: invoice.status,
                userId: invoice.userId,
                amount: invoice.amount,
                createdAt: invoice.createdAt,
                paidAt: invoice.paidAt,
            };
            return invoiceDto;
        } catch (error) {
            throw new HttpException(
                { message: 'Error al obtener factura', errors: [error.message] },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateInvoiceStatus(id: number, status: string): Promise<Invoice> {
        try {
            const invoice = await this.invoiceRepository.findOne({ where: { id } });
            if (!invoice) {
                throw new HttpException('Factura no encontrada', HttpStatus.NOT_FOUND);
            }

            // Validar el nuevo estado
            const validStatuses = ['Pendiente', 'Pagado', 'Vencido'];
            if (!validStatuses.includes(status)) {
                throw new HttpException('Estado inválido', HttpStatus.BAD_REQUEST);
            }
            if (invoice.status === status) {
                throw new HttpException('El estado ya es el mismo', HttpStatus.BAD_REQUEST);
            }
            if (status === 'Pagado') {
                invoice.paidAt = new Date(); // Asignar la fecha actual al campo paidAt
            }
            invoice.status = status;
            return await this.invoiceRepository.save(invoice);
        } catch (error) {
            throw new HttpException(
                { message: 'Error al actualizar factura', errors: [error.message] },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteInvoice(id: number): Promise<any> {
        try {
            const invoice = await this.invoiceRepository.findOne({ where: { id } });
            if (!invoice) {
                throw new HttpException('Factura no encontrada', HttpStatus.NOT_FOUND);
            }
            if (invoice.status === 'Pagado') {
                throw new HttpException('No se puede eliminar una factura pagada', HttpStatus.BAD_REQUEST);
            }
            invoice.deletedAt = new Date(); // Asignar la fecha actual al campo deletedAt
            await this.invoiceRepository.save(invoice);
            return { message: 'Factura eliminada exitosamente' };
        } catch (error) {
            throw new HttpException(
                { message: 'Error al eliminar factura', errors: [error.message] },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getUserInvoices(userId: number, isAdmin: boolean, status?: string): Promise<InvoiceDataDto[]> {
        try {
            const Query: any = { userId };
            if (status) {
                Query.status = status;
            }
            if (isAdmin) {
                delete Query.userId;
            }
            const invoices = await this.invoiceRepository.find({ where: Query });
            if (!invoices.length) {
                throw new HttpException('No se encontraron facturas para este usuario', HttpStatus.NOT_FOUND);
            }
            const InvoiceDto = invoices.map((invoice) => ({
                id: invoice.id,
                status: invoice.status,
                userId: invoice.userId,
                amount: invoice.amount,
                createdAt: invoice.createdAt,
                paidAt: invoice.paidAt,

            }));
            return InvoiceDto;
        } catch (error) {
            throw new HttpException(
                { message: 'Error al obtener facturas del usuario', errors: [error.message] },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}
