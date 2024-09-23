import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';
@Controller('meta-options')
export class MetaOptionsController {
  constructor(
    /**
     * Inject MetaOptionsService
     * */
    private readonly metaOptionsService: MetaOptionsService,
  ) {}

  @Post()
  public async CreateMetaOptions(
    @Body() createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    return this.metaOptionsService.CreateMetaOptions(createPostMetaOptionsDto);
  }
}
