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

  async update(updateRowEavDto: CreateRowEavDto[][]) {
    const temp:CreateRowEavDto[] = [];

    //1 проверить строки БЕЗ номера - это новые !
    for (let i = 0; i < updateRowEavDto.length; i++) {
      const row:CreateRowEavDto[] = updateRowEavDto[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        //строки БЕЗ номера - это новые !
        if (!cell.row) {
          let res = await this.query2(cell.col);  //находим номер последней строки в таблице
          let last = res._max.row || 0; //?? - переделать !! это нужно делать 1 раз для всей строки 
          cell.row = last+1;
          console.log(cell)
        }
        temp.push(cell);
      }
    }
    //обновить всю таблицу
    let tr = prisma.$transaction(
      temp.map(value=> {
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

    return tr;
  }

  // soft delete !
  softPacketDelete(deleteValueDto: DeleteRowEavDto[]) {
    //console.log(deleteValueDto)
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

  async exec(id:number, ts:string, from:string, to:string, ) {
      let res = await this.query3(id, ts, from, to);
      let rows = res.map(o=>o.row);
      res = await this.query4(rows);
      let trans = this.transform1(res); 
      return Object.fromEntries(trans);
      return res;
  }

  query1()  {
    return  prisma.rowEAV.findMany(
      {
        where:{
          col: { in: [1,2,3,4,5,6] },
          deletedAt: null,
        },
        include: {
          column: true,
        }, 

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

  query3(id:number, ts:string, from:string, to:string,)  {

    let djs = new Date(ts);
    let _from = new Date(from);
    let _to = new Date(to);

    return  prisma.rowEAV.findMany(
      {
        where:{
          col: { in: [4] },
          dtVal: { gte: _from, lt: _to  },
          deletedAt: null,
        },
        select:{
          row: true
        }
    });
  }

  query4(rows:number[])  {
    return  prisma.rowEAV.findMany(
      {
        where:{
          row: { in: rows },
          deletedAt: null,
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
