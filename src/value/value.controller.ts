import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ValueService } from './value.service';
import { CreateValueDto } from './dto/create-value.dto';
import { UpdateValueDto } from './dto/update-value.dto';
import type { Request } from 'express';
import { DeleteValueDto } from './dto/delete-value.dto';

@Controller('value')
export class ValueController {
  constructor(private readonly valueService: ValueService) {}

  @Post()
  create(@Body() createValueDto: CreateValueDto) {
    return this.valueService.create(createValueDto);
  }

  @Get("all")
  findAll() {
    return this.valueService.findAll();
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.valueService.findOne(+id);
  }

  @Patch()
  update(@Body() createValueDto: CreateValueDto[]) {
    return this.valueService.update(createValueDto);
  }

  @Patch('delete')
  softdelete(@Body() deleteValueDto: DeleteValueDto[]) {
    return this.valueService.softPacketDelete(deleteValueDto);  //soft delete
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.valueService.remove(+id);
  }
}
