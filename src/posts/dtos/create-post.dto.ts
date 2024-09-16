import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { postStatusType } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: ' This is the title of the blog  post',
    example: 'Hello World',
    required: true,
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: "Possible values , 'post' ,'page', 'story' ,'series' ",
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: "For example 'mu-url'",
    example: 'hello-world',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "A Slug should be small letters and use only  '-'  and with spaces ,",
  })
  slug: string;

  @ApiProperty({
    enum: postStatusType,
    description:
      "Possible values , 'draft' ,'scheduled', 'review' ,'published' ",
  })
  @IsEnum(postStatusType)
  @IsNotEmpty()
  status: postStatusType;

  @ApiPropertyOptional({
    description: 'This is the content of the blog post',
    example: 'This is the content of the blog post',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description:
      'serialized  your json object else a validation error will be throw',
    example: '{"key":"value"}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'featured image for the blog post',
    example: 'https://example.com/featured-image.jpg',
  })
  @IsOptional()
  @IsString()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'The date on  which the blog published',
    example: 'https://example.com/featured-image.jpg',
  })
  @IsOptional()
  @IsISO8601()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of tags passed as sting values',
    example: ['nestjs', 'featured'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions: CreatePostMetaOptionsDto[];
}
