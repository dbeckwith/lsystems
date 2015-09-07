/**
 * Created by Daniel Beckwith on 9/6/15.
 */

///<reference path='_ref.d.ts'/>

module gfx {

  var canvas:HTMLCanvasElement;
  var gl:WebGLRenderingContext;
  var shaderProgram:WebGLProgram;

  var vPositionAttr:number;
  var transformUniform:WebGLUniformLocation;
  var pathVerts:WebGLBuffer;

  var timer:number;
  var anim:(callback:FrameRequestCallback, element:HTMLElement) => void;

  var dragButton:number;

  var nextPathVerts:number[];
  var pathLen:number;
  var modelView:M4;
  var projection:M4;
  var theta:V3;
  var pan:V3;
  var scale:number;

  export function init(c:HTMLCanvasElement):boolean {
    canvas = c;

    gl = null;

    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    }
    catch (e) {
      alert('Error initializing WebGL: ' + e);
    }
    if (!gl) {
      alert('Unable to initialize WebGL');
      return false;
    }

    if (!initShaders()) {
      return false;
    }
    initBuffers();

    gl.viewport(0, 0, canvas.width, canvas.height);
    $(canvas).resize(() => {
      gl.viewport(0, 0, canvas.width, canvas.height);
    });

    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    anim =
      window['requestAnimationFrame'] ||
      window['webkitRequestAnimationFrame'] ||
      window['mozRequestAnimationFrame'] ||
      window['oRequestAnimationFrame'] ||
      window['msRequestAnimationFrame'] ||
      function (callback:FrameRequestCallback, element:HTMLElement):void {
        window.setTimeout(callback, 1000 / 60);
      };

    return true;
  }

  function initShaders():boolean {
    function getShader(url:string, type:number):WebGLShader {
      var shader:WebGLShader;

      shader = gl.createShader(type);

      $.ajax({
        url: url,
        success: (data:string):void => {
          gl.shaderSource(shader, data);
        },
        async: false
      });

      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        return null;
      }

      return shader;
    }

    var fragmentShader:WebGLShader = getShader('res/frag_shader.glsl', gl.FRAGMENT_SHADER);
    var vertexShader:WebGLShader = getShader('res/vert_shader.glsl', gl.VERTEX_SHADER);

    // Create the shader program

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program.');
      return false;
    }

    gl.useProgram(shaderProgram);

    // get shader attributes (per-vertex) and enable them
    vPositionAttr = gl.getAttribLocation(shaderProgram, 'vPosition');
    gl.enableVertexAttribArray(vPositionAttr);

    // get shader uniforms (same across all vertices)
    transformUniform = gl.getUniformLocation(shaderProgram, 'transform');

    return true;
  }

  function initBuffers():void {
    pathVerts = gl.createBuffer(); // create a buffer of vertex data

    nextPathVerts = null;
    pathLen = 0;
  }

  export function startDraw():void {
    timer = null;

    modelView = M4.translation(new V3(0, 0, -6));
    projection = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
    theta = new V3(0, 0, 0);
    pan = new V3(0, 0, 0);
    scale = 0;


    dragButton = -1;
    canvas.addEventListener('mousedown', function (event:MouseEvent):void {
      dragButton = event.button;
      event.preventDefault();
      event.stopPropagation();
    }, false);
    document.addEventListener('mousemove', function (event:MouseEvent):void {
      // TODO: scale about center of view
      // TODO: rotate about center of view
      // TODO: rotate X about current Y rotation
      // TODO: set limits for scaling and panning
      // TODO: try to prevent context menu when dragging off of canvas
      // TODO: maybe switch right and left buttons?
      if (dragButton >= 0) {
        switch (dragButton) {
          case 0: // left
            theta.y += event['movementX'] / 100;
            theta.x += event['movementY'] / 100;
            break;
          case 2: // right
            pan.x += event['movementX'] / 100;
            pan.y -= event['movementY'] / 100;
            break;
          default:
            break;
        }
        event.preventDefault();
        event.stopPropagation();
      }
    }, false);
    document.addEventListener('mouseup', function ():void {
      if (dragButton >= 0) {
        event.preventDefault();
        event.stopPropagation();
      }
      dragButton = -1;
    }, false);
    canvas.addEventListener('wheel', function (event:WheelEvent):void {
      scale += event.deltaY < 0 ? 1 : -1;
      event.preventDefault();
      event.stopPropagation();
    }, false);
    canvas.addEventListener('contextmenu', function (event:MouseEvent):void {
      event.preventDefault();
      event.stopPropagation();
    }, false);


    anim(draw, canvas);
  }

  function draw(time:number):void {
    if (timer === null) {
      timer = time - 1000 / 60;
    }
    var dt:number = (-timer + (timer = time)) / 1000.0;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear screen

    // bind the buffer to the GPU as an array of values to be used with subsequent function calls
    gl.bindBuffer(gl.ARRAY_BUFFER, pathVerts);
    if (nextPathVerts) {
      pathLen = nextPathVerts.length / 3;
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nextPathVerts), gl.DYNAMIC_DRAW); // add vertex data to the buffer
      nextPathVerts = null;
    }

    // set attributes
    // tell shader where each attribute is in the vertex data
    gl.vertexAttribPointer(
      vPositionAttr, // the attribute we're describing
      3, // the size of the attribute
      gl.FLOAT, // the type of each element of the attribute
      false, // normalized or not
      0, // how far between successive elements of this attribute
      0 // offset from the beginning of the array
    );

    // set uniforms
    gl.uniformMatrix4fv(transformUniform, false, new Float32Array(
      projection
        .mul(modelView)
        .mul(M4.translation(pan))
        .mul(M4.rotation(theta.x, theta.y, theta.z))
        .mul(M4.scale(Math.pow(2, scale / 5) / 100))
        .toArray()));

    gl.drawArrays(gl.LINE_STRIP, 0, pathLen); // draw vertex data as a trangle strip of vertex length 4 and offset 0


    anim(draw, canvas);
  }

  function makePerspective(fovy:number, aspect:number, near:number, far:number):M4 {
    var f:number = 1.0 / Math.tan(fovy * Math.PI / 180 / 2);
    var d:number = far - near;
    return new M4(
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, -(near + far) / d, -2 * near * far / d,
      0, 0, -1, 0
    );
  }

  export function setPath(points:V3[]):void {
    nextPathVerts = _.chain(points).map((p:V3):number[] => p.toArray()).flatten().value();
  }

  export function getCanvas():HTMLCanvasElement {
    return canvas;
  }

}
