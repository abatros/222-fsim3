var _Template = Template['EGT_panel'];

var svg;
const epr_r = 58;
const egt_r = 50;
const x1 = egt_r + 10; //216;
const x2 = 405;
const y1 = egt_r + 10; //124; // EPR
const y2 = 240; // EGT
const y3 = 322; // N1

_Template.onCreated(()=>{
});


_Template.helpers({
  'needle': function(){
    const v = Session.get('egt-value');
    if (!v) {
      return;
    }
    const vv = {x1:x1+v[0], y1:y1+v[1], x2:x1+v[0]*0.6, y2:y1+v[1]*0.6};
//    console.log('needle-pos:', vv);
    return vv;
  }
});


_Template.onRendered(function(){
  const t_name = Template.instance().data.name;
  var element = this.find("svg");
  console.log('>> onRendered svg element (%s) element:', t_name, element);
  $(element).addClass(t_name); // argument {{> epr_panel name="left"}}
  svg = Snap(element); // WOOOOOOOOOOOOOOOOOOOOOOWWWWWWWWWWWWWWWWWWWWWW
  console.log('onRendered svg (%s):', t_name, svg);
//  var x = svg.line(10,10,50,50);
//  svg.rect(100,100,100,100).attr({background-color:'red', color:'yellow'});





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

var lower_rect = svg.rect(8, 8, 2*egt_r+4, egt_r+2).attr({
  fill: '#fff'
});


var bigCircle = svg.circle(10+egt_r, 10+egt_r, egt_r).attr({
  fill: 'none',
  'stroke-width': 2,
  stroke: 'white',
  opacity: 0.85,
  'stroke-antialiasing':true,
  mask: lower_rect
});

const cosine1 = new Meteor.dda.cosine(egt_r);

var iZero = -1;
var red_x = 0, red_y = 0; // start red zone
const ii = 26; // 20 % => 100% =

var EGT_angle = Math.round(218*0.8);

var needle_x, needle_y;
for (let i=0; i<220; i++) {
  cosine1.pulse(1);
  if (iZero < 0) {
    if (cosine1.cos.x > 0) {
      continue;
    }
    iZero = i;
//    EGT_angle = Math.round((iZero+ii*10)*0.7);
  }


// 741 ~ 70% => 260*0.7
  if (i == EGT_angle) {
      needle_x = -cosine1.sin.x; // we should make cosine works like svg axes.
      needle_y = cosine1.cos.x;
  }

  //  cosine1.log('cosine1');
  if ((i-iZero)%ii == 0) {
    // draw a mark.
    var rr = 0.86;
    if ((i-iZero)/ii == 5) { // the last mark -> red
        rr = 0.75;
    }
    let _x1 = -cosine1.sin.x * 1;
    let _y1 = cosine1.cos.x * 1;
    const _x2 = -cosine1.sin.x * rr;
    const _y2 = cosine1.cos.x * rr;
    svg.line(x1 + _x1, y1 + _y1, x1 + _x2, y1 + _y2).attr({
      'stroke-width': 2,
      stroke: 'white',
      opacity: 0.85
    });

    switch((i-iZero)/ii) {
/*
      case 0: // ~ 100*C
        svg.text(x1+_x2-2, y1+_y2+16, "0").attr({
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
      case 3:
        svg.text(x1+_x2-2, y1+_y2+16, "6").attr({
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
*/
      case 5:
      /*
        svg.text(x1+_x2-20, y1+_y2+11, "10").attr({ // 100%
          'font-size': '18px',
          'font-family': 'Dosis', // 400,300,500,600,700,800
          'font-weight': 600,
          'letter-spacing': '2px',
          'fill' : 'white',
          'stroke': 'white',
          'stroke-width': 0.2,
          opacity: 0.95
        });
        */
        // also: save that point
        red_x = -cosine1.sin.x;
        red_y = cosine1.cos.x;
      break;
    }

  }
} // all the marks on the EGT


// red-zone marks on quadrant

// draw the red-zone
var rat = 0.87;
var _path = [
  {o:'M', x:x1, y:y1},
  {o:'m', x:red_x, y:red_y},
  {o:'A', x:egt_r, y:egt_r},
  {o:' 0,', x:0, y:1}, // trick
  {o:' ', x:x1+egt_r, y:y1},
  {o:'L', x:x1+egt_r*rat, y:y1},
  {o:'A', x:egt_r*rat, y:egt_r*rat},
  {o:' 0,', x:0, y:0}, // trick
  {o:' ', x:x1+red_x*rat, y:y1+red_y*rat},
  {o:'L', x:x1+red_x, y:y1+red_y}
];

_path = _path.map((it)=>{
  return it.o + it.x.toString() + ',' + it.y.toString();
  }).join(' ');

console.log('_path:',_path);

svg.path(_path).attr({
  fill: 'none',
  'stroke-width': 2,
  stroke: 'red',
  opacity: 0.85,
  'shape-rendering': 'geometricPrecision', // 'crispEdges',
  'stroke-linecap':'circle',
  'stroke-antialiasing':true
});

// Draw the needle should be reactive.
/*
svg.line(x1+needle_x*0.5, y1+needle_y*0.5, x1+needle_x*1.1, y1+needle_y*1.1).attr({
  'stroke-width': '5px',
  stroke : '#DDFFAA'
});
*/
// EGT  numeric EPR in double frame
const voff = -18;
const xoff = -30
const wd = 58;

if (false) {
  svg.rect(x1-35,y1+voff,wd+2,40).attr({
    'stroke-width': 0,
    fill: '#202020'
  });
}

svg.rect(x1+xoff,y1+voff+3,wd,28).attr({
  'border-radius': '25px',
  'stroke-width': '1px',
  stroke: 'teal', //'#0000FF',
  fill: 'none',
  'shape-rendering': 'crispEdges'
});

svg.rect(x1+xoff+2,y1+voff+5,wd-4,24).attr({
  'border-radius': '25px',
  'stroke-width': '1px',
  stroke: 'teal', //'#0000FF',
  fill: 'none',
  'shape-rendering': 'crispEdges'
});


// Numeric data (should be reactive)
/***
svg.text(x1+xoff+13,y1+voff+27,'741').attr({
  'font-size': '22px',
  'font-family': 'Dosis', // 400,300,500,600,700,800
  'font-weight': 600,
  'letter-spacing': '2px',
  'fill' : '#DDFFAA',
  'stroke-width': 0.2,
  opacity: 0.75
});
***/

// start the engine.
// EGT like N1 = fct(ff).
// -----------------------------------------------------------
const cosine2 = new Meteor.dda.cosine(egt_r);
// max after 50*2*3.14 ~ 314 ticks
const aperiodic = new Meteor.dda.Aperiodic();

var EGT_angle = 0; // max ~314 but dda3.x -> 1000 ratio:3
//const EGT_max_value = 1000;


/*********************************************
var EGT_pulse = function() {
//    return Meteor.clearInterval(interval);

  // check FF
  aperiodic.dda2.x = Session.get('throttle-position')*3;
  aperiodic.pulse();
//  aperiodic.log('EGT/N1');

//  Session.set('N1', aperiodic.dda3.x*10); // max speed RPM 10,000
//  Session.set('egt-celsius', aperiodic.dda3.x); // speed 1000*C

  if (aperiodic.dda3.x >= (EGT_angle+1)*6) {
    cosine2.pulse(1); // this to compute (x,y) needle.
    EGT_angle += 1;
    console.log('EGT (angle) %d', EGT_angle);
    aperiodic.log('EGT/N1');
  }
  else  if (aperiodic.dda3.x < EGT_angle*6) {
    cosine2.pulse(-1); // this to compute (x,y) needle.
    EGT_angle -= 1;
    console.log('EGT (angle) %d', EGT_angle);
    aperiodic.log('EGT/N1');
  }
  Session.set('egt-value', [-cosine2.cos.x, -cosine2.sin.x]);
//  console.log(' -- %d x:%d y:%d', EGT_angle, cosine2.x.x, cosine2.y.x);
};

var interval = Meteor.setInterval(EGT_pulse, 5);
**************************/

// -----------------------------------------------------------


return;
// let's draw marks every 30 dt



// display EPR left needle
// EPR left needle
if (true) {
  svg.line(x1,y1, x1-60, y1).attr({
    stroke: 'green', //'#202020',
    'stroke-width': '4px',
    opacity: 0.6
  });
}



// here we have perfect circle.


function mk_path() {
  const p1 = _path.map((it)=>{
    return it.o + it.x.toString() + ',' + it.y.toString();
    }).join(' ');
  return p1;
}

}); // onRendered
