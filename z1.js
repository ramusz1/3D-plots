
function getPoints(minX,maxX,minZ,maxZ,n,func){
  let points = [];
  let stepX = (maxX - minX) / n;
  let stepZ = (maxZ - minZ) / n;
  let minY = Math.MAX_VALUE;
  let maxY = -Math.MAX_VALUE;
  for(let x = 0; x < n; x ++){
    for(let z = 0; z < n ; z ++ ){
      let y = func(x,z);
      if (maxY < y) {
        max = y;
      }
      if (minY > y) {
        min = y;
      }
      points = points.concat([x,y,z]);
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
    let midX = (minX + maxX) / 2;
    let midY = (minY + maxY) / 2;
    let midZ = (minZ + maxZ) / 2;
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
  gl.bindBuffer(gl.ARRAY_BUFFER, coordsSys.buff);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordsSys.data), gl.STATIC_DRAW);
  coordsSys.color = [0,0,0,1];

  var points = {};
  points.data = [];
  points.dims = 3;
  points.primitive = gl.POINTS;
  points.buff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, points.buff);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.data), gl.STATIC_DRAW);
  points.color = [0.7,0.3,0.3,1];

  const positionLocation = gl.getAttribLocation(program,'a_position');
  const transformLocation = gl.getUniformLocation(program,'transform');
  const colorLocation = gl.getUniformLocation(program, "u_color");

  // code above is for initialization
  var redraw = function(){

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable( gl.DEPTH_TEST);
    gl.useProgram(program);

    var size = 3;          
    var type = gl.FLOAT;   
    var normalize = false; 
    var stride = 0;        
    var offset = 0;
            
    drawObject = function( object ){
      // draw ball
      console.log(object.data);
      gl.bindBuffer(gl.ARRAY_BUFFER, object.buff );
      gl.vertexAttribPointer(
          positionLocation, size, type, normalize, stride, offset)
      gl.enableVertexAttribArray(positionLocation);
      gl.uniformMatrix4fv(transformLocation, false, mat.identity() );
      gl.uniform4fv(colorLocation, object.color);
      gl.drawArrays(object.primitive, 0, object.data.length / object.data.dims);
    }

    drawObject(coordsSys);
    drawObject(points);

  }


  // controls
  var funcSel = document.getElementById("functionSelect");
  var minXInput = document.getElementById("minX");
  var maxXInput = document.getElementById("maxX");
  var minZInput = document.getElementById("minZ");
  var maxZInput = document.getElementById("maxZ");
  var init = function(){
    let func = function(x,y){return x*x + y*y;};
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
    let scale = mat.scale(1/(midX - minX),1/(midY - minY),1/(midZ - minZ));
    transform = mat.multiply(scale,translation);
    redraw();
  }
  document.getElementById("drawButton").onClick = init;

  init();
}

main();
// getPoints(-1,1,-1,1,3,function(x,y){return x*x + y*y;});
