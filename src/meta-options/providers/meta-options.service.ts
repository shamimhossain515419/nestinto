import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../meta-options.entity';
import { Repository } from 'typeorm';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    /**
     * Injecting metaOptions repository
     */
    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async CreateMetaOptions(
    createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    let metaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );
    metaOption = await this.metaOptionsRepository.save(metaOption);
    return metaOption;
  }
}
