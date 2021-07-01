import * as Express from "express";

const puppeteer = require('puppeteer');

export class Server {
  public app: Express.Express;
  public pdfParams: any;

  constructor() {
    this.app = Express.default();

    this.pdfParams = {};

    this.app.use((req: Express.Request, res: Express.Response) => {
      const url = req.query.url;
      const async = req.query.async;
      this.checkRequest(url, req.query.api, res).then(() => {
        this.readPDFParams(req.query);
        this.generatePDF(url, async, res);
      }).catch((error) => {
        return error;
      });
    })
  }

  public startServer() {
    return this.app.listen(process.env.PORT || 8080, (err: any) => {
      if (err) return console.error(err);
      else if (process.env.NODE_ENV === 'development') return console.log("\x1b[35m\x1b[47m", "server ready", "\x1b[0m");
    });
  }

  private checkRequest(url: string, apiKey: string, res: Express.Response) {
    return new Promise<void>((resolve, reject) => {
      if (!url || (!!process.env.API_KEY && !apiKey)) {
        reject(res.status(400).send({
          message: "Bad call",
        }));
      } else if (!!process.env.API_KEY && apiKey != process.env.API_KEY) {
        reject(res.status(401).send({
          message: "Bad API key",
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

  private async generatePDF(url: string, async: boolean, res: Express.Response) {
    try {
      const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        });

      const page = await browser.newPage();

      const params = async ? { waitUntil: 'networkidle0' } : {};

      await page.goto(url, params);

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
