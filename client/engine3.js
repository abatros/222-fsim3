// https://github.com/sampumon/SVG.toDataURL
/*
https://www.google.com/fonts/specimen/Dosis
https://www.google.com/fonts/specimen/Open+Sans+Condensed
https://www.google.com/fonts/specimen/Oswald#charset
*/

var _Template = Template['engine_panel3'];

var svg;

_Template.onRendered(()=>{
  svg = Snap(".svg-e-panel");
  console.log('svg-e-panel:', svg);
//  var x = svg.line(10,10,50,50);
//  svg.rect(100,100,100,100).attr({background-color:'red', color:'yellow'});

if (false) {
  svg.rect(50,50,240,300).attr({
    fill: '#202020'
  });
}
return;
  const epr_r = 58;
  const egt_r = 50;

  const x1 = 216;
  const x2 = 405;

  const y1 = 124; // EPR
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
    'stroke-width': 4,
    stroke: 'yellow',
    opacity: 0.3
  });
}


const dw = 33; //28;
const dz = epr_r;

var _path = [];
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

svg.path(mk_path()).attr({
  fill: 'none',
  'stroke-width': 2,
  stroke: 'white',
  opacity: 0.85,
  'stroke-linecap':'circle',
  'stroke-antialiasing':true
});

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
    stroke: 'green', //'#202020',
    'stroke-width': '4px',
    opacity: 0.6
  });
}


// EPR left : numeric EPR in double frame

svg.rect(x1-35,y1+25,90,34).attr({
  'stroke-width': 0,
  fill: '#202020'
});

svg.rect(x1-18,y1+28,80,30).attr({
  'border-radius': '25px',
  'stroke-width': '1px',
  stroke: 'teal', //'#0000FF',
  fill: 'none',
  'shape-rendering': 'crispEdges'
});

svg.rect(x1-15,y1+31,74,24).attr({
  'border-radius': '25px',
  'stroke-width': '1px',
  stroke: 'teal', //'#0000FF',
  fill: 'none',
  'shape-rendering': 'crispEdges'
});





/*******

// EPR right needle

svg.line(x2,y1, x2+23, y1 - 59).attr({
  stroke: 'red', //'#202020',
  'stroke-width': '1px'
});

// --- EGT -----------------------



// EGT left needle

svg.line(x1,y2, x1+17,y2-55).attr({
  stroke: 'red',
  'stroke-width': '1px'
});



// EGT right needle

svg.line(x2,y2, x2+17,y2-55).attr({
  stroke: 'red',
  'stroke-width': '1px'
});



// --- N1 -------------------------------------


// N1 left needle

const x1_ = (x1+x1+34)/2;
const y3_ = (y3+y3-53)/2;

svg.line(x1_,y3_, x1+34,y3-53).attr({
  stroke: 'red',
  'stroke-width': '1px'
});


// N1 right needle

svg.line(x2,y3, x2+34,y3-53).attr({
  stroke: 'red',
  'stroke-width': '1px'
});


*********************/



/***********************


svg.text(x1-18,y3+28,'85.').attr({
  'font-size': '21px',
  'font-family': 'Dosis', // 400,300,500,600,700,800
  'font-weight': 600,
  'letter-spacing': '2px',
  'fill' : '#DDFFAA',
  'stroke': 'green',
  'stroke-width': 0.2,
  opacity: 0.75
});


svg.text(x1-18+32,y3+28,'1').attr({
  'font-size': '17px',
  'font-family': 'Dosis', // 400,300,500,600,700,800
  'font-weight': 600,
  'letter-spacing': '2px',
  'fill' : '#DDFFAA',
  'stroke-width': 0.2,
  opacity: 0.75
});

************************/




/****************
svg.text(50,95,'EPR EGT').attr({
  'font-size': '15pt',
  'font-family': 'Oswald',
  'font-weight': 400, // 300, 400, 700
  'letter-spacing': '1px',
  'fill' : 'white',
  'stroke': 'white',
  'stroke-width': 0.2,
  opacity: 0.85
});
*********************/


/*************************
// EPR

svg.text(205+10,150+18,'8').attr({
  'font-size': '22px',
  'font-family': 'Dosis', // 400,300,500,600,700,800
  'font-weight': 600,
  'letter-spacing': '2px',
  'fill' : '#DDFFAA',
  'stroke': 'green',
  'stroke-width': 0.2,
  opacity: 0.75
});


svg.text(205+22,150+18,'.498').attr({
  'font-size': '18px',
  'font-family': 'Dosis', // 400,300,500,600,700,800
  'font-weight': 600,
  'letter-spacing': '2px',
  'fill' : '#DDFFAA',
  'stroke-width': 0.2,
  opacity: 0.75
});

**********************/


// ----------------------------------------------------


/*
  for (var y=100; y<500; y+=100){
    svg.line(0,y,800,y).attr({
      stroke: 'white',
      'stroke-width': 1
    });
  }
*/

/***********************************
const dda1 = new DDA(80,100);
var x=0,y=0;
const v = [];

for (let i=0; i<100; i++) {
  y += dda1.pulse(1);
  v.push('L'+i+','+y);
  svg.rect(i,y,1,1).attr({
      fill: 'none',
      'stroke-width': 1,
      stroke: 'white',
      opacity: 0.45,
      'stroke-linecap':'circle'
  });
}
**********************/


// https://github.com/svg/svgo

/********************
svg.path('M 0,0 ' + v.join(' ')).attr({
    fill: 'none',
    'stroke-width': 2,
    stroke: 'white',
    opacity: 0.95,
    'stroke-linecap':'circle',
    'stroke-antialiasing':true
});

console.log('M0,0'+v.join(' '));

svg.line(0,10,100,93).attr({
    fill: 'none',
    'stroke-width': 2,
    stroke: 'white',
    opacity: 0.95,
    'stroke-linecap':'circle',
    'stroke-antialiasing':true
});
*******************/
// http://codepen.io/leelou/pen/gvErq


//M100,250 Q250,100 400,250
/*
svg.path('M100,100 Q150,100 150,150 q0,50 -50,50 q-50,0 -50,-50 q0,-50 50,-50').attr({
    fill: 'none',
    'stroke-width': 2,
    stroke: 'white',
    opacity: 0.95,
    'stroke-linecap':'circle',
    'stroke-antialiasing':true
});
*/
// http://www.tinaja.com/glib/ellipse4.pdf
// http://www.sitepoint.com/html5-svg-cubic-curves/



/*
svg.path('M100,110 c0,-68 100,-68 100,0 c0,68 -100,68 -100,0').attr({
  fill: 'none',
  'stroke-width': 2,
  stroke: 'white',
  opacity: 0.75,
  'stroke-linecap':'circle',
  'stroke-antialiasing':true
});
*/


// here we have perfect circle.


function mk_path() {
  const p1 = _path.map((it)=>{
    return it.o + it.x.toString() + ',' + it.y.toString();
    }).join(' ');
  return p1;
}

}); // onRendered


// ---------------------------------------------------------

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
