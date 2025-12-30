import { Injectable,  } from '@nestjs/common';
import { prisma } from '../prisma';
import { CreateTable1 } from './dto/create-table-e.dto';
import { DeleteTableDto } from './dto/delete-table-e.dto';

@Injectable()
export class TableQueryService {
    async findMany(id: number, ts:string, from:string, to:string, )  {
        let res;
        switch (id) {
            case 1:                
                res  = await this.table1_findMany( ts, from, to);
        
        }

        return this.transform1(res);
    }

    table1_findMany(ts:string, from:string, to:string, )  {
        return prisma.table1.findMany({
            where:{
                col1: { gte: from, lt: to  },
                deletedAt: null
            },
        });
    }  
    table1_upsert(createTable1:CreateTable1[] )  {
        return prisma.$transaction(createTable1.map(value=> {
            return prisma.table1.upsert({
                where: {
                id:   value.id,
                },
                update: { 
                col1: value.col1, 
                col2: value.col2, 
                col3: value.col3, 
                col4: value.col4, 
                col5: value.col5, 
                col6: value.col6, 

                deletedAt:  null,         //при обновлени сбрасыввается признан "удалено"
                updatedAt:  new Date(),         
                },
                create: {                   // создать, если нет
                col1: value.col1, 
                col2: value.col2, 
                col3: value.col3, 
                col4: value.col4, 
                col5: value.col5, 
                col6: value.col6,

                createdAt:  new Date(),
                deletedAt:  null,         //при create сбрасыввается признак "удалено"
                updatedAt:  null,         //при create сбрасыввается признак "редактирование"
                },
        });
        }));
    }
    table1_softDelete(deleteValueDto: DeleteTableDto[]) {
        return prisma.$transaction(deleteValueDto.map(value=> {
            return prisma.table1.update({
                where: {
                    id: value.id
                },
                data: { 
                    deletedAt:  new Date(),         //soft delete - set признак "удалено"        
                }
            });
        }));
    }


    //для единообразия
    transform1(rowset: any[]): Map<string, any>  {
        const map = new Map<string, any>();
        for (let i = 0; i < rowset.length; i++) {
            const row = rowset[i];
            map.set(row.id, row);
        }

        return map;
    }
}