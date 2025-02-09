import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BlogArticleService } from './blog-article.service';
import { CreateBlogArticleDTO } from './dto/create.dto';
import { isValidId } from '../../utils/functions/isValidId.function';
import { UpdateBlogArticleDTO } from './dto/update.dto';
import { Public } from '../../utils/security/Auth.decorator';

@Controller('article/blog')
export class BlogArticleController {
  constructor(private readonly blogArticleService: BlogArticleService) {}

  @Post()
  async createBlogArticle(@Body() createArticleDTO: CreateBlogArticleDTO) {
    if (!isValidId(createArticleDTO.authorId))
      throw new HttpException('ID do autor inválido.', HttpStatus.BAD_REQUEST);
    return await this.blogArticleService.create(createArticleDTO);
  }

  @Public()
  @Get()
  async read(@Query('title') title?: string) {
    return await this.blogArticleService.find(title);
  }

  @Public()
  @Get('author/:id')
  async readByAuthor(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('ID inválido.', HttpStatus.BAD_REQUEST);
    return await this.blogArticleService.findByAuthor(id);
  }

  @Public()
  @Get('tag/:tag')
  async readByTagName(@Param('tag') tag: string) {
    return await this.blogArticleService.findByTagName(tag);
  }

  @Public()
  @Get('slug/:slug')
  async readBySlug(@Param('slug') slug: string) {
    const article = await this.blogArticleService.findBySlug(slug);
    if (!article)
      throw new HttpException('Artigo não encontrado.', HttpStatus.NOT_FOUND);
    return article;
  }

  @Public()
  @Get(':id')
  async readById(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('ID inválido.', HttpStatus.BAD_REQUEST);
    const article = await this.blogArticleService.findById(id);
    if (!article)
      throw new HttpException('Artigo não encontrado.', HttpStatus.NOT_FOUND);
    return article;
  }

  @Patch(':id')
  async update(
    @Param() id: string,
    @Body() updateArticleDTO: UpdateBlogArticleDTO,
  ) {
    if (!isValidId(id))
      throw new HttpException('ID do autor inválido.', HttpStatus.BAD_REQUEST);
    const article = await this.blogArticleService.update(id, updateArticleDTO);
    if (!article)
      throw new HttpException('Artigo não encontrado.', HttpStatus.NOT_FOUND);
    return article;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('ID do autor inválido.', HttpStatus.BAD_REQUEST);
    const article = await this.blogArticleService.remove(id);
    if (!article)
      throw new HttpException('Artigo não encontrado.', HttpStatus.NOT_FOUND);
    return article;
  }
}
