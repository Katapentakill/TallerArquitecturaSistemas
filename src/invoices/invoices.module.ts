import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from 'src/entities/invoice.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, User], 'userConnection')
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService]
})
export class InvoicesModule {}
