import { Injectable } from '@nestjs/common';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { prisma } from '../prisma';

@Injectable()
export class EntityService {
    constructor() {}

  create(createEntityDto: CreateEntityDto) {
    return prisma.entity.create({ data: createEntityDto });
  }

  findAll() {
     return prisma.entity.findMany();
  }

  findOne(id: number) {
    return prisma.entity.findUnique({ where: { id } });
  }

  update(id: number, updateEntityDto: UpdateEntityDto) {
        return prisma.entity.update({ where: { id }, data: updateEntityDto, });
  }

  remove(id: number) {
    return prisma.entity.delete({ where: { id } });
  }
}

