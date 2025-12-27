import { Injectable } from '@nestjs/common';
import { CreateRowEavDto } from './dto/create-row-eav.dto';
import { UpdateRowEavDto } from './dto/update-row-eav.dto';
import { prisma } from '../prisma';
import { DeleteRowEavDto } from './dto/delete-row-eav.dto';

@Injectable()
export class RowEavService {
  create(createRowEavDto: CreateRowEavDto) {
    return 'This action adds a new rowEav';
  }

  findAll() {
    return `This action returns all rowEav`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rowEav`;
  }

  update(updateRowEavDto: CreateRowEavDto[]) {
        return prisma.$transaction(updateRowEavDto.map(value=> {
        return prisma.rowEAV.upsert({
            where: {
              row_col: {                  // составной уникальный ключ
                row: value.row,
                col: value.col,
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
              row: value.row,
              col: value.col,

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
  softPacketDelete(deleteValueDto: DeleteRowEavDto[]) {
    return prisma.$transaction(deleteValueDto.map(value=> {
        return prisma.rowEAV.update({
          where: {
            row_col: {                  // составной уникальный ключ
              row: value.row,
              col: value.col,
            },
            },
            data: { 
              deletedAt:  new Date(),         //soft delete - set признак "удалено"        
            }
        });
    }));
  }

  remove(id: number) {
    return prisma.rowEAV.delete({ where: { id: id } });
  }

  async exec() {
      let res = await this.query1();
      let trans = this.transform1(res); 
      return Object.fromEntries(trans);
  }

  query1()  {
    return  prisma.rowEAV.findMany(
      {
        where:{
          "col": { in: [1,2,3,4,5,6] },
        },
        include: {
          column: true,
        }, 
        take:1000 
    });
  }

  //find MAX row for col
  query2(col: number)  {
    return prisma.rowEAV.aggregate({
      where: {
        col: col,
        //deletedAt: null,  // игнорировать удалённые
      },
      _max: {
        row: true,
      },
    });
  }

  transform1(eav: any[]): Map<string, any>  {
    return eav.reduce((map, currValue, currIndex) => {
      
      let key = currValue.row; //ключ строки

      if (!map.has(key)) map.set(key, { }); //строки еще нет - начать с новой строки

      let editableObject = map.get(key);  //редактируемый объект
      let objKey = currValue.col;  //key внутри строки
      editableObject[objKey] = currValue;
      return map;
    }, new Map<string, any>());
  }
}
