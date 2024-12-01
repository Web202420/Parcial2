import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClaseService } from './clase.service';
import { ClaseDto } from './clase.dto';
import { ClaseEntity } from './clase.entity';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('clase')
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  @Get()
  async findAll() {
    return await this.claseService.findAllClases();
  }

  @Get(':claseId')
  async findById(claseId: string) {
    return await this.claseService.findClaseById(claseId);
  }

  @Get('codigo/:codigo')
  async findByCodigo(codigo: string) {
    return await this.claseService.findClaseByCodigo(codigo);
  }

  @Post()
  async create(@Body() claseDto: ClaseDto) {
    const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDto);
    return await this.claseService.crearClase(clase);
  }
}
