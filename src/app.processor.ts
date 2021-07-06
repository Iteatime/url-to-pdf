import { OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import {GENERATE_PDF_NAME} from "./constants";
import {AppService} from "./app.service";
import {PdfParams} from "./type";


@Processor(GENERATE_PDF_NAME)
export class ImportProcessor {
    private readonly logger = new Logger(ImportProcessor.name);

    constructor(private readonly appService: AppService) {}

    @Process()
    async process(): Promise<void> {
    }

    @OnQueueCompleted()
    async onCompleted(): Promise<void> {
        this.logger.verbose(`PDF created`);
    }

    @OnQueueFailed()
    onFailed(): void {
        this.logger.error(`Error on PDF generating`);
    }
}
