import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EditBookmarkDto } from '../dto/edit-bookmark.dto';
import { CreateBookmarkDto } from '../dto/create-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
    return bookmarks;
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
    return bookmark;
  }

  async createBook(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    });
    return bookmark;
  }

  async editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    const findBookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!findBookmark || findBookmark.userId !== userId)
      throw new ForbiddenException(
        'You do not have the permission to this resource',
      );
    const bookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
    return bookmark;
  }

  async deleteBookmark(userId: number, bookmarkId) {
    const findBookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!findBookmark || findBookmark.userId !== userId)
      throw new ForbiddenException(
        'You do not have the permission to this resource',
      );
    const bookmark = await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return bookmark;
  }
}
