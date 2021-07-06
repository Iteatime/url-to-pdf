import { Injectable } from '@nestjs/common';
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {GENERATE_PDF_NAME} from "./constants";
import {Params, PdfParams} from "./type";

@Injectable()
export class AppService {
  constructor(@InjectQueue(GENERATE_PDF_NAME) private generatePdfQueue: Queue) {}

  private static readPDFParams(params: any):PdfParams {
    return {
      scale: +params.scale || 1,
      margin: {
        top: params.margin?.top || 0,
        left: params.margin?.left || 0,
        bottom: params.margin?.bottom || 0,
        right: params.margin?.right || 0,
      },
      width: params.width,
      height: params.height,
      landscape: params.landscape || true,
      printBackground: params.printBackground || true,
      title: params.title,
    };
  }

  async generatePdf({url, waitUntil, ...params}: Params): Promise<{fileName: string, pdf: any}> {
    const puppeteer = require('puppeteer');
    const pdfParams = AppService.readPDFParams(params);

      const browser = await puppeteer.launch({
        args: ['--no-sandbox']
      });

      const page = await browser.newPage();

      await page.goto(url, waitUntil);

      if (!pdfParams.title) pdfParams.title = await page.title();

      const pdf = await page.pdf(pdfParams);

      browser.close().then();
      return {fileName: pdfParams.title + '.pdf', pdf}
  }
}
