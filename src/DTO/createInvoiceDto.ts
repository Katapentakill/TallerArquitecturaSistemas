import { IsEmail, IsNotEmpty, Min, IsOptional, IsNumber, IsDate, IsDateString, IsIn } from 'class-validator';

export class CreateInvoiceDto {

  @IsNotEmpty()
  userid: string;

  @IsNotEmpty()
  @IsIn(['Pendiente', 'Pagado', 'Vencido'], { message: 'Estado debe ser Pendiente, Pagado o Vencido' })
  status: string; 

  @IsNumber()
  @Min(1)
  amount: string; 
  
}
