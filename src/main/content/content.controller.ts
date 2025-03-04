// content.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto } from './create-content.dto';
import { IdDto } from 'src/common/id.dto';
import sendResponse from 'src/utils/sendResponse';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('create-content')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR]))
  async create(@Body() createContentDto: CreateContentDto, @Res() res: Response) {
    const result = await this.contentService.createContent(createContentDto);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Content created successfully',
      data: result,
    });
  }

  @Get('moduleId/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async findAll(@Param() id: IdDto, @Res() res: Response) {
    const result = await this.contentService.findAll(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content retrieved successfully',
      data: result,
    });
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async findOne(@Param() id: IdDto, @Res() res: Response) {
    const result = await this.contentService.findOne(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content retrieved successfully',
      data: result,
    });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  @ApiOperation({ summary: 'Update content by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
    @Res() res: Response
  ) {
    const result = await this.contentService.updateContent(id, updateContentDto);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content updated successfully',
      data: result,
    });
  }

  @Delete('delete-content/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR]))
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.contentService.remove(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content and associated data deleted successfully',
      data: result,
    });
  }
}
