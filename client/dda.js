
DDA = function(x,k){
  this.x = x;
  this.y = k/2;
  this.k = k;
  this.dy = 0;
  this.acc = 0;
  this.log = function(name) {
    console.log('%s x:%d y:%d k:%d dy:%d acc:%d', name, this.x, this.y, this.k, this.dy, this.acc);
  };
  this.pulse = function(dt){
    if (dt == 0) {
      this.dy = 0;
      return 0;
    }
    if (dt > 0) {
      this.y += this.x;
    }
    else {
      this.y -= this.x;
    }
    if (this.y >= this.k) {this.dy = 1; this.y -= this.k;}
    else if (this.y < 0) {this.dy = -1; this.y += this.k;}
    else this.dy = 0;
    this.acc += this.dy;
    return this.dy;
  };
}

DDA2 = function(x,k){
  this.x = x;
  this.y = k/2;
  this.k = k;
  this.dy = 0;
  this.acc = 0;
  this.log = function(name) {
    console.log('%s x:%d y:%d k:%d dy:%d', name, this.x, this.y, this.k, this.dy);
  };
  this.pulse = function(dx){
    this.dy = 0;
    if (this.x > this.k) {
      throw "DDA2 overflow x";
    }
    if (this.x < 0) {
      throw "DDA2 overflow x-";
    }
    if (dx == 1) {
      this.x += 1;
      this.y += this.x;
    }
    else if (dx == -1) {
      if (this.x <= 0) {
        return 0;
      }
      this.y -= this.x;
      this.x -= 1;
    }
    else if (dx == 0) {
      this.dy = 0;
      return 0;
    }
    if (this.y >= this.k) {this.dy = 1; this.y -= this.k;}
    else if (this.y < 0) {this.dy = -1; this.y += this.k;}
    else this.dy = 0;
//    console.log('DDA x:%d y:%d k:%d dy:%d', this.x, this.y, this.k, this.dy);
    this.acc += this.dy;
    return this.dy;
  };
}


cosine = function(k){
  this.I1 = new DDA(0,k);
  this.I2 = new DDA(k,k);

  this.log = function(name) {
    console.log('%s x:%d y:%d', name, this.I1.x, this.I2.x);
  }

  this.pulse = function(dt){
    this.I2.pulse(dt);
    this.I1.x += this.I2.dy;
    this.I1.pulse(dt);
    this.I2.x -= this.I1.dy;
    return {x:this.I1.x, y:this.I2.x}
  };

  //return {x:0, y:k}

}



module.exports = {
  DDA,
  DDA2,
  cosine
}
