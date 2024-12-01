
# Sistema de Gestión de Bonos de Viaje para Profesores

Este proyecto implementa una API REST desarrollada en **NestJS** para gestionar los bonos de viaje asignados a profesores por la Universidad, basándose en las calificaciones obtenidas en las encuestas de los cursos. La aplicación permite la administración de las entidades `Usuario`, `Clase` y `Bono`, asegurando el cumplimiento de reglas de negocio específicas.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Pruebas](#pruebas)
- [Documentación](#documentación)
- [Contribuciones](#contribuciones)

## Instalación

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/Web202420/Parcial2.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd Parcial2
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Configura las variables de entorno necesarias en el archivo `.env`.

5. Inicia el servidor:
   ```bash
   npm run start:dev
   ```

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
src/
├── bono/
│   ├── bono.controller.ts
│   ├── bono.entity.ts
│   ├── bono.module.ts
│   ├── bono.service.ts
├── clase/
│   ├── clase.controller.ts
│   ├── clase.entity.ts
│   ├── clase.module.ts
│   ├── clase.service.ts
├── usuario/
│   ├── usuario.controller.ts
│   ├── usuario.entity.ts
│   ├── usuario.module.ts
│   ├── usuario.service.ts
├── shared/
│   ├── errors/
│   │   ├── business-errors.ts
│   ├── testing-utils/
│       ├── typeorm-testing-config.ts
```

## Funcionalidades

### Entidades
1. **Usuario**:
   - Tiene atributos como cédula, nombre, grupo de investigación, número de extensión, rol (`PROFESOR` o `DECANA`), y un jefe (otro usuario).
   - Reglas de negocio:
     - Profesores solo pueden pertenecer a los grupos de investigación `TICSW`, `IMAGINE` o `COMIT`.
     - Decanas deben tener un número de extensión de exactamente 8 dígitos.
     - No se puede eliminar un usuario con rol `DECANA` ni uno que tenga bonos asociados.

2. **Clase**:
   - Incluye atributos como nombre, código y número de créditos.
   - Reglas de negocio:
     - El código debe tener exactamente 10 caracteres.

3. **Bono**:
   - Tiene atributos como monto, calificación y una palabra clave.
   - Reglas de negocio:
     - Solo los profesores pueden tener bonos.
     - El monto debe ser positivo y no vacío.
     - Los bonos con calificación mayor a 4 no pueden ser eliminados.

### Servicios y Métodos
- **Usuario**:
  - Crear usuario (`crearUsuario`).
  - Buscar usuario por ID (`findUsuarioById`).
  - Eliminar usuario (`eliminarUsuario`).

- **Clase**:
  - Crear clase (`crearClase`).
  - Buscar clase por ID (`findClaseById`).

- **Bono**:
  - Crear bono (`crearBono`).
  - Buscar bono por código (`findBonoByCodigo`).
  - Listar bonos por usuario (`findAllBonosByUsuario`).
  - Eliminar bono (`deleteBono`).

### Controladores
- Exponen los servicios a través de endpoints REST.

### Pruebas
- Implementadas para garantizar el correcto funcionamiento de los servicios.
- Cada método tiene al menos un caso positivo y un caso negativo.

### Documentación
- Documentación y pruebas de API creadas en **Postman**, incluyendo ejemplos de solicitudes y respuestas.


## Justificación de las Pruebas en Postman

### Objetivo
El objetivo principal de las pruebas realizadas en Postman fue validar que todos los endpoints del API funcionan correctamente cuando reciben entradas válidas, garantizando que las funcionalidades diseñadas en la lógica del sistema y la persistencia cumplen con los requisitos establecidos. 

### Estrategia de Pruebas
Las pruebas en Postman se enfocaron en cubrir **todos los endpoints disponibles** para las entidades `Bono`, `Clase` y `Usuario`, realizando únicamente **pruebas positivas**. Esta decisión se tomó porque:
1. Las pruebas unitarias desarrolladas previamente ya verifican exhaustivamente los casos negativos (parámetros inválidos, violaciones de reglas de negocio, etc.).
2. Las validaciones estrictas implementadas en la capa de lógica aseguran que cualquier parámetro inválido o solicitud fuera de los límites definidos sea rechazado antes de llegar a la capa de controladores.

Con este enfoque, las pruebas desde Postman se centraron en validar el flujo completo del sistema en escenarios ideales, simulando el uso real del API.

### Pruebas Realizadas

#### **Bono**
1. **Create Clase for Tests**: Crear una clase de prueba necesaria para asociar bonos.
2. **Create Usuario for Tests**: Crear un usuario de prueba necesario para asociar bonos.
3. **Create Bono**: Validar que un bono puede ser creado correctamente.
4. **FindAll Bonos**: Listar todos los bonos existentes.
5. **FindByCodigoClase Bono**: Buscar bonos por el código de la clase asociada.
6. **FindByUserId Bono**: Buscar todos los bonos asociados a un usuario específico.

#### **Clase**
1. **Create Clase**: Validar la creación de una nueva clase.
2. **FindAll Clases**: Listar todas las clases existentes.
3. **FindById Clase**: Buscar una clase específica por su ID.
4. **FindByCodigo Clase**: Buscar una clase específica por su código.

#### **Usuario**
1. **Create Usuario**: Validar la creación de un nuevo usuario.
2. **FindAll Usuario**: Listar todos los usuarios existentes.
3. **FindById Usuario**: Buscar un usuario específico por su ID.
4. **DeleteById Usuario**: Eliminar un usuario por su ID, asegurando que cumpla las condiciones necesarias (sin bonos asociados y sin rol de decana).

Las pruebas realizadas en Postman confirman que:
- Todos los endpoints expuestos son funcionales y cumplen con las especificaciones definidas.
- El sistema opera correctamente en escenarios positivos, manejando datos válidos para cada caso de uso.

Al realizar estas pruebas positivas, se asegura que el API cumple su propósito principal en condiciones ideales, complementando las pruebas unitarias que validan los límites y restricciones de las reglas de negocio.

## Tecnologías Utilizadas

- **NestJS**: Framework para el desarrollo del backend.
- **TypeORM**: ORM para la interacción con la base de datos.
- **Postman**: Para pruebas y documentación del API.
- **TypeScript**: Lenguaje de programación principal.
- **Jest**: Framework de pruebas unitarias.

## Pruebas

1. **Pruebas Unitarias**: Realizadas para validar la lógica de negocio.
2. **Pruebas en Postman**: Cubren los principales endpoints del API.

### Ejecución de las Pruebas Unitarias
```bash
npm run test:watch
```

## Documentación

La colección de Postman incluye:
- Ejemplos de solicitudes y respuestas para cada endpoint.
- Pruebas automáticas que validan los principales casos de uso.

Puedes importar la colección desde el archivo proporcionado en el repositorio.

## Contribuciones

Este proyecto es parte de un ejercicio académico. Las contribuciones externas no están permitidas. Sin embargo, puedes revisar el código y utilizarlo como referencia para tus propios proyectos.
