export type PdfParams = {
  scale?: number;
  margin?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  };
  width?: string;
  height?: string;
  landscape?: boolean;
  printBackground?: boolean;
  title?: string;
};

export type Params = {
  waitUntil?: string;
  delay?: number;
  url: string;
  body: any;
} & PdfParams;
