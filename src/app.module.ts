import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AuthConfig } from './utils/security/Auth.config';
import { AuthGuard } from './utils/security/Auth.guard';
import { UserTypeGuard } from './utils/security/UserType.guard';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    CourseModule,
  ],
  controllers: [],
  providers: [
    AuthConfig,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: UserTypeGuard },
  ],
})
export class AppModule {}
