import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { TableEService } from './table-e.service';
import { CreateTableEDto } from './dto/create-table-e.dto';

import type { Response } from 'express';
import { UpdateTableEDto } from './dto/update-table-e.dto';

@Controller('table-e')
export class TableEController {
  constructor(private readonly tableEService: TableEService) {}

  @Post()
  create(@Body() createTableEDto: CreateTableEDto) {
    return this.tableEService.create(createTableEDto);
  }

  @Get('all')
  findAll() {
    return this.tableEService.findAll();
  }

  @Get('one/:id')
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
  
  @Get('query/:id')
  async query(@Param('id') id: string, @Query('ts') ts: string, @Query('from') from:string, @Query('to') to:string, ) {
    return Object.fromEntries(await this.tableEService.query(+id, ts, from, to,));
  }

  @Get('exec/:id')
  exec(@Param('id') id: string,
          @Query('ts') ts: string, 
          @Query('from') from:string, 
          @Query('to') to:string, ) {
    return this.tableEService.exec(+id, ts, from, to,);
  }

  @Get('download/:id')
  async download( @Param('id') id: string, @Res() res: Response ) {

    let f = await this.tableEService.download(+id);
    
    if (!f) return res.status(404).end();

    res.setHeader("Content-Type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Length", f.stat.size); // обязательно ?
    res.setHeader("Content-Disposition", `attachment; filename='${f.name}'`);

    f.readStream.pipe(res);

    f.readStream.on('error', (err) => {
      console.error(err);
      res.status(500).end();
    });

  }
  
  
}
