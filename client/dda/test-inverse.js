
var svg;
var ticks = 0;
var pulses = 0;
var cycles = 0;
var this_template;

const vmax = 100;
const inv = new Meteor.dda.inverse(vmax,vmax);
const inv2 = new Meteor.dda.inverse(vmax,vmax);

//const inv = new Meteor.dda.servo_inverse(100);

var dx = 1;
var x = 0;


const _t_handle = function(){
  if (pulses > 100) return;
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
  this_template.y2.set(400-inv.dda1.x);

//  if (ticks%10 == 0) { // add a point every sec.
    if (svg) {
      svg.rect(10 + x, 400- inv.dda1.x, 1,1);
      svg.rect(10 + x, 400- inv.dda1.y, 1,1).attr({stroke:'blue'});
//      svg.rect(10 + x, 400- inv.acc, 1,1).attr({stroke:'green'});
    }
//  }

};

/*
for (let i=0; i<515; i++) {
  inv.pulse(1); inv.log('test');
}

for (let i=0; i<515; i++) {
  inv.pulse(-1); inv.log('test');
}
*/


const t_handle = function(){
//  return;
  if (pulses > 100) return;
  if (dx == 0) return;
  const max = 777;
  for (let i=0; i<max; i++) {
//    console.log('inv2 du:%d', ((pulses%2)*2)-1);
//    inv2.log('test(1)');
    inv2.log('inv2');
    inv2.pulse(((pulses%2)*2)-1);

    inv.pulse(dx); x+= dx; pulses += 1;
//    if ((svg)&&(pulses%77 == 0)) {
      svg.rect(10 + x, 200- inv.x, 1,1); // DRAW A POINT EVERY ...
      svg.rect(10 + x, 500- inv2.x, 1,1); //.attr({stroke:'blue'}); // DRAW A POINT EVERY ...
      this_template.x2.set(10 + x);
      this_template.y2.set(200-inv.x);
//    }
    if (x == 500) {
      dx = -1;
    } else if ((inv.x == vmax)&&(dx == -1)) {
      dx = 1;
    }

    switch(x) {
      case 21: inv2.x += 1; break;
      case 40: inv2.x += 1; break;
      case 60: inv2.x -= 1; break;
      case 80: inv2.x -= 1; break;
    }
  }
}





Template.test_inverse.onCreated(function(){
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


Template.test_inverse.onRendered(function(){
  console.log('> Template.test_cosine (onRendered)');
  const svg_element = this.find('svg');
  svg = Snap(svg_element);
  console.log(' -- svg:', svg);
//  draw_graphic();
  var interval = Meteor.setInterval(t_handle, 1); // ms
});


Template.test_inverse.helpers({
  pulses: ()=>{return Template.instance().pulses.get();},
  ticks: ()=>{return Template.instance().ticks.get();},
  time: ()=>{return Template.instance().time.get();},
  cycles: ()=>{return Template.instance().cycles.get();},
  x2: ()=>{return Template.instance().x2.get();},
  y2: ()=>{return Template.instance().y2.get();}
});
