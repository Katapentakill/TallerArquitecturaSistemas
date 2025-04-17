import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from 'src/entities/invoice.entity';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, User], 'userConnection'),

    JwtModule.register({
      secret: process.env.JWT_SECRET, // Clave secreta para firmar los tokens
      signOptions: { expiresIn: '1h' }, // Tiempo de expiración del token
    })
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService]
})
export class InvoicesModule {}
