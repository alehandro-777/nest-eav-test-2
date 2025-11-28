import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { prisma } from '../prisma';

@Injectable()
export class AttributeService {
    constructor() {}

  create(createAttributeDto: CreateAttributeDto) {
    return 'This action adds a new attribute';
  }

  findAll() {
    return prisma.attribute.findMany({ include:{ kVSet:{include:{values:true}}, range:true }});
  }

  findOne(id: number) {
    return prisma.attribute.findFirst({ include:{ kVSet:{include:{values:true}}, range:true }});
  }

  update(id: number, updateAttributeDto: UpdateAttributeDto) {
    return `This action updates a #${id} attribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} attribute`;
  }
}
