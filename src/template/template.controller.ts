import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import type { Response } from 'express';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templateService.create(createTemplateDto);
  }

  @Get('all')
  findAll() {
    return this.templateService.findAll();
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templateService.update(+id, updateTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateService.remove(+id);
  }

  @Get('exec')
  test( @Query('ids') ids: string, 
        @Query('ts') ts: string, 
        @Query('from') from:string, 
        @Query('to') to:string, @Query('o') o:string,@Query('p') p:string, ) {
    return this.templateService.exec(ids, ts, from, to, o, p, );
  }

  @Get('download/:id')
  download( @Param('id') id: string, @Res() res: Response ) {

    let f = this.templateService.download(+id);
    
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
