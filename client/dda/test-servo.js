
var svg;
var ticks = 0;
var pulses = 0;
var cycles = 0;
var this_template;

const vmax = 300;
const sv = new Meteor.dda.soft_Servo();

const t_handle = function(){
  if (ticks > 1000) return;
  if (ticks == 50) {sv.add(1);}
  if (ticks == 100) {sv.add(1);}
  if (ticks == 150) {sv.add(-1);}
  if (ticks == 200) {sv.add(-1);}
  if (ticks == 250) {sv.add(+40);}
  if (ticks == 350) {sv.add(-40);}

  if ((true) || (pulses%10 == 0)) {
//    console.log('> t_handle pulses:%d', pulses);
    this_template.x2.set(10 + ticks);
    this_template.y2.set(400 - sv.y*3); // sum of dy
    this_template.ticks.set(ticks);
    if (svg) {
      svg.rect(10+ticks, 400-sv.y*3, 1,1); // DRAW A POINT EVERY ...
//      svg.rect(10+ticks, 400-sv.dda2.x, 1,1).attr({stroke:'blue'}); // DRAW A POINT EVERY ...
//      svg.rect(10+ticks, 400-sv.dda2.y, 1,1).attr({stroke:'#00FFFF'}); // DRAW A POINT EVERY ...
    }
    ticks += 1;
  }

  sv.pulse();
  sv.log('test');
  pulses += 1;
};

/******************
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
******************/

Template.test_servo.onCreated(function(){
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


Template.test_servo.onRendered(function(){
  console.log('> Template.test_cosine (onRendered)');
  const svg_element = this.find('svg');
  svg = Snap(svg_element);
  console.log(' -- svg:', svg);
//  draw_graphic();
  var interval = Meteor.setInterval(t_handle, 1); // ms
});


Template.test_servo.helpers({
  pulses: ()=>{return Template.instance().pulses.get();},
  ticks: ()=>{return Template.instance().ticks.get();},
  time: ()=>{return Template.instance().time.get();},
  cycles: ()=>{return Template.instance().cycles.get();},
  x2: ()=>{return Template.instance().x2.get();},
  y2: ()=>{return Template.instance().y2.get();}
});
