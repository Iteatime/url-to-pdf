import * as Express from "express";
import { Server } from "http";

const puppeteer = require('puppeteer');

export class Service {
  public app: Express.Express;
  public pdfParams: any;

  constructor() {
    this.app = Express.default();

    this.pdfParams = {};

    this.app.use((req: Express.Request, res: Express.Response) => {
      const url = req.query.url;
      this.checkRequest(url, res).then(() => {
        this.readPDFParams(req.query);
        this.generatePDF(url, res);
      }).catch((error) => {
        return error;
      });
    })
  }

  public startServer(): Server {
    return this.app.listen(process.env.PORT || 8080);
  }

  private checkRequest(url: string, res: Express.Response) {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(res.status(400).send({
          message: "Bad call",
        }));
      }
      resolve();
    })
  }

  private readPDFParams(queyParams: any) {
    this.pdfParams = { 
        ...queyParams, 
        scale: queyParams.scale ? +queyParams.scale : 1,
        margin: {
          top: queyParams["margin.top"],
          left: queyParams["margin.left"],
          bottom: queyParams["margin.bottom"],
          right: queyParams["margin.right"],
        },
        landscape: queyParams.landscape === 'true',
	      printBackground: true
      };
  }

  private async generatePDF(url: string, res: Express.Response) {
    try {
      const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        });

      const page = await browser.newPage();
      await page.goto(url);

      if (!this.pdfParams.title) this.pdfParams.title = await page.title();
      
      const pdf = await page.pdf(this.pdfParams);

      browser.close();

      res.setHeader('Content-Description', 'File Transfer');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=' + this.pdfParams.title + '.pdf');
      res.send(pdf);
    } catch(err) {
      res.status(500).send({
        message: err.message,
      });
      console.log(err);
    }
  }
}
