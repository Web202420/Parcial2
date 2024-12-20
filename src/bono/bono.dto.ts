import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BonoDto {
  @IsNumber()
  @IsNotEmpty()
  readonly monto: number;

  @IsNumber()
  @IsNotEmpty()
  readonly calificacion: number;

  @IsString()
  @IsNotEmpty()
  readonly pClave: string;

  @IsString()
  @IsNotEmpty()
  readonly usuarioId: string;

  @IsString()
  @IsNotEmpty()
  readonly claseId: string;
}
