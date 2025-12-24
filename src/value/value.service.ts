import { Injectable } from '@nestjs/common';
import { CreateValueDto } from './dto/create-value.dto';
import { prisma } from '../prisma';
import { DeleteValueDto } from './dto/delete-value.dto';


@Injectable()
export class ValueService {

  create(createValueDto: CreateValueDto) {
    return prisma.value.create({
            data: {
              ent: createValueDto.ent,
              att: createValueDto.att,
              ts: createValueDto.ts,
              strVal: createValueDto.strVal,
              numVal: createValueDto.numVal,
              dtVal: createValueDto.dtVal,
              createdAt: new Date(),
            },
    });
  }

  findAll() {
    return prisma.value.findMany({ take:1000 });
  }

  findOne(id: number) {
    return `This action returns a #${id} value`;
  }
  //packet update
  update(createValueDto: CreateValueDto[]) {
    return prisma.$transaction(createValueDto.map(value=> {
        return prisma.value.upsert({
            where: {
              ent_att_ts: {                  // составной уникальный ключ
                ent: value.ent,
                att: value.att,
                ts: value.ts,
              },
            },
            update: { 
              strVal: value.strVal, 
              numVal: value.numVal,
              dtVal:  value.dtVal,
              deletedAt:  null,         //при обновлени сбрасыввается признан "удалено"
              updatedAt:  new Date(),         
            },
            create: {                   // создать, если нет
              ent: value.ent,
              att: value.att,
              ts: value.ts,

              strVal: value.strVal,
              numVal: value.numVal,
              dtVal:  value.dtVal,

              createdAt:  new Date(),
              deletedAt:  null,         //при create сбрасыввается признак "удалено"
              updatedAt:  null,         //при create сбрасыввается признак "редактирование"
            },
    });
    }));
  }
  
  // soft delete !
  softPacketDelete(deleteValueDto: DeleteValueDto[]) {
    return prisma.$transaction(deleteValueDto.map(value=> {
        return prisma.value.update({
            where: {
              ent_att_ts: {                  // составной уникальный ключ
                ent: value.ent,
                att: value.att,
                ts: value.ts,
              },
            },
            data: { 
              deletedAt:  new Date(),         //soft delete - set признак "удалено"        
            }
        });
    }));
  }

  remove(id: number) {
    return prisma.value.delete({ where: { id: id } });
  }

}
