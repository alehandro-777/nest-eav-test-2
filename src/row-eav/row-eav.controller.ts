import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RowEavService } from './row-eav.service';
import { CreateRowEavDto } from './dto/create-row-eav.dto';
import { UpdateRowEavDto } from './dto/update-row-eav.dto';

@Controller('row-eav')
export class RowEavController {
  constructor(private readonly rowEavService: RowEavService) {}

  @Post()
  create(@Body() createRowEavDto: CreateRowEavDto) {
    return this.rowEavService.create(createRowEavDto);
  }

  @Get('all')
  findAll() {
    return this.rowEavService.findAll();
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.rowEavService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRowEavDto: UpdateRowEavDto) {
    return this.rowEavService.update(+id, updateRowEavDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rowEavService.remove(+id);
  }

  @Get('exec')
  exec() {
    return this.rowEavService.exec();
  }
}
