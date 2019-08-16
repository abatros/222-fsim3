
var svg;
var ticks = 0;
var pulses = 0;
var cycles = 0;
var this_template;

const vmax = 300;
const v2 = new Meteor.dda.DDA2(vmax);

var dv = 1; // d(v2) = 2v.dv


const t_handle2 = function(){

  const max = 777; //Math.round(100*2*3.1416);
  for (let i=0; i<max; i++) {
    if ((v2.x >= vmax)) {
      dv = -1;
      console.log('> flip direction dv:%d', dv);
    } else
    if ((v2.x <= -vmax)){
      dv = +1;
      console.log('> flip direction dv:%d', dv);
    }
    v2.pulse(dv);
    v2.log('v2')
  }
  pulses += max;
  this_template.pulses.set(pulses);
  this_template.x2.set(400+v2.x);
  this_template.y2.set(400-v2.y);

  if (ticks%10 == 0) { // add a point every sec.
    if (svg) {
      svg.rect(400+v2.x, 400-v2.y, 1,1); // DRAW A POINT EVERY ...
    }
  }
};


Template.test_square.onCreated(function(){
  console.log('> Template.test_cosine (onCreated)');
//  this.weight = new ReactiveVar(0); // this will update the W on the graphic.
  this.ticks = new ReactiveVar(0);
  this.time = new ReactiveVar(0);
  this.cycles = new ReactiveVar(0);
  this.pulses = new ReactiveVar(0);
  this.x2 = new ReactiveVar(0);
  this.y2 = new ReactiveVar(0);
  this_template = this;
});


Template.test_square.onRendered(function(){
  console.log('> Template.test_cosine (onRendered)');
  const svg_element = this.find('svg');
  svg = Snap(svg_element);
  console.log(' -- svg:', svg);
//  draw_graphic();
  var interval = Meteor.setInterval(t_handle2, 1); // ms
});


Template.test_square.helpers({
  pulses: ()=>{return Template.instance().pulses.get();},
  ticks: ()=>{return Template.instance().ticks.get();},
  time: ()=>{return Template.instance().time.get();},
  cycles: ()=>{return Template.instance().cycles.get();},
  x2: ()=>{return Template.instance().x2.get();},
  y2: ()=>{return Template.instance().y2.get();}
});
