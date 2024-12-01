import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
import { Repository } from 'typeorm';
import { ClaseEntity } from './clase.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClaseService', () => {
  let service: ClaseService;
  let repository: Repository<ClaseEntity>;
  let clasesList: ClaseEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClaseService],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    repository = module.get<Repository<ClaseEntity>>(
      getRepositoryToken(ClaseEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clasesList = [];
    for (let i = 0; i < 5; i++) {
      const clase: ClaseEntity = await repository.save({
        nombre: faker.lorem.words(3),
        codigo: faker.string.alphanumeric(10),
        creditos: faker.number.int({ min: 1, max: 10 }),
      });
      clasesList.push(clase);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAllClases should return all clases', async () => {
    const clases = await service.findAllClases();
    expect(clases).not.toBeNull();
    expect(clases).toHaveLength(clasesList.length);
  });

  it('crearClase should create a new clase successfully', async () => {
    const clase: ClaseEntity = {
      id: '',
      nombre: faker.lorem.words(3),
      codigo: faker.string.alphanumeric(10),
      creditos: 4,
      usuario: null,
      bonos: [],
    };
    const newClase = await service.crearClase(clase);
    expect(newClase).not.toBeNull();
    expect(newClase.codigo).toBe(clase.codigo);
    expect(newClase.nombre).toBe(clase.nombre);
    expect(newClase.creditos).toBe(clase.creditos);
    const storedClase = await repository.findOne({
      where: { id: newClase.id },
    });
    expect(storedClase).not.toBeNull();
    expect(storedClase.codigo).toBe(clase.codigo);
  });

  it('crearClase should throw an exception for invalid codigo', async () => {
    const clase: ClaseEntity = {
      id: '',
      nombre: faker.lorem.words(3),
      codigo: faker.string.alphanumeric(8),
      creditos: 4,
      usuario: null,
      bonos: [],
    };
    await expect(() => service.crearClase(clase)).rejects.toHaveProperty(
      'message',
      'Código de clase no válido',
    );
  });

  it('findClaseById should return a clase by id', async () => {
    const storedClase = clasesList[0];
    const clase = await service.findClaseById(storedClase.id);
    expect(clase).not.toBeNull();
    expect(clase.nombre).toBe(storedClase.nombre);
    expect(clase.codigo).toBe(storedClase.codigo);
  });

  it('findClaseById should throw an exception for invalid id', async () => {
    await expect(() => service.findClaseById('INVALID')).rejects.toHaveProperty(
      'message',
      'Clase no encontrada',
    );
  });

  it('findClaseByCodigo should return a clase by codigo', async () => {
    const storedClase = clasesList[0];
    const clase = await service.findClaseByCodigo(storedClase.codigo);
    expect(clase).not.toBeNull();
    expect(clase.nombre).toBe(storedClase.nombre);
    expect(clase.codigo).toBe(storedClase.codigo);
  });

  it('findClaseByCodigo should throw an exception for invalid codigo', async () => {
    await expect(() =>
      service.findClaseByCodigo('INVALID'),
    ).rejects.toHaveProperty('message', 'Clase no encontrada');
  });
});
