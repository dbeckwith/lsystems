/**
 * Created by Daniel Beckwith on 9/6/15.
 */

///<reference path="_ref.d.ts"/>

module gfx {

  export class M4 {

    static zero():M4 {
      return new M4(
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
      );
    }

    static iden():M4 {
      return new M4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
    }

    static translation(d:V3|V4):M4 {
      return new M4(
        1, 0, 0, d.x,
        0, 1, 0, d.y,
        0, 0, 1, d.z,
        0, 0, 0, 1
      );
    }

    static rotationX(t:number):M4 {
      var c:number = Math.cos(t);
      var s:number = Math.sin(t);
      return new M4(
        1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1
      );
    }

    static rotationY(t:number):M4 {
      var c:number = Math.cos(t);
      var s:number = Math.sin(t);
      return new M4(
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1
      );
    }

    static rotationZ(t:number):M4 {
      var c:number = Math.cos(t);
      var s:number = Math.sin(t);
      return new M4(
        c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
    }

    static rotation(tx:number, ty:number, tz:number):M4 {
      var cx:number = Math.cos(tx);
      var sx:number = Math.sin(tx);
      var cy:number = Math.cos(ty);
      var sy:number = Math.sin(ty);
      var cz:number = Math.cos(tz);
      var sz:number = Math.sin(tz);
      return new M4(
        cy * cz, cz * sx * sy - cx * sz, cx * cz * sy + sx * sz, 0,
        cy * sz, cx * cz + sx * sy * sz, -cz * sx + cx * sy * sz, 0,
        -sy, cy * sx, cx * cy, 0,
        0, 0, 0, 1
      );
    }

    static scaleX(s:number):M4 {
      return new M4(
        s, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
    }

    static scaleY(s:number):M4 {
      return new M4(
        1, 0, 0, 0,
        0, s, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
    }

    static scaleZ(s:number):M4 {
      return new M4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, s, 0,
        0, 0, 0, 1
      );
    }

    static scale(sx:number, sy?:number, sz?:number):M4 {
      if (sy === void 0) {
        sy = sx;
      }
      if (sz === void 0) {
        sz = sx;
      }
      return new M4(
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1
      );
    }

    public m11:number;
    public m12:number;
    public m13:number;
    public m14:number;

    public m21:number;
    public m22:number;
    public m23:number;
    public m24:number;

    public m31:number;
    public m32:number;
    public m33:number;
    public m34:number;

    public m41:number;
    public m42:number;
    public m43:number;
    public m44:number;

    constructor(m11:number, m12:number, m13:number, m14:number,
                m21:number, m22:number, m23:number, m24:number,
                m31:number, m32:number, m33:number, m34:number,
                m41:number, m42:number, m43:number, m44:number) {
      this.m11 = m11;
      this.m12 = m12;
      this.m13 = m13;
      this.m14 = m14;

      this.m21 = m21;
      this.m22 = m22;
      this.m23 = m23;
      this.m24 = m24;

      this.m31 = m31;
      this.m32 = m32;
      this.m33 = m33;
      this.m34 = m34;

      this.m41 = m41;
      this.m42 = m42;
      this.m43 = m43;
      this.m44 = m44;
    }

    public add(other:M4):M4 {
      return new M4(
        this.m11 + other.m11,
        this.m12 + other.m12,
        this.m13 + other.m13,
        this.m14 + other.m14,

        this.m21 + other.m21,
        this.m22 + other.m22,
        this.m23 + other.m23,
        this.m24 + other.m24,

        this.m31 + other.m31,
        this.m32 + other.m32,
        this.m33 + other.m33,
        this.m34 + other.m34,

        this.m41 + other.m41,
        this.m42 + other.m42,
        this.m43 + other.m43,
        this.m44 + other.m44
      );
    }

    public sub(other:M4):M4 {
      return new M4(
        this.m11 - other.m11,
        this.m12 - other.m12,
        this.m13 - other.m13,
        this.m14 - other.m14,

        this.m21 - other.m21,
        this.m22 - other.m22,
        this.m23 - other.m23,
        this.m24 - other.m24,

        this.m31 - other.m31,
        this.m32 - other.m32,
        this.m33 - other.m33,
        this.m34 - other.m34,

        this.m41 - other.m41,
        this.m42 - other.m42,
        this.m43 - other.m43,
        this.m44 - other.m44
      );
    }

    public mul(other:M4):M4 {
      return new M4(
        this.m11 * other.m11 + this.m12 * other.m21 + this.m13 * other.m31 + this.m14 * other.m41,
        this.m11 * other.m12 + this.m12 * other.m22 + this.m13 * other.m32 + this.m14 * other.m42,
        this.m11 * other.m13 + this.m12 * other.m23 + this.m13 * other.m33 + this.m14 * other.m43,
        this.m11 * other.m14 + this.m12 * other.m24 + this.m13 * other.m34 + this.m14 * other.m44,

        this.m21 * other.m11 + this.m22 * other.m21 + this.m23 * other.m31 + this.m24 * other.m41,
        this.m21 * other.m12 + this.m22 * other.m22 + this.m23 * other.m32 + this.m24 * other.m42,
        this.m21 * other.m13 + this.m22 * other.m23 + this.m23 * other.m33 + this.m24 * other.m43,
        this.m21 * other.m14 + this.m22 * other.m24 + this.m23 * other.m34 + this.m24 * other.m44,

        this.m31 * other.m11 + this.m32 * other.m21 + this.m33 * other.m31 + this.m34 * other.m41,
        this.m31 * other.m12 + this.m32 * other.m22 + this.m33 * other.m32 + this.m34 * other.m42,
        this.m31 * other.m13 + this.m32 * other.m23 + this.m33 * other.m33 + this.m34 * other.m43,
        this.m31 * other.m14 + this.m32 * other.m24 + this.m33 * other.m34 + this.m34 * other.m44,

        this.m41 * other.m11 + this.m42 * other.m21 + this.m43 * other.m31 + this.m44 * other.m41,
        this.m41 * other.m12 + this.m42 * other.m22 + this.m43 * other.m32 + this.m44 * other.m42,
        this.m41 * other.m13 + this.m42 * other.m23 + this.m43 * other.m33 + this.m44 * other.m43,
        this.m41 * other.m14 + this.m42 * other.m24 + this.m43 * other.m34 + this.m44 * other.m44
      );
    }

    public mulv(other:V4):V4 {
      return new V4(
        this.m11 * other.x + this.m12 * other.y + this.m13 * other.z + this.m14 * other.w,
        this.m21 * other.x + this.m22 * other.y + this.m23 * other.z + this.m24 * other.w,
        this.m31 * other.x + this.m32 * other.y + this.m33 * other.z + this.m34 * other.w,
        this.m41 * other.x + this.m42 * other.y + this.m43 * other.z + this.m44 * other.w
      );
    }

    public transpose():M4 {
      return new M4(
        this.m11, this.m21, this.m31, this.m41,
        this.m12, this.m22, this.m32, this.m42,
        this.m13, this.m23, this.m33, this.m43,
        this.m14, this.m24, this.m34, this.m44
      );
    }

    public toArray():number[] {
      return [
        this.m11, this.m21, this.m31, this.m41,
        this.m12, this.m22, this.m32, this.m42,
        this.m13, this.m23, this.m33, this.m43,
        this.m14, this.m24, this.m34, this.m44
      ];
    }

  }

}
