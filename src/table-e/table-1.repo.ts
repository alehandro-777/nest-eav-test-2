import { UpdateEdto } from "./dto/update-table-e.dto";
import { DeleteEdto } from "./dto/delete-table-e.dto";
import { TableERepository } from "./table-e-repo.interface";
import { Injectable,  } from '@nestjs/common';
import { prisma } from '../prisma';

@Injectable()
export class Table1Repo implements TableERepository {
    findMany(ts:string, from:string, to:string, )  {
        return prisma.table1.findMany({
            where:{
                col1: { gte: from, lt: to  },
                deletedAt: null
            },
        });
    }  
    upsert(upsertRowDto: UpdateEdto[] )  {
        return prisma.$transaction(upsertRowDto.map(value=> {
            return prisma.table1.upsert({
                where: {
                id:   value.id,
                },
                update: { 
                col1: value.col1, 
                col2: Number(value.col2), 
                col3: Number(value.col3), 
                col4: value.col4, 
                col5: value.col5, 
                col6: value.col6, 

                deletedAt:  null,         //при обновлени сбрасыввается признан "удалено"
                updatedAt:  new Date(),         
                },
                create: {                   // создать, если нет
                col1: value.col1, 
                col2: Number(value.col2), 
                col3: Number(value.col3), 
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
    softDelete(deleteRowDto: DeleteEdto[]) {
        return prisma.$transaction(deleteRowDto.map(value=> {
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
}