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
} from '@nestjs/common';
import { CourseArticleService } from './course-article.service';
import { CreateCourseArticleDTO } from './dto/create.dto';
import { isValidId } from '../../utils/functions/isValidId.function';
import { UpdateCourseArticleDTO } from './dto/update.dto';
import { Public } from '../../utils/security/Auth.decorator';

@Controller('article/course')
export class CourseArticleController {
  constructor(private readonly courseArticleService: CourseArticleService) {}

  @Post()
  async createBlogArticle(@Body() createArticleDTO: CreateCourseArticleDTO) {
    if (!isValidId(createArticleDTO.course))
      throw new HttpException('ID do autor inválido.', HttpStatus.BAD_REQUEST);
    const stored = await this.courseArticleService.findByNumber(
      createArticleDTO.course,
      createArticleDTO.number,
    );
    if (stored)
      throw new HttpException(
        'Já existe uma aula na ordem indicada.',
        HttpStatus.BAD_REQUEST,
      );
    return await this.courseArticleService.create(createArticleDTO);
  }

  @Public()
  @Get()
  async readAll() {
    return await this.courseArticleService.findAll();
  }

  @Public()
  @Get('single/slug/:slug')
  async readBySlug(@Param('slug') slug: string) {
    const article = await this.courseArticleService.findBySlug(slug);
    if (!article)
      throw new HttpException('Artigo não encontrado.', HttpStatus.NOT_FOUND);
    return article;
  }

  @Public()
  @Get('single/:id')
  async readById(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('ID inválido.', HttpStatus.BAD_REQUEST);
    const article = await this.courseArticleService.findById(id);
    if (!article)
      throw new HttpException('Artigo não encontrado.', HttpStatus.NOT_FOUND);
    return article;
  }

  @Public()
  @Get(':id/:number?')
  async readByCourse(
    @Param('id') id: string,
    @Param('number') number?: number,
  ) {
    if (!isValidId(id))
      throw new HttpException('ID inválido.', HttpStatus.BAD_REQUEST);
    if (number) {
      const article = await this.courseArticleService.findByNumber(id, number);
      if (!article)
        throw new HttpException('Artigo não encontrado.', HttpStatus.NOT_FOUND);
      return article;
    }
    return await this.courseArticleService.findByCourse(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDTO: UpdateCourseArticleDTO,
  ) {
    console.log(id);
    if (!isValidId(id))
      throw new HttpException('ID do autor inválido.', HttpStatus.BAD_REQUEST);
    const article = await this.courseArticleService.update(
      id,
      updateArticleDTO,
    );
    if (!article)
      throw new HttpException('Artigo não encontrado.', HttpStatus.NOT_FOUND);
    return article;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('ID do autor inválido.', HttpStatus.BAD_REQUEST);
    const article = await this.courseArticleService.remove(id);
    if (!article)
      throw new HttpException('Artigo não encontrado.', HttpStatus.NOT_FOUND);
    return article;
  }
}
