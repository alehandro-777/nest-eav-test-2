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
    return `This action returns all columnE`;
  }

  findOne(id: number) {
    return `This action returns a #${id} columnE`;
  }

  update(id: number, updateColumnEDto: UpdateColumnEDto) {
    return `This action updates a #${id} columnE`;
  }

  remove(id: number) {
    return `This action removes a #${id} columnE`;
  }
}
