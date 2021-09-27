import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { Params } from './type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getSimplePdfFromUrl(@Res() response: Response, @Req() request: Request) {
    if (!request.query.url) {
      throw new BadRequestException('No url query');
    }

    const document = await this.appService.generateSimplePdf(request.query as unknown as Params);

    response.setHeader('Content-Description', 'File Transfer');
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename=${request.query.title || 'document'}.pdf`);
    response.send(document);
  }

  @Post()
  async getComplexPdfFromUrl(@Query() params: Params, @Body() body: any) {
    if (!params.url) {
      throw new BadRequestException('No url query');
    }

    return this.appService.createJob({ ...params, body });
  }

  @Get(':id')
  async getJob(@Param('id') id: string) {
    const job = await this.appService.getJob(id);

    if (!job) throw new NotFoundException(`Job ${id} not found`);

    return {
      isCompleted: await job.isCompleted(),
      isActive: await job.isActive(),
      isFailed: await job.isFailed(),
      returnValue: job.returnvalue,
      failedReason: job.failedReason,
    };
  }
}
