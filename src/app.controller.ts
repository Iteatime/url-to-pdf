import {
  BadRequestException,
  Controller,
  Get, NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import {Params} from "./type";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getPdfFromUrl(@Query() params:Params) {
    if (!params.url){
      throw new BadRequestException('No url query');
    }
    return this.appService.createJob(params);
  }

  @Get(':id')
  async getJob(@Param('id') id: string) {
    const job = await this.appService.getJob(id);

    if (!job) throw new NotFoundException(`Job ${id} not found`)

    return {
      isCompleted: await job.isCompleted(),
      isActive: await job.isActive(),
      isFailed: await job.isFailed(),
      returnValue: job.returnvalue,
      failedReason: job.failedReason
    };
  }
}
