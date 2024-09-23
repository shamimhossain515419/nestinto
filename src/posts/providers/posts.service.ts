import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { UsersService } from 'src/users/providers/users.service';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,

    /**
     * Injecting postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**
     * Inject metaOptionsRepository
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,

    // * Injecting Tags service
    // */
    private readonly tagsService: TagsService,
  ) {}
  public async create(createPostDto: CreatePostDto) {
    //  find author  user
    const author = await this.usersService.findOneById(createPostDto.authorId);
    //  find tags

    const tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    // Create the post
    const post = this.postsRepository.create({
      ...createPostDto,
      author,
      tags,
    });
    return await this.postsRepository.save(post);
  }

  public async findAll() {
    try {
      const allPosts = await this.postsRepository.find({
        relations: {
          metaOptions: true,
          // author: true,
          tags: true,
        },
      });
      return allPosts;
    } catch (error) {
      throw new Error(
        'Unable to retrieve posts at the moment. Please try again later.',
      );
    }
  }

  public async delete(id: number) {
    try {
      await this.postsRepository.delete(id);
      return { success: true, message: 'Post deleted successfully.' };
    } catch (error) {
      throw new Error(
        'Unable to delete post at the moment. Please try again later.',
      );
    }
  }

  //  find by  id

  public async update(patchPostDto: PatchPostDto) {
    // Find new tags
    const tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
  
    // Find the post
    const post = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });
  
    // Check if the post exists
    if (!post) {
      throw new Error(`Post with ID ${patchPostDto.id} not found`);
    }
  
    console.log(patchPostDto);
  
    // Update post fields
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
  
    // Update the tags
    post.tags = tags;
  
    // Save the updated post
    return await this.postsRepository.save(post);
  }
  
}
