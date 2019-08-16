
var svg;
var ticks = 0;
var pulses = 0;
var cycles = 0;
var this_template;

const fmax = 300;
const ratio = 300/fmax; // pixels
/*
  => stable when (fmax = drag) => (fmax == kv2)
  but max drag is only 0.5 v2 => do not thrust more tha 50% of fmax.
  => in GE4(200), T must be 100 max => 50%
*/
const tu = new Meteor.dda.turbine.GE4(fmax);
//tu.dda2.x = 100;

const t_handle = function(){
  if (pulses > 100000) return;
//  tu.vlog('GE4-vlog(1)');

  if (ticks == 50) {tu.dda2.x = 100;}
  if (ticks == 200) {tu.dda2.x = 0;}

  if ((pulses%37 == 0)) { // sampling
//    console.log('> t_handle pulses:%d', pulses);
    this_template.x2.set(10 + ticks);
    this_template.y2.set(400 - tu.N1*ratio*0.5);
    this_template.ticks.set(ticks);
    if (svg) {
      svg.rect(10+ticks, 400-tu.N1*ratio*0.5, 1,1); // N1
      svg.rect(10+ticks, 400-tu.dda2.x*ratio, 1,1).attr({stroke:'green'}); // Thrust
      svg.rect(10+ticks, 400-tu.dda9.x*ratio, 1,1); //.attr({stroke:'#00FFFF'}); // k1/V
      svg.rect(10+ticks, 400-tu.servo.x*ratio, 1,1); //.attr({stroke:'#FF00FF'});
//      svg.rect(10+ticks, 400-tu.dda5.x*ratio, 1,1).attr({stroke:'blue'});  // kv2
//      svg.rect(10+ticks, 400-tu.dda7.x*ratio, 1,1).attr({stroke:'#FF00FF'}); // kV

    }
    ticks += 1;
  }

  tu.pulse();
//  tu.log('GE4');
//  tu.xlog('GE4');
//  tu.vlog('GE4-vlog(2)');
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

Template.test_turbine.onCreated(function(){
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


Template.test_turbine.onRendered(function(){
  console.log('> Template.test_cosine (onRendered)');
  const svg_element = this.find('svg');
  svg = Snap(svg_element);
  console.log(' -- svg:', svg);
//  draw_graphic();
  var interval = Meteor.setInterval(t_handle, 1); // ms
});


Template.test_turbine.helpers({
  pulses: ()=>{return Template.instance().pulses.get();},
  ticks: ()=>{return Template.instance().ticks.get();},
  time: ()=>{return Template.instance().time.get();},
  cycles: ()=>{return Template.instance().cycles.get();},
  x2: ()=>{return Template.instance().x2.get();},
  y2: ()=>{return Template.instance().y2.get();}
});
