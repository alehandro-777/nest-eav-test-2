import { Injectable } from '@nestjs/common';
import { CreateColumnEDto } from './dto/create-column-e.dto';
import { UpdateColumnEDto } from './dto/update-column-e.dto';
import { prisma } from '../prisma';

@Injectable()
export class ColumnEService {
  
  create(createColumnEDto: CreateColumnEDto) {
    return 'This action adds a new columnE';
  }

  findAll() {
    return prisma.columnE.findMany({ include:{ kVSet:{include:{values:true}}, range:true }});
  }

  findOne(id: number) {
    return prisma.columnE.findFirst({ where:{id:id}, include:{ kVSet:{include:{values:true}}, range:true }});
  }

  update(id: number, updateColumnEDto: UpdateColumnEDto) {
    return `This action updates a #${id} columnE`;
  }

  remove(id: number) {
    return `This action removes a #${id} columnE`;
  }
}
