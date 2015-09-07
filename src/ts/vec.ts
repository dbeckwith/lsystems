/**
 * Created by Daniel Beckwith on 9/6/15.
 */

///<reference path="_ref.d.ts"/>

module gfx {

  export class V3 {

    public x:number;
    public y:number;
    public z:number;

    constructor(x:number, y:number, z:number) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    public add(other:V3):V3 {
      return new V3(
        this.x + other.x,
        this.y + other.y,
        this.z + other.z
      );
    }

    public sub(other:V3):V3 {
      return new V3(
        this.x - other.x,
        this.y - other.y,
        this.z - other.z
      );
    }

    public rotX(t:number):V3 {
      var c:number = Math.cos(t);
      var s:number = Math.sin(t);
      return new V3(
        this.x,
        this.y * c - this.z * s,
        this.y * s - this.z * c
      );
    }

    public rotY(t:number):V3 {
      var c:number = Math.cos(t);
      var s:number = Math.sin(t);
      return new V3(
        this.x * c + this.z * s,
        this.y,
        -this.x * s + this.z * c
      );
    }

    public rotZ(t:number):V3 {
      var c:number = Math.cos(t);
      var s:number = Math.sin(t);
      return new V3(
        this.x * c - this.y * s,
        this.x * s + this.y * c,
        this.z
      );
    }

    public equals(other:V3):boolean {
      return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    public toArray():number[] {
      return [this.x, this.y, this.z];
    }

    public copy():V3 {
      return new V3(this.x, this.y, this.z);
    }

  }

  export class V4 {

    public x:number;
    public y:number;
    public z:number;
    public w:number;

    constructor(x:number, y:number, z:number, w:number) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }

    public add(other:V4):V4 {
      return new V4(
        this.x + other.x,
        this.y + other.y,
        this.z + other.z,
        this.w + other.w
      );
    }

    public sub(other:V4):V4 {
      return new V4(
        this.x - other.x,
        this.y - other.y,
        this.z - other.z,
        this.w - other.w
      );
    }

    public toArray():number[] {
      return [this.x, this.y, this.z, this.w];
    }

    public copy():V4 {
      return new V4(this.x, this.y, this.z, this.w);
    }

  }

}
