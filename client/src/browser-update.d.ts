declare module "browser-update" {
  type BrowserUpdateOptions = {
    required?: {
      [k: string]: number;
    };
    text_for_i?: {
      msg: string;
      msgmore: string;
    };
  };
  export default function browserUpdate(options: BrowserUpdateOptions): void;
}
