import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateValueDto } from './dto/create-value.dto';
import { UpdateValueDto } from './dto/update-value.dto';
import { prisma } from '../prisma';


@Injectable()
export class ValueService {
  constructor() {}

  create(createValueDto: CreateValueDto) {

    return prisma.value.upsert({
            where: {
              entityId_attributeId_ts: {                  // составной уникальный ключ
                entityId: createValueDto.entityId,
                attributeId: createValueDto.attributeId,
                ts: createValueDto.ts
              },
            },
            update: { 
              stringVal: createValueDto.stringVal, 
              numberVal:createValueDto.numberVal,
              boolVal:createValueDto.boolVal,
              dateVal:createValueDto.dateVal
            },
            create: {                   // создать, если нет
              entityId: createValueDto.entityId,
              attributeId: createValueDto.attributeId,
              ts: createValueDto.ts,
              stringVal: createValueDto.stringVal,
              numberVal:createValueDto.numberVal,
              boolVal:createValueDto.boolVal,
              dateVal:createValueDto.dateVal
            },
    });

  }

  findAll() {
    return prisma.value.findMany({ take:1000 });
  }

  findOne(id: number) {
    return `This action returns a #${id} value`;
  }

  update(createValueDto: CreateValueDto[]) {
  /*
    await prisma.$transaction([
      prisma.attributeValue.deleteMany({ where: { entityId: 42 } }),
      prisma.attributeValue.createMany({ data: [...] })
    ]);
  */
 
    return prisma.$transaction(createValueDto.map(value=> {
        return prisma.value.upsert({
            where: {
              entityId_attributeId_ts: {                  // составной уникальный ключ
                entityId: value.entityId,
                attributeId: value.attributeId,
                ts: value.ts,
              },
            },
            update: { 
              stringVal: value.stringVal, 
              numberVal:value.numberVal,
              boolVal:value.boolVal,
              dateVal:value.dateVal
            },
            create: {                   // создать, если нет
              entityId: value.entityId,
              attributeId: value.attributeId,
              ts: value.ts,
              stringVal: value.stringVal,
              numberVal:value.numberVal,
              boolVal:value.boolVal,
              dateVal:value.dateVal
            },
    });
    }));
  }

  remove(id: number) {
    return `This action removes a #${id} value`;
  }




}
