
function getPoints(minX,maxX,minZ,maxZ,n,func){
  let points = [];
  let stepX = (maxX - minX) / n;
  let stepZ = (maxZ - minZ) / n;
  let minY = Number.MAX_VALUE;
  let maxY = -Number.MAX_VALUE;
  for(let x = 0; x < n; x ++){
    for(let z = 0; z < n ; z ++ ){
      let realX = x * stepX + minX;
      let realZ = z * stepZ + minZ;
      let y = func(realX,realZ);
      if (maxY < y) {
        maxY = y;
      }
      if (minY > y) {
        minY = y;
      }
      points.push(realX);
      points.push(y);
      points.push(realZ);
    }
  }
  return {points : points,minY : minY,maxY : maxY};
}

function main() {

  var canvas = document.getElementById("canvas");

  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  var vertexShaderSource = document.getElementById("vertex_shader").text;
  var fragmentShaderSource = document.getElementById("fragment_shader").text;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  var program = createProgram(gl, vertexShader, fragmentShader);

  // lines
  var coordsSys = {};
  coordsSys.setData = function(minX,maxX,minY,maxY,minZ,maxZ){
    let midX = 0; //(minX + maxX) / 2;
    let midY = 0; //(minY + maxY) / 2;
    let midZ = 0; //(minZ + maxZ) / 2;
    coordsSys.data = [
      minX,midY,midZ,
      maxX,midY,midZ,
      midX,minY,midZ,
      midX,maxY,midZ,
      midX,midY,minZ,
      midX,midY,maxZ ];
  }
  coordsSys.dims = 3;
  coordsSys.primitive = gl.LINES;
  coordsSys.buff = gl.createBuffer();
  coordsSys.color = [0,0,0,1];

  var points = {};
  points.data = [];
  points.dims = 3;
  points.primitive = gl.POINTS;
  points.buff = gl.createBuffer();
  points.color = [0.7,0.3,0.3,0.7];

  const positionLocation = gl.getAttribLocation(program,'a_position');
  const transformLocation = gl.getUniformLocation(program,'transform');
  const colorLocation = gl.getUniformLocation(program, "u_color");

  // code above is for initialization
  var transform = [];
  ratio = canvas.height / canvas.width;
  var perspective = mat.perspective(Math.PI/2.1,2,20,ratio);
  var redraw = function(){

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable( gl.DEPTH_TEST);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.useProgram(program);

    var size = 3;          
    var type = gl.FLOAT;   
    var normalize = false; 
    var stride = 0;        
    var offset = 0;
    
    var finalTransform = mat.multiply(perspective,transform);

    drawObject = function( object ){
      // draw ball
      gl.bindBuffer(gl.ARRAY_BUFFER, object.buff );
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.data), gl.STATIC_DRAW);
      gl.vertexAttribPointer(
          positionLocation, size, type, normalize, stride, offset)
      gl.enableVertexAttribArray(positionLocation);
      gl.uniformMatrix4fv(transformLocation, false, finalTransform);
      gl.uniform4fv(colorLocation, object.color);
      gl.drawArrays(object.primitive, 0, object.data.length / object.dims);
    }

    drawObject(coordsSys);
    drawObject(points);

  }

  var functions = {};
  functions["x^2+z^2"] = function(x,y){return x*x + y * y};
  functions["sin(x)"] = function(x,y){return Math.sin(x)};

  var funcSel = document.getElementById("functionSelect");
  var minXInput = document.getElementById("minX");
  var maxXInput = document.getElementById("maxX");
  var minZInput = document.getElementById("minZ");
  var maxZInput = document.getElementById("maxZ");
  var init = function(){
    let func = functions[funcSel.value];
    let minX = parseInt(minXInput.value);
    let maxX = parseInt(maxXInput.value);
    let minZ = parseInt(minZInput.value);
    let maxZ = parseInt(maxZInput.value);
    let res = getPoints(minX,maxX,minZ,maxZ,500,func); 
    points.data = res.points;
    let minY = res.minY;
    let maxY = res.maxY;
    let midX = (minX + maxX) / 2;
    let midY = (minY + maxY) / 2;
    let midZ = (minZ + maxZ) / 2;
    coordsSys.setData(minX,maxX,minY,maxY,minZ,maxZ);
    let translation = mat.translation(-midX,-midY,-midZ);
    let k = 1;
    let scale = mat.scale(k * 2/(maxX - minX),k * 2/(maxY - minY),k * 2/(maxZ - minZ));
    transform = mat.multiply(scale,translation);
    /*
    let tilt = mat.xRotation(-0.1);
    transform = mat.multiply(tilt,transform)
    */
    redraw();
  }
  document.getElementById("drawButton").onclick = init;

  init();

  // controls
  document.addEventListener('keypress', (event) => {

  const key = event.key;
  switch(key){
    case 'w':
      transform = mat.multiply( mat.xRotation(0.1) , transform);
      break;
    case 's':
      transform = mat.multiply( mat.xRotation(-0.1) , transform);
      break;
    case 'a':
      transform = mat.multiply( mat.yRotation(0.1) , transform);
      break;
    case 'd':
      transform = mat.multiply( mat.yRotation(-0.1) , transform);
      break;
    case 'q':
      // movement.roll(1);
      break;
    case 'e':
      // movement.roll(-1);
      break;
    case ' ':
      // movement.forward();
      break;
    default:
      return;
  }  
  redraw();
  return;

}, false);
}

main();
// getPoints(-1,1,-1,1,3,function(x,y){return x*x + y*y;});
