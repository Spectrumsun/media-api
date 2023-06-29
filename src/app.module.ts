import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { DbModule } from './db/db.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BookMarkService } from './book-mark/book-mark.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BookmarkModule,
    DbModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [BookMarkService],
})
export class AppModule {}
