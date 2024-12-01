import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  async findAll() {
    return await this.usuarioService.findAllUsuarios();
  }

  @Get(':usuarioId')
  async findById(usuarioId: string) {
    return await this.usuarioService.findUsuarioById(usuarioId);
  }

  @Post()
  async create(@Body() usuarioDto: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
    return await this.usuarioService.createUsuario(usuario);
  }

  @Delete(':usuarioId')
  @HttpCode(204)
  async delete(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioService.eliminarUsuario(usuarioId);
  }
}
