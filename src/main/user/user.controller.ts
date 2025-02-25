import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import sendResponse from 'src/utils/sendResponse';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';
import pick from 'src/utils/pick';
import {
  ChangeProfileStatusDto,
  CreateAnUserDto,
  updateAnUserDto,
  UpdateAnUserRoleDto,
} from './user.Dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT, UserRole.SUPER_ADMIN]),
  )
  async getUser(@Req() req: Request, @Res() res: Response) {
    const result = await this.userService.getMe(req.user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User data fetched Successfully',
      data: result,
    });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async getAllUser(@Req() req: Request, @Res() res: Response) {
    const filters = pick(req.query, ['email', 'searchTerm', 'role', 'status']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await this.userService.getAllUsers(filters, options);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All Users fetched Successfully',
      data: result,
    });
  }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async createAnUser(@Body() createAnUserDto: CreateAnUserDto) {
    return this.userService.createAnUser(createAnUserDto);
  }

  @Patch('update/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async updateAnUser(
    @Body() updateAnUserDto: updateAnUserDto,
    @Param('id') id: string,
  ) {
    return this.userService.updateAnUser(id, updateAnUserDto);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async changeProfileStatus(
    @Body() changeProfileStatusDto: ChangeProfileStatusDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { id } = req.params;
    const result = await this.userService.changeProfileStatus(
      id,
      changeProfileStatusDto.status,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User status changed successfully',
      data: result,
    });
  }

  @Post('instructor/create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async createInstructor(@Body() createAnUserDto: CreateAnUserDto) {
    return this.userService.createInstructor(createAnUserDto);
  }

  @Post('admin/create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.SUPER_ADMIN]))
  async createAdmin(@Body() createAnUserDto: CreateAnUserDto) {
    return this.userService.createAdmin(createAnUserDto);
  }

  @Patch('user/role')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.SUPER_ADMIN]))
  async changeRoleBySuperAdmin(
    @Body() updateAnUserRoleDto: UpdateAnUserRoleDto){
      return this.userService.changeRoleBySuperAdmin(updateAnUserRoleDto);
    }
}
