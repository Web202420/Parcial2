import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { Repository } from 'typeorm';
import { Rol } from './rol.enum';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async findAllUsuarios(): Promise<UsuarioEntity[]> {
    return await this.usuarioRepository.find();
  }

  async createUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
    if (usuario.rol === Rol.PROFESOR) {
      if (!['TICSW', 'IMAGINE', 'COMIT'].includes(usuario.gInvestigacion))
        throw new BusinessLogicException(
          'Grupo de investigación no válido',
          BusinessError.PRECONDITION_FAILED,
        );
    } else if (usuario.rol === Rol.DECANA) {
      if (usuario.nExtension.toString().length !== 8)
        throw new BusinessLogicException(
          'Número de extensión no válido',
          BusinessError.PRECONDITION_FAILED,
        );
    }
    return await this.usuarioRepository.save(usuario);
  }

  async findUsuarioById(id: string): Promise<UsuarioEntity> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario)
      throw new BusinessLogicException(
        'Usuario no encontrado',
        BusinessError.NOT_FOUND,
      );
    return usuario;
  }

  async eliminarUsuario(id: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario)
      throw new BusinessLogicException(
        'Usuario no encontrado',
        BusinessError.NOT_FOUND,
      );

    if (usuario.rol === Rol.DECANA)
      throw new BusinessLogicException(
        'No se puede eliminar el usuario con rol de decana',
        BusinessError.PRECONDITION_FAILED,
      );

    if (usuario.bonos.length > 0)
      throw new BusinessLogicException(
        'No se puede eliminar el usuario con bonos asociados',
        BusinessError.PRECONDITION_FAILED,
      );

    await this.usuarioRepository.remove(usuario);
  }
}
