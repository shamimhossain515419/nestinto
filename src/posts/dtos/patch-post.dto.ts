import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class patchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'Post id',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
