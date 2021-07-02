"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const Express = __importStar(require("express"));
const puppeteer = require('puppeteer');
class Server {
    constructor() {
        this.app = Express.default();
        this.pdfParams = {};
        this.app.use((req, res) => {
            const url = req.query.url;
            const async = !!req.query.async;
            this.checkRequest(url, req.query.api, res).then(() => {
                this.readPDFParams(req.query);
                this.generatePDF(url, async, res);
            }).catch((error) => {
                return error;
            });
        });
    }
    startServer() {
        return this.app.listen(process.env.PORT || 8080, () => {
            console.log("\x1b[35m\x1b[47m", "server ready", "\x1b[0m");
        });
    }
    checkRequest(url, apiKey, res) {
        return new Promise((resolve, reject) => {
            if (!url || (!!process.env.API_KEY && !apiKey)) {
                reject(res.status(400).send({
                    message: "Bad call",
                }));
            }
            else if (!!process.env.API_KEY && apiKey != process.env.API_KEY) {
                reject(res.status(401).send({
                    message: "Bad API key",
                }));
            }
            resolve();
        });
    }
    readPDFParams(queyParams) {
        this.pdfParams = Object.assign(Object.assign({}, queyParams), { scale: queyParams.scale ? +queyParams.scale : 1, margin: {
                top: queyParams["margin.top"],
                left: queyParams["margin.left"],
                bottom: queyParams["margin.bottom"],
                right: queyParams["margin.right"],
            }, landscape: queyParams.landscape === 'true', printBackground: true });
    }
    async generatePDF(url, async, res) {
        try {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox']
            });
            const page = await browser.newPage();
            const params = async ? { waitUntil: 'networkidle0' } : {};
            await page.goto(url, params);
            if (!this.pdfParams.title)
                this.pdfParams.title = await page.title();
            const pdf = await page.pdf(this.pdfParams);
            browser.close();
            res.setHeader('Content-Description', 'File Transfer');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=' + this.pdfParams.title + '.pdf');
            res.send(pdf);
        }
        catch (err) {
            res.status(500).send({
                message: err.message,
            });
            console.log(err);
        }
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map