
var svg;
var ticks = 0;
var pulses = 0;
var cycles = 0;
var this_template;

const vmax = 300;
const inv = new Meteor.dda.inverse2(vmax);
//const inv = new Meteor.dda.servo_inverse(100);

var dx = 1;
var x = 0;

const t_handle = function(){
  if (pulses > 1000000) return;
  /*
  if (ticks == 50) {tu.dda2.x = 100;}
  if (ticks == 300) {tu.dda2.x = 0;}
*/
  const max = 1;

  for (let i=0; i<max; i++) {
    inv.pulse(dx); x += dx; pulses += 1;
    inv.log('test');

    if (x >= 1000) {
      dx = -1;
    } else if (x <= 100) {
      dx = +1;
    }
  }

  this_template.pulses.set(pulses);
  this_template.x2.set(10 + x);
  this_template.y2.set(400-inv.dda2.x);

//  if (ticks%10 == 0) { // add a point every sec.
    if (svg) {
      svg.rect(10 + x, 400- inv.dda1.x, 1,1); // DRAW A POINT EVERY ...
      svg.rect(10 + x, 400- inv.dda2.x, 1,1).attr({stroke:'blue'}); // DRAW A POINT EVERY ...
//      svg.rect(10 + x, 400- inv.acc, 1,1).attr({stroke:'green'}); // DRAW A POINT EVERY ...
    }
//  }

};


const t_handle2 = function(){
  if (pulses > 1000000) return;
  const max = 377;
  for (let i=0; i<max; i++) {
    inv.pulse(dx); x += dx; pulses += 1;
    inv.log('test');
    if ((svg)&&(pulses%77 == 0)) {
      svg.rect(10 + x/10, 400- inv.dda1.x, 1,1);
//      svg.rect(10 + x/10, 400- inv.dda2.x, 1,1).attr({stroke:'blue'});
      this_template.x2.set(10 + x/10);
      this_template.y2.set(400-inv.dda1.x);
    }
    if (x >= 400*10) {
      dx = -1;
    } else if (x <= 0) {
      dx = +1;
    }
  }
}


Template.test_inverse2.onCreated(function(){
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


Template.test_inverse2.onRendered(function(){
  console.log('> Template.test_cosine (onRendered)');
  const svg_element = this.find('svg');
  svg = Snap(svg_element);
  console.log(' -- svg:', svg);
//  draw_graphic();
  var interval = Meteor.setInterval(t_handle2, 1); // ms
});


Template.test_inverse2.helpers({
  pulses: ()=>{return Template.instance().pulses.get();},
  ticks: ()=>{return Template.instance().ticks.get();},
  time: ()=>{return Template.instance().time.get();},
  cycles: ()=>{return Template.instance().cycles.get();},
  x2: ()=>{return Template.instance().x2.get();},
  y2: ()=>{return Template.instance().y2.get();}
});
