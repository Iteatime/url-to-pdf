/// <reference types="node" />
import * as Express from "express";
export declare class Server {
    app: Express.Express;
    pdfParams: any;
    constructor();
    startServer(): import("http").Server;
    private checkRequest;
    private readPDFParams;
    private generatePDF;
}
