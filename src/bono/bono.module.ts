import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { ClaseModule } from '../clase/clase.module';
import { BonoController } from './bono.controller';

@Module({
  providers: [BonoService],
  imports: [
    TypeOrmModule.forFeature([BonoEntity, UsuarioEntity]),
    UsuarioModule,
    ClaseModule,
  ],
  controllers: [BonoController],
})
export class BonoModule {}
