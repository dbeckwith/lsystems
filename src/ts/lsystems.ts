/**
 * Created by Daniel Beckwith on 9/6/15.
 */

///<reference path="_ref.d.ts"/>

$(():void => {
  if (gfx.init(<HTMLCanvasElement>document.getElementById('canvas'))) {
    var $editRulesModal:JQuery = $('#editRulesModal');
    var $rulesEditList:JQuery = $('#rulesEditList').children('tbody');
    var $startString:JQuery = $('#startString');
    var $applyRulesButton:JQuery = $('#applyRulesButton');
    var $rules:JQuery = $('#rulesList');

    var lsystem:lsystems.LSystem = new lsystems.LSystem();
    lsystem.addRule('F', 'F+f-FF+F+FF+Ff+FF-f+FF-F-FF-Ff-FFF');
    lsystem.addRule('f', 'ffffff');

    var lstrings:string[] = ['F+F+F+F'];
    var strIndex:number = 0;

    function writeRulesTable():void {
      $rules.html('');
      _.forEach(lsystem.rules, (replacement:string, symbol:string):void => {
        $rules
          .append($('<li></li>')
            .text(`${symbol} \\u2192 ${replacement}`));
      });
    }

    writeRulesTable();

    { // setup rule edit dialog
      $editRulesModal.modal({
        show: false,
        backdrop: true
      });

      function checkFormErrors():void {
        var errors:boolean = $startString.val().length === 0;
        $startString.toggleClass('error', errors);
        $rulesEditList.children().find('.symbol-input').each(function ():void {
          var error:boolean = $(this).val().length === 0;
          if (!error) {
            $rulesEditList.children().find('.symbol-input').each((i:number, e:Element):boolean => {
              if (this !== e && $(this).val() === $(e).val()) {
                error = true;
              }
              return !error;
            });
          }
          $(this).toggleClass('error', error);
          if (error) {
            errors = true;
          }
        });
        $applyRulesButton.toggleClass('disabled', errors);
      }

      $startString.change(function ():void {
        checkFormErrors();
      });

      $('#editRulesButton').click(():void => {
        $startString.val(lstrings[0]);
        $startString.removeClass('error');

        $rulesEditList.html('');
        _.forEach(lsystem.rules, (replacement:string, symbol:string):void => {
          $rulesEditList
            .append($('<tr></tr>')
              .append($('<td></td>')
                .append($('<input>')
                  .attr({
                    class: 'form-control symbol-input',
                    type: 'text'
                  })
                  .val(symbol)
                  .keypress(function (event:KeyboardEvent):boolean {
                    switch (event.which) {
                      case 32: // space
                      case 13: // enter
                        break;
                      default:
                        $(this).val(String.fromCharCode(event.which));
                        $(this).trigger('change');
                        break;
                    }
                    return false;
                  })
                  .keydown(function (event:KeyboardEvent):boolean {
                    switch (event.which) {
                      case 8: // backspace
                      case 46: // delete
                        $(this).val('');
                        $(this).trigger('change');
                        return false;
                      default:
                        return true;
                    }
                  })
                  .change(function ():void {
                    checkFormErrors();
                  })))
              .append($('<td></td>')
                .text(' \u2192 '))
              .append($('<td></td>')
                .append($('<input>')
                  .attr({
                    class: 'form-control replacement-input',
                    type: 'text'
                  })
                  .val(replacement)
                  .change(function ():void {
                    checkFormErrors();
                  }))));
        });
        // TODO: buttons to remove rules
        // TODO: button to add a rule

        $editRulesModal.modal('show');
      });
      $applyRulesButton.click(():void => {
        lsystem = new lsystems.LSystem();
        $rulesEditList.children().each(function ():void {
          lsystem.addRule($(this).find('.symbol-input').val(), $(this).find('.replacement-input').val());
        });
        lstrings = [$startString.val()];
        strIndex = 0;
        $editRulesModal.modal('hide');
        writeRulesTable();
        drawString(lstrings[strIndex]);
      });
    }

    $('#prevStringButton').click(function ():void {
      strIndex--;
      if (strIndex < 0) {
        strIndex = 0;
      }
      drawString(lstrings[strIndex]);
    });
    $('#nextStringButton').click(function ():void {
      strIndex++;
      while (!lstrings[strIndex]) {
        lstrings.push(lsystem.step(lstrings[lstrings.length - 1]));
      }
      drawString(lstrings[strIndex]);
    });

    gfx.startDraw();

    function drawString(str:string):void {
      $('#currString').text(str);

      var pos:gfx.V3 = new gfx.V3(0, 0, 0);
      var dir:gfx.V3 = new gfx.V3(0, 0, 0);
      var pts:gfx.V3[] = [pos];
      var turnAngle:number = Math.PI / 2;

      function movePt():void {
        pts.push(pos = pos.add(new gfx.V3(Math.cos(dir.z), Math.sin(dir.z), 0)));
      }

      for (var i:number = 0; i < str.length; i++) {
        switch (str[i]) {
          case 'f':
            if (pts.length) {
              gfx.addContiguousPath(pts);
            }
            pts = [];
            movePt();
            break;
          case 'F':
            movePt();
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
      if (pts.length) {
        gfx.addContiguousPath(pts);
      }
      gfx.updatePath();
    }

    drawString(lstrings[strIndex]);
  }
});
