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
import { BonoService } from './bono.service';
import { BonoDto } from './bono.dto';
import { BonoEntity } from './bono.entity';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('bono')
export class BonoController {
  constructor(private readonly bonoService: BonoService) {}

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
    const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
    return await this.bonoService.crearBono(bono);
  }

  @Delete(':bonoId')
  @HttpCode(204)
  async delete(@Param('bonoId') bonoId: string) {
    return await this.bonoService.deleteBono(bonoId);
  }
}
