import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { QueryService } from './query.service';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';


@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Post()
  create(@Body() createQueryDto: CreateQueryDto) {
    return this.queryService.create(createQueryDto);
  }

  @Get("all")
  findAll() {
    return this.queryService.findAll();
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.queryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQueryDto: UpdateQueryDto) {
    return this.queryService.update(+id, updateQueryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queryService.remove(+id);
  }

  @Get('exec/:id')
  exec( @Param('id') id: string, 
        @Query('ts') ts: string, 
        @Query('from') from:string, 
        @Query('to') to:string,  ) {

    return this.queryService.exec(id, ts, from, to, );
  }



}
