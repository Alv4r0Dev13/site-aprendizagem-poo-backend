import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './article.schema';
import {
  CourseArticle,
  CourseArticleSchema,
} from './course-article/course-article.schema';
import { CourseArticleController } from './course-article/course-article.controller';
import { CourseArticleService } from './course-article/course-article.service';
import {
  BlogArticle,
  BlogArticleSchema,
} from './blog-article/blog-article.schema';
import { BlogArticleController } from './blog-article/blog-article.controller';
import { BlogArticleService } from './blog-article/blog-article.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Article.name,
        schema: ArticleSchema,
        discriminators: [
          { name: CourseArticle.name, schema: CourseArticleSchema },
          { name: BlogArticle.name, schema: BlogArticleSchema },
        ],
      },
    ]),
  ],
  controllers: [BlogArticleController, CourseArticleController],
  providers: [BlogArticleService, CourseArticleService],
})
export class ArticleModule {}
