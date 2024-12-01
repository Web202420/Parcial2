import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity';
import { ClaseController } from './clase.controller';

@Module({
  providers: [ClaseService],
  imports: [TypeOrmModule.forFeature([ClaseEntity])],
  exports: [ClaseService],
  controllers: [ClaseController],
})
export class ClaseModule {}
