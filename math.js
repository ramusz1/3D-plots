var mat = {

  translation : function(x,y,z){
    return [ 
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      x,y,z,1 ];
  },

  perspective: function(fieldOfViewInRadians, near, far, ratio) {
    var a = 1/ Math.tan(0.5 * fieldOfViewInRadians);
    var b = 2.0 / (far - near);

    return [
      a * ratio, 0, 0, 0,
      0, a, 0, 0,
      0, 0, b, 1,
      0, 0, -1, near
    ];
  },

  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
 
    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },
 
  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
 
    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scale : function(x,y,z){
    return [ 
      x,0,0,0,
      0,y,0,0,
      0,0,z,0,
      0,0,0,1 ];
  },
  identity : function(){
    return [ 
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1 ];
  },

  projection : function(width, height, depth){
    return [
      1 / width, 0, 0, 0,
      0, -1 / height, 0, 0,
      0, 0, 1 / depth, 0,
      0, 0, 0, 1 ];
  },

  multiply : function(m1,m2){
    var size = 4;
    var out = [];
    for( var i = 0; i < size * size; i ++){
      out.push(0);
    }

    for(var i = 0 ; i < size; i ++ ){
      for(var j = 0 ; j < size; j ++){
        var sum = 0;
        for(var k = 0; k < size; k ++){
          sum += m1[ k * size + i] * m2[ j*size + k];
        }
        out[j*size + i] = sum;
      }
    }
    return out;
  },

  multiplyVector : function(m,v){
    var size = 4;
    var out = [];
    for( var i = 0 ; i < size; i ++){   
      var sum = 0;
      for(var k = 0; k < size; k ++){
        sum += m[ k * size + i] * v[ k ];
      }
      out.push(sum);
    }
    return out;
  },

  add : function(a,b){
    var size = 3;
    out = [1,2,3];
    for(var i = 0 ; i < size; i ++){
      out[i] = a[i] + b[i];
    }
    return out;
  },

  // return vectro normal to triangle surface
  // a,b,c are points from R^3
  normal : function(a,b,c){
    // triangle a,b,c
    substr = function(y,x){
      return [y[0] - x[0],y[1] - x[1],y[2] - x[2]];
    }
    let U = substr(b,a);
    let V = substr(c,a);
    /*
      Nx = UyVz - UzVy
      Ny = UzVx - UxVz
      Nz = UxVy - UyVx
    */
    N = [
      U[1]*V[2] - U[2]*V[1],
      U[2]*V[0] - U[0]*V[2],
      U[0]*V[1] - U[1]*V[0]
    ];
    return mat.normalize(N);
  },

  // normalize 3d vector
  normalize : function(x){

    let length = Math.sqrt(
      x[0] ** 2 
      + x[1] ** 2
      + x[2] ** 2 );
    if( Math.abs(length) < 0.000001 ){
      return [1,0,0];
    }
    return [x[0] / length,
            x[1] / length, 
            x[2] / length]
  }

};


