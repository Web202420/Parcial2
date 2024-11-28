import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { ClaseService } from 'src/clase/clase.service';
import { UsuarioEntity } from 'src/usuario/usuario.entity';

@Injectable()
export class BonoService {
  constructor(
    @InjectRepository(BonoEntity)
    private readonly bonoRepository: Repository<BonoEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    private readonly claseService: ClaseService,
  ) {}

  async crearBono(bono: BonoEntity): Promise<BonoEntity> {
    if (!bono.monto || bono.monto <= 0 || bono.usuario.rol !== 'PROFESOR')
      throw new BusinessLogicException(
        'Bono no válido',
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.bonoRepository.save(bono);
  }

  async findBonosByCodigo(codigo: string): Promise<BonoEntity[]> {
    const clase = await this.claseService.findClaseByCodigo(codigo);
    return await this.bonoRepository.find({ where: { clase } });
  }

  async findBonosByUsuarioId(id: string): Promise<BonoEntity[]> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    return await this.bonoRepository.find({ where: { usuario } });
  }
}
