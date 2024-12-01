import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioController } from './usuario.controller';

@Module({
  providers: [UsuarioService],
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  exports: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
