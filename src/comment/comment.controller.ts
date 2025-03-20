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
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { isValidId } from 'src/utils/functions/isValidId.function';
import { Public } from 'src/utils/security/Auth.decorator';
import { QuestionService } from 'src/question/question.service';
import { AnswerService } from 'src/answer/answer.service';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  @Post()
  async create(@Body() createCommentDTO: CreateCommentDTO) {
    const comment = await this.commentService.create(createCommentDTO);
    if (comment) {
      if (comment.at?.answer) {
        this.answerService.update(comment.at.answer.toString(), {
          $inc: { comments: 1 },
        } as any);
      } else {
        this.questionService.update(comment.at.question.toString(), {
          $inc: { comments: 1 },
        } as any);
      }
    }
    return comment;
  }

  @Public()
  @Get()
  find(@Query('limit') limit?: number) {
    return this.commentService.find(limit);
  }

  @Public()
  @Get('question/:id')
  findByContainer(@Param('id') id: string, @Query('answer') answer?: string) {
    if (!isValidId(id))
      throw new HttpException(
        'Id da pergunta inválido',
        HttpStatus.BAD_REQUEST,
      );
    if (answer && !isValidId(answer))
      throw new HttpException(
        'Id da resposta inválido',
        HttpStatus.BAD_REQUEST,
      );
    return this.commentService.findByContainer(id);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    const comment = await this.commentService.findById(id);
    if (!comment)
      throw new HttpException(
        'Comentário não encontrado',
        HttpStatus.NOT_FOUND,
      );
    return comment;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDTO: UpdateCommentDTO,
  ) {
    if (!isValidId(id))
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    const comment = await this.commentService.update(id, updateCommentDTO);
    if (!comment)
      throw new HttpException(
        'Comentário não encontrado',
        HttpStatus.NOT_FOUND,
      );
    return comment;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    const comment = await this.commentService.remove(id);
    if (!comment)
      throw new HttpException(
        'Comentário não encontrado',
        HttpStatus.NOT_FOUND,
      );
    if (comment.at?.answer) {
      this.answerService.update(comment.at.answer.toString(), {
        $inc: { comments: -1 },
      } as any);
    } else {
      this.questionService.update(comment.at.question.toString(), {
        $inc: { comments: -1 },
      } as any);
    }
    return comment;
  }
}
