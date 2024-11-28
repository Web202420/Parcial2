import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(ClaseEntity)
    private readonly claseRepository: Repository<ClaseEntity>,
  ) {}

  async crearClase(clase: ClaseEntity): Promise<ClaseEntity> {
    if (clase.codigo.length !== 10)
      throw new BusinessLogicException(
        'Código de clase no válido',
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.claseRepository.save(clase);
  }

  async findClaseById(id: string): Promise<ClaseEntity> {
    const clase = await this.claseRepository.findOne({ where: { id } });
    if (!clase)
      throw new BusinessLogicException(
        'Clase no encontrada',
        BusinessError.NOT_FOUND,
      );
    return clase;
  }

  async findClaseByCodigo(codigo: string): Promise<ClaseEntity> {
    const clase = await this.claseRepository.findOne({ where: { codigo } });
    if (!clase)
      throw new BusinessLogicException(
        'Clase no encontrada',
        BusinessError.NOT_FOUND,
      );
    return clase;
  }
}
