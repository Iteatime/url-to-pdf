import {BadRequestException, Controller, Get, InternalServerErrorException, Query, Response} from '@nestjs/common';
import { AppService } from './app.service';
import {Params} from "./type";
import {Response as Res} from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getPdfFromUrl(@Query() params:Params, @Response() res: Res) {
    if (!params.url){
      throw new BadRequestException('No url query');
    }
    try {
      const {fileName, pdf} = await this.appService.generatePdf(params);
      res.setHeader('Content-Description', 'File Transfer');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
      res.send(pdf);
    }
    catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
}
