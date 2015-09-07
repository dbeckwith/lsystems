/**
 * Created by Daniel Beckwith on 9/6/15.
 */

///<reference path="_ref.d.ts"/>

$(():void => {
  if (gfx.init(<HTMLCanvasElement>document.getElementById('canvas'))) {
    gfx.startDraw();

    var lsystem:lsystems.LSystem = new lsystems.LSystem();
    lsystem.addRule('X', 'X+YF+');
    lsystem.addRule('Y', '-FX-Y');

    var $rules:JQuery = $('#rules');
    _.forEach(lsystem.rules, (replacement:string, symbol:string):void => {
      $rules
        .append($('<li></li>')
            .text(`${symbol} \\u2192 ${replacement}`));
    });

    var lstrings:string[] = ['FX'];
    var strIndex:number = 0;

    function drawString(str:string):void {
      $('#currString').text(str);

      var pos:gfx.V3 = new gfx.V3(0, 0, 0);
      var dir:gfx.V3 = new gfx.V3(0, 0, 0);
      var pts:gfx.V3[] = [pos];
      var turnAngle:number = Math.PI / 2;
      for (var i:number = 0; i < str.length; i++) {
        switch (str[i]) {
          // TODO: need to be able to handle 'f', means that the path is not contiguous, will have to change rendering
          case 'F':
            pts.push(pos = pos.add(new gfx.V3(Math.cos(dir.z), Math.sin(dir.z), 0)));
            break;
          case '+':
            dir.z += turnAngle;
            break;
          case '-':
            dir.z -= turnAngle;
            break;
          default:
            break;
        }
      }
      gfx.setPath(pts);
    }

    drawString(lstrings[strIndex]);

    document.addEventListener('keydown', function (event:KeyboardEvent):void {
      switch (event.keyCode) {
        case 187: // equals
          strIndex++;
          while (!lstrings[strIndex]) {
            lstrings.push(lsystem.step(lstrings[lstrings.length - 1]));
          }
          drawString(lstrings[strIndex]);
          break;
        case 189: // dash
          strIndex--;
          if (strIndex < 0) {
            strIndex = 0;
          }
          drawString(lstrings[strIndex]);
          break;
        default:
          break;
      }
    });
  }
});
