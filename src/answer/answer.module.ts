import { forwardRef, Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from './answer.schema';
import { QuestionModule } from 'src/question/question.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Answer.name,
        schema: AnswerSchema,
      },
    ]),
    forwardRef(() => QuestionModule),
    forwardRef(() => CommentModule),
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
