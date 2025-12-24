import { PartialType } from '@nestjs/swagger';
import { CreateValueDto } from './create-value.dto';
import { ApiProperty } from '@nestjs/swagger';



export class UpdateValueDto extends PartialType(CreateValueDto) {

}
