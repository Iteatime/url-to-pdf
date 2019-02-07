import * as Express from "express";

const puppeteer = require('puppeteer');

export class Server {
  public app: Express.Express;

  constructor() {
    this.app = Express.default();
    this.app.use((req: Express.Request, res: Express.Response) => {
      const url = req.query.url;
      this.checkRequest(url, req.query.api, res).then(() => {
        this.generatePDF(url, res);
      }).catch((error) => {
        return error;
      });
    })
  }

  public startServer() {
    return this.app.listen(process.env.PORT || 8080, (err: any) => {
      if (err) return console.error(err);
      else if (process.env.NODE_ENV === 'development') return console.log('server ready');

    });
  }

  private checkRequest(url: string, apiKey: string, res: Express.Response) {
    return new Promise((resolve, reject) => {
      console.log(process.env.API_KEY);
      if (!url || !apiKey) {
        reject(res.status(400).send({
          success: false,
          message: "Bad call",
        }));
      } else if (!!process.env.API_KEY && apiKey != process.env.API_KEY) {
        reject(res.status(401).send({
          success: false,
          message: "Bad API key",
        }));
      }
      resolve();
    })
  }

  private async generatePDF(url: string, res: Express.Response) {
    try {
      const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        });

      const page = await browser.newPage();
      await page.goto(url);
  
      const pdf = await page.pdf({ 
          format: 'A4',
          scale: 2,
          margin: { top: '15px', left: '10px', bottom: '10px', right: '10px' }
        });

      browser.close();
    
      res.set('Content-Type', 'application/pdf');
      res.send(pdf);
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Puppeteer error",
      });
      console.log(err);
    }
  }
}