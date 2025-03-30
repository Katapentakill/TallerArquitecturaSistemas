export class InvoiceDataDto {
    id: number;
    userId: number;
    status: string;
    amount: number;
    paidAt: Date | null; // Puede ser null si la factura no está pagada
    createdAt: Date;
}
