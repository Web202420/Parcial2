import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { ClaseService } from '../clase/clase.service';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class BonoService {
  constructor(
    @InjectRepository(BonoEntity)
    private readonly bonoRepository: Repository<BonoEntity>,
    private readonly claseService: ClaseService,
    private readonly usuarioService: UsuarioService,
  ) {}

  async crearBono(bono: BonoEntity): Promise<BonoEntity> {
    if (!bono.monto || bono.monto <= 0 || bono.usuario.rol !== 'PROFESOR')
      throw new BusinessLogicException(
        'Bono no válido',
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.bonoRepository.save(bono);
  }

  async findAllBonos(): Promise<BonoEntity[]> {
    return await this.bonoRepository.find();
  }

  async findBonosByCodigo(codigo: string): Promise<BonoEntity[]> {
    const clase = await this.claseService.findClaseByCodigo(codigo);
    return await this.bonoRepository.find({ where: { clase } });
  }

  async findAllBonosByUsuarioId(id: string): Promise<BonoEntity[]> {
    const usuario = await this.usuarioService.findUsuarioById(id);
    return await this.bonoRepository.find({ where: { usuario } });
  }

  async deleteBono(id: string) {
    const bono = await this.bonoRepository.findOne({ where: { id } });
    if (!bono)
      throw new BusinessLogicException(
        'Bono no encontrado',
        BusinessError.NOT_FOUND,
      );
    await this.bonoRepository.remove(bono);
  }
}
