import * as Express from 'express';

const puppeteer = require('puppeteer');

export class Service {
  private _app: Express.Express;
  private _pdfParams: any;

  constructor() {
    this._app = Express.default();

    this._pdfParams = {};

    this._app.use((req: Express.Request, res: Express.Response) => {
      const url = req.query.url;
      this._checkRequest(url, res).then(() => {
        this._readPDFParams(req.query);
        this._generatePDF(url, res);
      }).catch((error) => {
        return error;
      });
    });
  }

  public startServer() {
    return this._app.listen(8080);
  }

  private _checkRequest(url: string, res: Express.Response) {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(
          res.status(400).send({ message: "Bad call" })
        );
      }
      resolve();
    })
  }

  private _readPDFParams(queyParams: any) {
    this._pdfParams = { 
        ...queyParams, 
        scale: queyParams.scale ? +queyParams.scale : 1,
        margin: {
          top: queyParams["margin.top"],
          left: queyParams["margin.left"],
          bottom: queyParams["margin.bottom"],
          right: queyParams["margin.right"],
        },
        landscape: queyParams.landscape === 'true'
      };
  }

  private async _generatePDF(url: string, res: Express.Response) {
    try {
      const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        });

      const page = await browser.newPage();
      await page.goto(url);

      if (!this._pdfParams.title) this._pdfParams.title = await page.title();
      
      const pdf = await page.pdf(this._pdfParams);

      browser.close();

      res.setHeader('Content-Description', 'File Transfer');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=' + this._pdfParams.title + '.pdf');
      res.send(pdf);
    } catch(err) {
      res.status(500).send({ message: err.message });
      if (process.env.NODE_ENV === 'development') console.error(err);
    }
  }
}
