import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard/authGuard';
import { UserService } from './user.service';
import { EditUserDto } from '../dto/edit-user.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@Request() req) {
    return this.userService.getMe(req.user);
  }

  @Patch()
  editUser(@Request() req, @Body() editEto: EditUserDto) {
    return this.userService.editUser(req.user.sub, editEto);
  }
}
