/*
When flex (FLX) thrust is selected during take off, the engine controller
produces maximum thrust for the assumed (flex) temperature.
If necessary, the crew can push the throttles into the Take Off/Go
Around (TOGA) detent and request full power.
*/


var _Template = Template['N1_panel'];

var svg;

_Template.onCreated(()=>{
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


  const epr_r = 58;
  const egt_r = 50;

  const x1 = egt_r + 10; //216;
  const x2 = 405;

  const y1 = egt_r + 10; //124; // EPR
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

var lower_rect = svg.rect(8, 8, 2*egt_r+4, (egt_r*1.5)+2).attr({
  fill: '#fff'
});


var bigCircle = svg.circle(10+egt_r, 10+egt_r, egt_r).attr({
  fill: 'none',
  'stroke-width': 2,
  stroke: 'white',
  opacity: 0.85,
  mask: lower_rect,
  'stroke-antialiasing':true
});


const cosine1 = new Meteor.dda.cosine(egt_r);

var iZero = -1;
var red_x = 0, red_y = 0; // start red zone
const ii = 40;
var needle_x=0, needle_y=0;
var EGT_angle = -999;

for (let i=0; i<230; i++) {
  cosine1.pulse(1);
  if (iZero < 0) {
    if (cosine1.sin.x < 44) {
      continue;
    }
    iZero = i;
    EGT_angle = Math.round((230-(iZero/2))*0.85);
  }


if (i == EGT_angle) {
    needle_x = -cosine1.sin.x; // we should make cosine works like svg axes.
    needle_y = cosine1.cos.x;
}


  //  cosine1.log('cosine1');
  if ((i-iZero)%ii == 0) {
    // draw a mark.
    var rr = 0.86;
    if ((i-iZero)/ii == 4) { // the last mark -> red
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
      case 2:
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
      case 4:
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
        // also: save that point
        red_x = -cosine1.sin.x;
        red_y = cosine1.cos.x;
      break;
    }

  }
} // all the marks on the N1


// to remove unwanted part of the circle.

svg.rect(x1,y1,egt_r+2,25).attr({
  'stroke-width': 0,
  fill: '#202020'
});


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



// Draw the needle: should be reactive.

svg.line(x1+needle_x*0.5, y1+needle_y*0.5, x1+needle_x*1.1, y1+needle_y*1.1).attr({
  'stroke-width': '5px',
  stroke: '#DDFFAA', //'#0000FF',
});


// N1  numeric N1 no borders
const voff = -5;
const xoff = -30
const wd = 58;

// Numeric data (should be reactive)

svg.text(x1+xoff+13,y1+voff+27,'85.').attr({
  'font-size': '20px',
  'font-family': 'Dosis', // 400,300,500,600,700,800
  'font-weight': 600,
  'letter-spacing': '2px',
  'fill' : '#DDFFAA',
  'stroke-width': 0.2,
  opacity: 0.75
});

svg.text(x1+xoff+44,y1+voff+27,'1').attr({
  'font-size': '17px',
  'font-family': 'Dosis', // 400,300,500,600,700,800
  'font-weight': 600,
  'letter-spacing': '2px',
  'fill' : '#DDFFAA',
  'stroke-width': 0.2,
  opacity: 0.75
});


return;


/*
*/

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





return;


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
