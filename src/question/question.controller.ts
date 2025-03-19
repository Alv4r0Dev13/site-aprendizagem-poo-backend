import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  HttpCode,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDTO } from './dto/create-question.dto';
import { UpdateQuestionDTO } from './dto/update-question.dto';
import { Accept, Public } from 'src/utils/security/Auth.decorator';
import { UserType } from 'src/utils/enum/UserType.enum';
import { isValidId } from 'src/utils/functions/isValidId.function';
import { LikeQuestionDTO } from './dto/like-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Accept(UserType.STUDENT, UserType.ADMIN)
  @Post()
  create(@Body() createQuestionDTO: CreateQuestionDTO) {
    if (!isValidId(createQuestionDTO.author))
      throw new HttpException('ID do autor inválido.', HttpStatus.BAD_REQUEST);
    return this.questionService.create(createQuestionDTO);
  }

  @Public()
  @Get()
  find(@Query('search') search?: string, @Query('limit') limit?: number) {
    return this.questionService.find(search, limit);
  }

  @Public()
  @Get('user/:id')
  findByAuthor(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('ID inválido.', HttpStatus.BAD_REQUEST);
    return this.questionService.findByAuthor(id);
  }

  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const question = await this.questionService.findBySlug(slug);
    if (!question)
      throw new HttpException('Pergunta não encontrada.', HttpStatus.NOT_FOUND);
    return question;
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('ID inválido.', HttpStatus.BAD_REQUEST);
    const question = await this.questionService.findById(id);
    if (!question)
      throw new HttpException('Pergunta não encontrada.', HttpStatus.NOT_FOUND);
    return question;
  }

  @Accept(UserType.STUDENT, UserType.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('like/:id')
  async like(
    @Param('id') id: string,
    @Body() likeQuestionDTO: LikeQuestionDTO,
  ) {
    if (!isValidId(id))
      throw new HttpException('ID inválido.', HttpStatus.BAD_REQUEST);
    if (!isValidId(likeQuestionDTO.userId))
      throw new HttpException(
        'ID do usuário inválido.',
        HttpStatus.BAD_REQUEST,
      );
    const question = await this.questionService.like(id, likeQuestionDTO);
    if (!question)
      throw new HttpException('Pergunta não encontrada.', HttpStatus.NOT_FOUND);
  }

  @Accept(UserType.STUDENT, UserType.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDTO: UpdateQuestionDTO,
  ) {
    if (!isValidId(id))
      throw new HttpException('ID inválido.', HttpStatus.BAD_REQUEST);
    const question = await this.questionService.update(id, updateQuestionDTO);
    if (!question)
      throw new HttpException('Pergunta não encontrada.', HttpStatus.NOT_FOUND);
    return question;
  }

  @Accept(UserType.STUDENT, UserType.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('ID inválido.', HttpStatus.BAD_REQUEST);
    const question = await this.questionService.remove(id);
    if (!question)
      throw new HttpException('Pergunta não encontrada.', HttpStatus.NOT_FOUND);
    return question;
  }
}
