import { Test, TestingModule } from '@nestjs/testing';
import { BonoService } from './bono.service';
import { Repository } from 'typeorm';
import { BonoEntity } from './bono.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ClaseService } from '../clase/clase.service';
import { UsuarioService } from '../usuario/usuario.service';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity';

describe('BonoService', () => {
  let service: BonoService;
  let repository: Repository<BonoEntity>;
  let bonosList: BonoEntity[];
  let usuarioRepository: Repository<UsuarioEntity>;
  let usuario: UsuarioEntity;
  let claseRepository: Repository<ClaseEntity>;
  let clase: ClaseEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonoService, ClaseService, UsuarioService],
    }).compile();

    service = module.get<BonoService>(BonoService);
    repository = module.get<Repository<BonoEntity>>(
      getRepositoryToken(BonoEntity),
    );
    usuarioRepository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );
    claseRepository = module.get<Repository<ClaseEntity>>(
      getRepositoryToken(ClaseEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.delete({});
    await claseRepository.delete({});
    await usuarioRepository.delete({});

    usuario = await usuarioRepository.save({
      cedula: 1234,
      nombre: 'Usuario',
      gInvestigacion: 'Investigacion',
      nExtension: 1234,
      rol: 'PROFESOR',
    });

    clase = await claseRepository.save({
      codigo: '1234',
      nombre: 'Clase',
      creditos: 4,
    });

    bonosList = [];
    for (let i = 0; i < 5; i++) {
      const bono: BonoEntity = await repository.save({
        monto: faker.number.int(1000),
        calificacion: faker.number.int(10),
        pClave: faker.lorem.word(),
        usuario: usuario,
        clase: clase,
      });
      bonosList.push(bono);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAllBonos should return all bonos', async () => {
    const bonos = await service.findAllBonos();
    expect(bonos).not.toBeNull();
    expect(bonos).toHaveLength(bonosList.length);
  });

  it('findBonosByCodigo should return bonos for a given clase codigo', async () => {
    const bonos = await service.findBonosByCodigo(clase.codigo);
    expect(bonos).not.toBeNull();
    expect(bonos).toHaveLength(bonosList.length);
  });

  it('findBonosByCodigo should throw an exception for invalid clase codigo', async () => {
    await expect(() =>
      service.findBonosByCodigo('INVALID'),
    ).rejects.toHaveProperty('message', 'Clase no encontrada');
  });

  it('findAllBonosByUsuarioId should return bonos for a given usuario id', async () => {
    const bonos = await service.findAllBonosByUsuarioId(usuario.id);
    expect(bonos).not.toBeNull();
    expect(bonos).toHaveLength(bonosList.length);
  });

  it('findAllBonosByUsuarioId should throw an exception for invalid usuario id', async () => {
    await expect(() =>
      service.findAllBonosByUsuarioId('INVALID'),
    ).rejects.toHaveProperty('message', 'Usuario no encontrado');
  });

  it('should create a new bono successfully', async () => {
    const bono: BonoEntity = {
      id: '',
      monto: 1000,
      calificacion: 8,
      pClave: faker.lorem.word(),
      usuario: usuario,
      clase: clase,
    };
    const newBono = await service.crearBono(bono);
    expect(newBono).not.toBeNull();
    expect(newBono.monto).toBe(bono.monto);
    expect(newBono.calificacion).toBe(bono.calificacion);
    expect(newBono.pClave).toBe(bono.pClave);
  });

  it('crearBono should throw an exception for invalid monto', async () => {
    const bono: BonoEntity = {
      id: '',
      monto: -100,
      calificacion: 8,
      pClave: faker.lorem.word(),
      usuario: usuario,
      clase: clase,
    };
    await expect(() => service.crearBono(bono)).rejects.toHaveProperty(
      'message',
      'Bono no válido',
    );
  });

  it('crearBono should throw an exception if usuario rol is not PROFESOR', async () => {
    const invalidUsuario = await usuarioRepository.save({
      cedula: 5678,
      nombre: 'Otro Usuario',
      gInvestigacion: 'Investigacion',
      nExtension: 5678,
      rol: 'DECANA',
    });
    const bono: BonoEntity = {
      id: '',
      monto: 1000,
      calificacion: 8,
      pClave: faker.lorem.word(),
      usuario: invalidUsuario,
      clase: clase,
    };
    await expect(() => service.crearBono(bono)).rejects.toHaveProperty(
      'message',
      'Bono no válido',
    );
  });

  it('deleteBono should remove a bono', async () => {
    const bono = bonosList[0];
    await service.deleteBono(bono.id);
    const deletedBono = await repository.findOne({ where: { id: bono.id } });
    expect(deletedBono).toBeNull();
  });

  it('deleteBono should throw an exception for invalid bono id', async () => {
    await expect(() => service.deleteBono('INVALID')).rejects.toHaveProperty(
      'message',
      'Bono no encontrado',
    );
  });
});
