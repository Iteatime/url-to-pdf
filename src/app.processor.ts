import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { GENERATE_PDF_NAME } from './constants';
import { AppService } from './app.service';
import { Job } from 'bull';

@Processor(GENERATE_PDF_NAME)
export class AppProcessor {
  private readonly logger = new Logger(AppProcessor.name);

  constructor(private readonly appService: AppService) {}

  @Process()
  async process(job: Job): Promise<void> {
    this.logger.verbose(`job started ${job.id}`);
    job.data.downloadUrl = await this.appService.generateComplexPdf(job.data);
  }

  @OnQueueCompleted()
  async onCompleted(job: Job): Promise<void> {
    await job.moveToCompleted(job.data.downloadUrl, true);
    this.logger.verbose(`PDF created ${job.id}`);
  }

  @OnQueueFailed()
  onFailed(job: Job): void {
    this.logger.error(`Error on PDF generating ${job.id}`, job.failedReason);
  }
}
