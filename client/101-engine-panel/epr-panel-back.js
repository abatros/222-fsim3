import './epr-panel.html'
var TP = Template.epr_panel;

const Snap = require('snapsvg')
//console.log({Snap})

const {cosine} = require('../dda.js')

//var svg;

TP.onCreated(()=>{
});

TP.onRendered(function(){
  const tp = this;
  const t_name = tp.data.name;
  var element = this.find("svg");
  console.log('>> onRendered svg element (%s) element:', t_name, element);
  $(element).addClass(t_name); // argument {{> epr_panel name="left"}}
  const svg = Snap(element); // WOOOOOOOOOOOOOOOOOOOOOOWWWWWWWWWWWWWWWWWWWWWW
  console.log('onRendered svg (%s):', t_name, svg);
//  var x = svg.line(10,10,50,50);
//  svg.rect(100,100,100,100).attr({background-color:'red', color:'yellow'});

  const epr_r = 58;
  //const egt_r = 50;

  const x1 = epr_r + 10; //216;
  const x2 = 405;

  const y1 = epr_r + 10; //124; // EPR
  const y2 = 240; // EGT
  const y3 = 322; // N1

const att_circle_ = {
  stroke: 'red',
  'stroke-width': '1px',
  fill: 'none'
};

const att_circle = {
  stroke: 'white',
  'stroke-width': '2px',
  fill: 'none',
  opacity: 0.65
};

// EPR left

// test circle
if (false) {
  svg.circle(x1,y1,epr_r).attr({
    fill: 'none',
    'stroke-width': 1,
    stroke: 'yellow',
    opacity: 0.3
  });
}

//return;

const dw = 33; //28;
const dz = epr_r;


/*
var _path_Obsolete = [];
_path.push({o:'M', x:x1, y:y1});
_path.push({o:'m', x:-dz, y:0});
_path.push({o:'c', x:0, y:-(dw)});
_path.push({o:'', x:dz-dw, y:-dz});
_path.push({o:'', x:dz, y:-dz});
//_path.push({o:'m', x:50, y:-50});
_path.push({o:'c', x:dw, y:0});
_path.push({o:'', x:dz, y:dz-dw});
_path.push({o:'', x:dz, y:dz});

_path.push({o:'c', x:0, y:dw});
_path.push({o:'', x:-dz+dw, y:dz});
_path.push({o:'', x:-dz, y:dz});

_path.push({o:'c', x:-dw, y:0});
_path.push({o:'', x:-dz, y:-dz+dw});
_path.push({o:'', x:-dz, y:-dz});
*/

const _path = `
M${x1},${y1}
m${-dz},${0}
c${0},${-(dw)}
${dz-dw},${-dz}
${dz},${-dz}
c${dw},${0}
${dz},${dz-dw}
${dz},${dz}

c${0},${dw}
${-dz+dw},${dz}
${-dz},${dz}

c${-dw},${0}
${-dz},${-dz+dw}
${-dz},${-dz}
`.replace(/[\n\s]+/g,' ');



function mk_path() {
  const p1 = _path_Obsolete.map((it)=>{
    return it.o + it.x.toString() + ',' + it.y.toString();
    }).join(' ');
  return p1;
}


//const _mkp = mk_path();
//console.log({_mkp})
console.log(_path)

svg.path(_path).attr({
  fill: 'none',
  'stroke-width': 2,
  stroke: 'white',
  opacity: 0.85,
  'stroke-linecap':'circle',
  'stroke-antialiasing':true
});
return;

// let's draw marks every 30 dt

const cosine1 = new cosine(epr_r);

var iZero = -1;

for (let i=0; i<300; i++) {
  cosine1.pulse(1);
  if (iZero < 0) {
    if (cosine1.x.x < 42) {
      continue;
    }
    iZero = i;
  }

  //  cosine1.log('cosine1');
  if ((i-iZero)%22 == 0) {
    // draw a mark.
    let _x1 = -cosine1.x.x * 1;
    let _y1 = cosine1.y.x * 1;
    const _x2 = -cosine1.x.x * 0.83;
    const _y2 = cosine1.y.x * 0.83;
    svg.line(x1 + _x1, y1 + _y1, x1 + _x2, y1 + _y2).attr({
      'stroke-width': 2,
      stroke: 'white',
      opacity: 0.85
    });

    switch((i-iZero)/22) {
      case 2:
        svg.text(x1+_x2+7, y1+_y2+6, "1").attr({
          'font-size': '18px',
          'font-family': 'Dosis', // 400,300,500,600,700,800
          'font-weight': 600,
          'letter-spacing': '2px',
          'fill' : 'white',
          'stroke': 'white',
          'stroke-width': 0.2,
          opacity: 0.95
        });
      break;
      case 6:
        svg.text(x1+_x2-9, y1+_y2+18, "1.4").attr({
          'font-size': '18px',
          'font-family': 'Dosis', // 400,300,500,600,700,800
          'font-weight': 600,
          'letter-spacing': '2px',
          'fill' : 'white',
          'stroke': 'white',
          'stroke-width': 0.2,
          opacity: 0.95
        });
      break;
      case 10:
        svg.text(x1+_x2-24, y1+_y2+7, "1.8").attr({
          'font-size': '18px',
          'font-family': 'Dosis', // 400,300,500,600,700,800
          'font-weight': 600,
          'letter-spacing': '2px',
          'fill' : 'white',
          'stroke': 'white',
          'stroke-width': 0.2,
          opacity: 0.95
        });
      break;
//      default:
//      console.log('switch: %d',(i-iZero)/22);
    }

  }
} // all the marks on the EPR


// display EPR left needle
// EPR left needle
if (true) {
  svg.line(x1,y1, x1-60, y1).attr({
    stroke: '#DDFFAA', //'#202020',
    'stroke-width': '4px',
    opacity: 0.6
  });
}


// EPR left : numeric EPR in double frame
const voff = 20;

svg.rect(x1-35,y1+voff,100,40).attr({
  'stroke-width': 0,
  fill: '#202020'
});

svg.rect(x1-18,y1+voff+3,80,30).attr({
  'border-radius': '25px',
  'stroke-width': '1px',
  stroke: 'teal', //'#0000FF',
  fill: 'none',
  'shape-rendering': 'crispEdges'
});

svg.rect(x1-15,y1+voff+6,74,24).attr({
  'border-radius': '25px',
  'stroke-width': '1px',
  stroke: 'teal', //'#0000FF',
  fill: 'none',
  'shape-rendering': 'crispEdges'
});


// Numeric data (should be reactive)

svg.text(x1-15+15,y1+voff+27,'1.').attr({
  'font-size': '22px',
  'font-family': 'Dosis', // 400,300,500,600,700,800
  'font-weight': 600,
  'letter-spacing': '2px',
  'fill' : '#DDFFAA',
  'stroke-width': 0.2,
  opacity: 0.75
});

svg.text(x1-15+15+15,y1+voff+27,'000').attr({
  'font-size': '18px',
  'font-family': 'Dosis', // 400,300,500,600,700,800
  'font-weight': 600,
  'letter-spacing': '2px',
  'fill' : '#DDFFAA',
  'stroke': 'none',
  'stroke-width': 0,
  opacity: 0.75
});


}); // onRendered


// ---------------------------------------------------------
/*
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
  this.x = new DDA(0,k);
  this.y = new DDA(k,k);

  this.log = function(name) {
    console.log('%s x:%d y:%d', name, this.x.x, this.y.x);
  }

  this.pulse = function(dt){
    this.y.pulse(dt);
    this.x.x += this.y.dy;
    this.x.pulse(dt);
    this.y.x -= this.x.dy;
  };
}
*/
