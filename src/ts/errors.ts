/**
 * Created by Daniel Beckwith on 9/6/15.
 */

///<reference path="_ref.d.ts"/>

module lsystems {

  export declare class Error {
    public name:string;
    public message:string;
    public stack:string;

    constructor(message?:string);
  }

  export class LSymbolError extends Error {
    public name:string = 'LSymbolError';

    constructor(message?:string) {
      super(message);
    }
  }

  export class LStringError extends Error {
    public name:string = 'LStringError';

    public lstring:string;
    public pos:number;

    constructor(lstring:string, pos:number, message?:string) {
      super(message);
      this.lstring = lstring;
      this.pos = pos;
    }
  }

}
