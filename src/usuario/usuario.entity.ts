import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rol } from './rol.enum';
import { ClaseEntity } from 'src/clase/clase.entity';
import { BonoEntity } from 'src/bono/bono.entity';

@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  gInvestigacion: string;

  @Column()
  nExtension: number;

  @Column()
  rol: Rol;

  @OneToOne(() => UsuarioEntity, (usuario) => usuario.usuario)
  usuario: UsuarioEntity;

  @OneToMany(() => ClaseEntity, (clase) => clase.usuario)
  clases: ClaseEntity[];

  @OneToMany(() => BonoEntity, (bono) => bono.usuario)
  bonos: BonoEntity[];
}
