import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URL), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
