import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Body,
  Delete,
  Post,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard/authGuard';
import { BookmarkService } from './bookmark.service';
import { EditBookmarkDto } from '../dto/edit-bookmark.dto';
import { CreateBookmarkDto } from '../dto/create-bookmark.dto';

@UseGuards(AuthGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@Request() req) {
    return this.bookmarkService.getBookmarks(req.user.sub);
  }

  @Get(':id')
  getBookmarkById(
    @Request() req: any,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(req.user.sub, bookmarkId);
  }

  @Post()
  createBook(@Request() req, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBook(req.user.sub, dto);
  }

  @Patch('id')
  editBookmark(
    @Request() req,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmark(req.user.sub, bookmarkId, dto);
  }

  @Delete(':id')
  deleteBookmark(
    @Request() req,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmark(req.user.sub, bookmarkId);
  }
}
