import { Injectable } from '@nestjs/common';
import { CreateRowEavDto } from './dto/create-row-eav.dto';
import { UpdateRowEavDto } from './dto/update-row-eav.dto';
import { prisma } from '../prisma';

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

  update(id: number, updateRowEavDto: UpdateRowEavDto) {
    return `This action updates a #${id} rowEav`;
  }

  remove(id: number) {
    return `This action removes a #${id} rowEav`;
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
        take:1000 
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
