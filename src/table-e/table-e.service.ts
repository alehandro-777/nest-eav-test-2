import { Injectable } from '@nestjs/common';
import { CreateTableEDto } from './dto/create-table-e.dto';
import { UpdateTableEDto } from './dto/update-table-e.dto';
import { prisma } from '../prisma';

@Injectable()
export class TableEService {
  
  create(createTableEDto: CreateTableEDto) {
    return 'This action adds a new tableE';
  }

  findAll() {
    return prisma.tableE.findMany();
  }

  findOne(id: number) {
    return prisma.tableE.findFirst(
      { 
        where:{id:id},
        include: {
          columns: {
            include: {
                rows: true,
              },
            },
        },
      } );
  }

  update(id: number, updateTableEDto: UpdateTableEDto) {
    return `This action updates a #${id} tableE`;
  }

  remove(id: number) {
    return `This action removes a #${id} tableE`;
  }
}
