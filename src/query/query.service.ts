import { Injectable } from '@nestjs/common';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { readFile } from 'fs/promises';
import path from 'path';
import { prisma } from '../prisma';
import {ValueFindManyArgs, ValueGroupByArgs, ValueAggregateArgs, ValueOrderByWithAggregationInput} from '../!generated/prisma/models';


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
  async exec(queryId:string, ts:string, from:string, to:string, ) {

    let djs = new Date(ts);
    let _from = new Date(from);
    let _to = new Date(to);
    
    let ent = [];
    let att = [];
    let res:  any;
    let trans:any; 


  
    console.log(djs, _from, _to, ent, att,  )

    let q = await this.findOne(+queryId);

    switch (q?.name) {
      case "query1":  //findMany !
        res = await this.query8(q.params, _from, _to);
        trans = this.transform1(res); 
        return Object.fromEntries(trans);    

      case "query2":  //groupBy !
        res = await this.query9(q.params, _from, _to);
        //console.log(res)
        trans = this.transform2(res, "_sum", ts); //"_sum", "_avg"
        return Object.fromEntries(trans);    

      case "query3":  //aggregate !
        res = await this.query10(q.params, _from, _to);
        //console.log(res)
        trans = this.transform3(res, "_sum", ts); //"_sum", "_avg" не нужно ??
        return Object.fromEntries(trans); 
    }

    //res = await this.query4(_from, _to);
    //console.log(res)
    //return res;

    //let trans = this.transform2(res); 
    //return Object.fromEntries(trans);
    return "";
  }

  query1(ts: Date)  {
    return  prisma.value.findMany(
      {
        where:{
          "ent": { in: [1] },
          "att": { in: [1] },
          "ts": ts
        }, 
        take:1000 
    });
  }
  //group 
  query2()  {
    return  prisma.value.groupBy({
        by: ['ent'],
        _count: { _all: true },    
    });
  }
  //filter +range +  by IN entity-attr   + select fields
  query3(from:Date, to:Date, ent:number[], att:number[])  {
    return  prisma.value.findMany(
      {
        where:{
          "ent": { in: ent },
          "att": { in: att },
          "ts": { gte: from, lt: to  }
        }, 
        select: {
          ts: true,
          ent: true,
          att: true,
          numVal: true,
          strVal: true,
          id: true,
        },
        orderBy:  {
          ts: 'asc',
        },
        take:1000 
    });
  }

  //aggregate func - по всей выборке целиком, без деления на группы. !!!
  query4(from:Date, to:Date,)  {
    return  prisma.value.aggregate(
      {
        where:{
          "ent": { in: [1,2,3,4,5] },
          "att": { in: [1,2,3,4,5] },
          "ts": { gte: from, lt: to  }
        }, 
          _avg: { numVal: true },
          _sum: { numVal: true },
    });
  } 
  //group + aggr func
  query5(from:Date, to:Date,  ent:number[], att:number[])  {
    return  prisma.value.groupBy(
      {
        by: ['ent', 'att'],
        where:{
          "ent": { in: ent },
          "att": { in: att },
          "ts": { gte: from, lt: to  }
        }, 
          _avg: { numVal: true },
          _sum: { numVal: true },
          _max: { ts: true },
          _min: { ts: true },
          _count: true,
      });
  } 
  //group + having- выполняется после фильтрации
  query6(from:Date, to:Date,)  {
    return  prisma.value.groupBy(
      {
        by: ['ent','att'],
        where:{
          "ent": { in: [1,2,3,4,5] },
          "att": { in: [1] },
          "ts": { gte: from, lt: to  }
        }, 
          _avg: { numVal: true },
          _sum: { numVal: true },
          _count: true,
        having: {
            numVal: { _avg: { gt: 0 }, },
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
  async query8(jArgs:string, from:Date, to:Date)  {
    
    const qArgs: ValueFindManyArgs = JSON.parse(jArgs);

    if (qArgs.where) qArgs.where.ts =  { gte: from, lt: to  }

    //console.log(qArgs)

    return  prisma.value.findMany(qArgs);
  }  
  query9(jArgs:string, from:Date, to:Date)  {
    
    const qArgs = JSON.parse(jArgs);

    if (qArgs.where) qArgs.where.ts =  { gte: from, lt: to  }

    //console.log(qArgs)

    return  prisma.value.groupBy(qArgs);
  }
  query10(jArgs:string, from:Date, to:Date)  {
    
    const qArgs = JSON.parse(jArgs);

    if (qArgs.where) qArgs.where.ts =  { gte: from, lt: to  }

    //console.log(qArgs)

    return  prisma.value.aggregate(qArgs);
  }




  // преобразование  в строки, группируем по времени: MAP -> key - ts, предполагаем, объект имеет одно значение атрибута
  transform1(eav: any[]): Map<string, any>  {
    return eav.reduce((map, currValue, currIndex) => {
      
      let key = currValue.ts.toISOString(); //ключ строки

      if (!map.has(key)) map.set(key, { }); //строки еще нет - начать с новой строки

      let editableObject = map.get(key);  //редактируемый объект
      let objKey = currValue.ent +"_"+ currValue.att;  //key внутри строки
      editableObject[objKey] = currValue.strVal; //always string
      return map;
    }, new Map<string, any>());
  }
  // преобразование  в строки, группируем в одну строку для универсальности привязки. Значение берется по field !
  transform2(eav: any[], field: string, ts:string): Map<string, any>  {
    return eav.reduce((map, currValue, currIndex) => {
      
      let key = ts; //ключ строки 1 

      if (!map.has(key)) map.set(key, { }); //строки еще нет - начать с новой строки

      let editableObject = map.get(key);  //редактируемый объект
      let objKey = currValue.ent +"_"+ currValue.att;  //key внутри строки
      editableObject[objKey] = currValue[field].numVal; 
      return map;
    }, new Map<string, any>());
  }
  // преобразование "Обект в Map" для универсальности привязки
  transform3(eav: any, field: string, ts:string): Map<string, any>  {
      return Object.keys(eav).reduce((map, objKey, currIndex) => {
      
      let key = ts; //ключ строки 1 

      if (!map.has(key)) map.set(key, { }); //строки еще нет - начать с новой строки

      let editableObject = map.get(key);  //редактируемый объект
      
      editableObject[objKey] = eav[objKey].numVal;

      return map;
    }, new Map<string, any>());

  }

}
