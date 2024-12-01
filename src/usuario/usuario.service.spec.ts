import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Rol } from './rol.enum';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuariosList: UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    usuariosList = [];
    for (let i = 0; i < 5; i++) {
      const usuario: UsuarioEntity = await repository.save({
        cedula: faker.number.int({ min: 1000, max: 9999 }),
        nombre: faker.person.firstName(),
        gInvestigacion: faker.helpers.arrayElement([
          'TICSW',
          'IMAGINE',
          'COMIT',
        ]),
        nExtension: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: faker.helpers.arrayElement([Rol.PROFESOR, Rol.DECANA]),
        bonos: [],
      });
      usuariosList.push(usuario);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAllUsuarios should return all usuarios', async () => {
    const usuarios = await service.findAllUsuarios();
    expect(usuarios).not.toBeNull();
    expect(usuarios).toHaveLength(usuariosList.length);
  });

  it('createUsuario should create a profesor with valid group', async () => {
    const usuario: UsuarioEntity = {
      id: '',
      cedula: faker.number.int({ min: 1000, max: 9999 }),
      nombre: faker.person.firstName(),
      gInvestigacion: 'TICSW',
      nExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: Rol.PROFESOR,
      clases: [],
      bonos: [],
      usuario: null,
    };
    const newUsuario = await service.createUsuario(usuario);
    expect(newUsuario).not.toBeNull();
    expect(newUsuario.gInvestigacion).toBe(usuario.gInvestigacion);
  });

  it('createUsuario should throw an exception for profesor with invalid group', async () => {
    const usuario: UsuarioEntity = {
      id: '',
      cedula: faker.number.int({ min: 1000, max: 9999 }),
      nombre: faker.person.firstName(),
      gInvestigacion: 'INVALID',
      nExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: Rol.PROFESOR,
      clases: [],
      bonos: [],
      usuario: null,
    };
    await expect(() => service.createUsuario(usuario)).rejects.toHaveProperty(
      'message',
      'Grupo de investigación no válido',
    );
  });

  it('createUsuario should throw an exception for decana with invalid extension', async () => {
    const usuario: UsuarioEntity = {
      id: '',
      cedula: faker.number.int({ min: 1000, max: 9999 }),
      nombre: faker.person.firstName(),
      gInvestigacion: 'N/A',
      nExtension: faker.number.int({ min: 100000, max: 999999 }), // Extensión no válida
      rol: Rol.DECANA,
      clases: [],
      bonos: [],
      usuario: null,
    };
    await expect(() => service.createUsuario(usuario)).rejects.toHaveProperty(
      'message',
      'Número de extensión no válido',
    );
  });

  it('findUsuarioById should return a usuario by id', async () => {
    const storedUsuario = usuariosList[0];
    const usuario = await service.findUsuarioById(storedUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.nombre).toBe(storedUsuario.nombre);
  });

  it('findUsuarioById should throw an exception for invalid id', async () => {
    await expect(() =>
      service.findUsuarioById('INVALID'),
    ).rejects.toHaveProperty('message', 'Usuario no encontrado');
  });

  it('eliminarUsuario should remove a usuario', async () => {
    const usuario = (await repository.find()).find(
      (u) => u.rol === Rol.PROFESOR,
    );
    await service.eliminarUsuario(usuario.id);
    const deletedUsuario = await repository.findOne({
      where: { id: usuario.id },
    });
    expect(deletedUsuario).toBeNull();
  });

  it('eliminarUsuario should throw an exception for invalid id', async () => {
    await expect(() =>
      service.eliminarUsuario('INVALID'),
    ).rejects.toHaveProperty('message', 'Usuario no encontrado');
  });

  it('eliminarUsuario should throw an exception for decana', async () => {
    const usuario = usuariosList.find((u) => u.rol === Rol.DECANA);
    await expect(() =>
      service.eliminarUsuario(usuario.id),
    ).rejects.toHaveProperty(
      'message',
      'No se puede eliminar el usuario con rol de decana',
    );
  });
});
