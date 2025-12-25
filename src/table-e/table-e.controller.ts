import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TableEService } from './table-e.service';
import { CreateTableEDto } from './dto/create-table-e.dto';
import { UpdateTableEDto } from './dto/update-table-e.dto';

@Controller('table-e')
export class TableEController {
  constructor(private readonly tableEService: TableEService) {}

  @Post()
  create(@Body() createTableEDto: CreateTableEDto) {
    return this.tableEService.create(createTableEDto);
  }

  @Get()
  findAll() {
    return this.tableEService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableEService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableEDto: UpdateTableEDto) {
    return this.tableEService.update(+id, updateTableEDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tableEService.remove(+id);
  }
}
