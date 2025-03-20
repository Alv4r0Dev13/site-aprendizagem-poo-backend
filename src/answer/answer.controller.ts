import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDTO } from './dto/create-answer.dto';
import { UpdateAnswerDTO } from './dto/update-answer.dto';
import { Accept, Public } from 'src/utils/security/Auth.decorator';
import { UserType } from 'src/utils/enum/UserType.enum';
import { isValidId } from 'src/utils/functions/isValidId.function';
import { VoteAnswerDTO } from './dto/vote-answer.dto';
import { QuestionService } from 'src/question/question.service';
import { CommentService } from 'src/comment/comment.service';

@Controller('answer')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionSerivce: QuestionService,
    private readonly commentService: CommentService,
  ) {}

  @Accept(UserType.ADMIN, UserType.STUDENT)
  @Post()
  async create(@Body() createAnswerDTO: CreateAnswerDTO) {
    if (!isValidId(createAnswerDTO.author))
      throw new HttpException('Id do autor inválido.', HttpStatus.BAD_REQUEST);
    if (!isValidId(createAnswerDTO.question))
      throw new HttpException(
        'Id da pergunta inválido.',
        HttpStatus.BAD_REQUEST,
      );
    const answer = await this.answerService.create(createAnswerDTO);
    if (answer?.question) {
      await this.questionSerivce.update(answer.question.toString(), {
        $inc: { answers: 1 },
      } as any);
    }
    return answer;
  }

  @Public()
  @Get()
  find(@Query('limit') limit?: number) {
    return this.answerService.find(limit);
  }

  @Public()
  @Get('question/:id')
  findByQuestion(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException(
        'Id da pergunta inválido.',
        HttpStatus.BAD_REQUEST,
      );
    return this.answerService.findByQuestion(id);
  }

  @Public()
  @Get('user/:id')
  findByAuthor(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('Id do autor inválido.', HttpStatus.BAD_REQUEST);
    return this.answerService.findByAuthor(id);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('Id inválido.', HttpStatus.BAD_REQUEST);
    const answer = await this.answerService.findById(id);
    if (!answer)
      throw new HttpException('Resposta não encontrada.', HttpStatus.NOT_FOUND);
    return answer;
  }

  @Accept(UserType.ADMIN, UserType.STUDENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('vote/:id')
  async vote(@Param('id') id: string, @Body() voteAnswerDTO: VoteAnswerDTO) {
    if (!isValidId(id))
      throw new HttpException('Id inválido.', HttpStatus.BAD_REQUEST);
    if (!isValidId(voteAnswerDTO.userId))
      throw new HttpException(
        'Id do usuário inválido.',
        HttpStatus.BAD_REQUEST,
      );
    const action = voteAnswerDTO.undo ? 'unvote' : 'vote';
    const answer = await this.answerService[action](
      id,
      voteAnswerDTO.userId,
      voteAnswerDTO.downvote,
    );
    if (answer === false)
      throw new HttpException(
        'Não é possível votar duas vezes no mesmo post',
        HttpStatus.FORBIDDEN,
      );
    if (!answer)
      throw new HttpException('Resposta não encontrada.', HttpStatus.NOT_FOUND);
  }

  @Accept(UserType.ADMIN, UserType.STUDENT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnswerDTO: UpdateAnswerDTO,
  ) {
    if (!isValidId(id))
      throw new HttpException('Id inválido.', HttpStatus.BAD_REQUEST);
    const answer = await this.answerService.update(id, updateAnswerDTO);
    if (!answer)
      throw new HttpException('Resposta não encontrada.', HttpStatus.NOT_FOUND);
    return answer;
  }

  @Accept(UserType.ADMIN, UserType.STUDENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!isValidId(id))
      throw new HttpException('Id inválido.', HttpStatus.BAD_REQUEST);
    const answer = await this.answerService.remove(id);
    if (!answer)
      throw new HttpException('Resposta não encontrada.', HttpStatus.NOT_FOUND);
    await this.commentService.removeByContainer(
      answer.question.toString(),
      answer.id.toString(),
    );
    await this.questionSerivce.update(answer.question.toString(), {
      $inc: { answers: -1 },
    } as any);
    return answer;
  }
}
