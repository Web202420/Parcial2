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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { BonoService } from './bono.service';
import { BonoDto } from './bono.dto';
import { BonoEntity } from './bono.entity';
import { plainToInstance } from 'class-transformer';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import { ClaseService } from 'src/clase/clase.service';
import { ClaseEntity } from 'src/clase/clase.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('bono')
export class BonoController {
  constructor(
    private readonly bonoService: BonoService,
    private readonly usuarioService: UsuarioService,
    private readonly claseService: ClaseService,
  ) {}

  @Get()
  async findAll() {
    return await this.bonoService.findAllBonos();
  }

  @Get('clase/:codigo')
  async findByCodigo(@Param('codigo') codigo: string) {
    return await this.bonoService.findBonosByCodigo(codigo);
  }

  @Get('usuario/:usuarioId')
  async findByUsuarioId(@Param('usuarioId') usuarioId: string) {
    return await this.bonoService.findAllBonosByUsuarioId(usuarioId);
  }

  @Post()
  async create(@Body() bonoDto: BonoDto) {
    const usuario: UsuarioEntity = await this.usuarioService.findUsuarioById(
      bonoDto.usuarioId,
    );
    const clase: ClaseEntity = await this.claseService.findClaseById(
      bonoDto.claseId,
    );
    const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
    bono.usuario = usuario;
    bono.clase = clase;
    return await this.bonoService.crearBono(bono);
  }

  @Delete(':bonoId')
  @HttpCode(204)
  async delete(@Param('bonoId') bonoId: string) {
    return await this.bonoService.deleteBono(bonoId);
  }
}
