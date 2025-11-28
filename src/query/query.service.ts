import { Injectable } from '@nestjs/common';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { readFile } from 'fs/promises';
import path from 'path';
import { prisma } from '../prisma';
import {ValueFindManyArgs} from '../!generated/prisma/models';


@Injectable()
export class QueryService {
  
  constructor() {}

  create(createQueryDto: CreateQueryDto) {
    return prisma.query.create({data: createQueryDto})
  }

  findAll() {
    return prisma.query.findMany({take:1000});
  }

  findOne(id: number) {
    return prisma.query.findFirst({ where:{id:id}});
  }

  update(id: number, updateQueryDto: UpdateQueryDto) {
        return prisma.query.update(
      { 
        where:{ id:id },
        data: updateQueryDto,
      });
  }

  remove(id: number) {
    return prisma.query.delete({ where:{id:id} });
  }



  //----------- TEST
  async exec(queryId:string, ts:string, from:string, to:string, o:string, p:string) {

    let djs = new Date(ts);
    let _from = new Date(from);
    let _to = new Date(to);
    
    let ent = [];
    let att = [];

    try {
      ent = JSON.parse(o);
      att = JSON.parse(p);
    } catch (e) {
      console.error(e);
    }
  
    console.log(djs, _from, _to, ent, att,  )

    let res = await this.query7(_from, _to, ent, att);
    //return res;

    let trans = this.transform1(res); 
    return Object.fromEntries(trans); 
  }

  query1(ts: Date)  {
    return  prisma.value.findMany(
      {
        where:{
          "entityId": { in: [1] },
          "attributeId": { in: [1] },
          "ts": ts
        }, 
        take:1000 
    });
  }
  //group 
  query2()  {
    return  prisma.value.groupBy({
        by: ['entityId'],
        _count: { _all: true },    
    });
  }
  //filter +range +  by IN entity-attr   + select fields
  query3(from:Date, to:Date, ent:number[], att:number[])  {
    return  prisma.value.findMany(
      {
        where:{
          "entityId": { in: ent },
          "attributeId": { in: att },
          "ts": { gte: from, lt: to  }
        }, 
        select: {
          ts: true,
          entityId: true,
          attributeId: true,
          numberVal: true,
          stringVal: true,
          id: true,
        },
        orderBy:  {
          ts: 'asc',
        },
        take:1000 
    });
  }
  //aggregate func 
  query4(from:Date, to:Date,)  {
    return  prisma.value.aggregate(
      {
        where:{
          "entityId": { in: [1] },
          "attributeId": { in: [1] },
          "ts": { gte: from, lt: to  }
        }, 
          _avg: { numberVal: true },
          _sum: { numberVal: true },
    });
  } 
  //group + aggr func
  query5(from:Date, to:Date,  ent:number[], att:number[])  {
    return  prisma.value.groupBy(
      {
        by: ['entityId', 'attributeId'],
        where:{
          "entityId": { in: ent },
          "attributeId": { in: att },
          "ts": { gte: from, lt: to  }
        }, 
          _avg: { numberVal: true },
          _sum: { numberVal: true },
          _max: { ts: true },
          _min: { ts: true },
          _count: true,
      });
  } 
  //group + having- выполняется после фильтрации
  query6(from:Date, to:Date,)  {
    return  prisma.value.groupBy(
      {
        by: ['entityId'],
        where:{
          "entityId": { in: [1,2,3,4,5] },
          "attributeId": { in: [1] },
          "ts": { gte: from, lt: to  }
        }, 
          _avg: { numberVal: true },
          _sum: { numberVal: true },
          _count: true,
        having: {
            numberVal: { _avg: { gt: 50 }, },
        },
      });
  } 
  //filter query from json
  async query7(from:Date, to:Date, ent:number[], att:number[])  {
    
    const jQuery = path.resolve(__dirname, '../json/query1.json');

    const qArgs: ValueFindManyArgs = JSON.parse(await readFile(jQuery, 'utf8'));

    if (qArgs.where) qArgs.where.ts =  { gte: from, lt: to  }

    //console.log(qArgs)

    return  prisma.value.findMany(qArgs);
  }
  
  // преобразование  в строки, группируем по времени: MAP -> key - ts, предполагаем, объект имеет одно значение атрибута
  transform1(eav: any[]): Map<string, any>  {
    return eav.reduce((map, currValue, currIndex) => {
      
      let key = currValue.ts.toISOString(); //ключ строки

      if (!map.has(key)) map.set(key, { }); //строки еще нет - начать с новой строки

      let editableObject = map.get(key);  //редактируемый объект
      let objKey = currValue.entityId +"_"+ currValue.attributeId;  //key внутри строки
      editableObject[objKey] = currValue; 
      return map;
    }, new Map<string, any>());
  }
}
