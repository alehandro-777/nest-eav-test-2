import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColumnEService } from './column-e.service';
import { CreateColumnEDto } from './dto/create-column-e.dto';
import { UpdateColumnEDto } from './dto/update-column-e.dto';

@Controller('column-e')
export class ColumnEController {
  constructor(private readonly columnEService: ColumnEService) {}

  @Post()
  create(@Body() createColumnEDto: CreateColumnEDto) {
    return this.columnEService.create(createColumnEDto);
  }

  @Get()
  findAll() {
    return this.columnEService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.columnEService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColumnEDto: UpdateColumnEDto) {
    return this.columnEService.update(+id, updateColumnEDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnEService.remove(+id);
  }
}
