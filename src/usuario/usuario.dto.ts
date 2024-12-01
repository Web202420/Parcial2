import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UsuarioDto {
  @IsNumber()
  @IsNotEmpty()
  readonly cedula: number;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly gInvestigacion: string;

  @IsNumber()
  @IsNotEmpty()
  readonly nExtension: number;
}
