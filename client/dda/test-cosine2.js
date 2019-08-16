/*
    Simulate pendule:  cosine back and forth


*/
var svg;
var ticks = 0;
var pulses = 0;
var cycles = 0;
var this_template;
const xx = new Meteor.dda.cosine(200);

if (false) { // using DDA M1
  xx.cos.acc = 49;
  xx.sin.acc = 49
}

var da = 1;

const t_handle2 = function(){
  const max = 1; //Math.round(100*2*3.1416);
  for (let i=0; i<max; i++) {
    cosine.pulse(da);
    if ((cosine.sin.x == 0)&&(cosine.cos.x > 0)) {
      cycles += 1;
      this_template.cycles.set(cycles);
    }
//    if (cosine.cos.x *2 < cosine.cos.k) {
//      da = -da;
//    }
  //if (cosine.cos.x == 0) da=-da;
  }
  pulses += max;
  this_template.pulses.set(pulses);
  this_template.x2.set(500+cosine.cos.x);
  this_template.y2.set(500+cosine.sin.x);

  if (svg) {
    svg.rect(500+cosine.cos.x, 500+cosine.sin.x, 1,1); // DRAW A POINT EVERY ...
  }

};


var ua = 0;

const t_handle = function(){
  const imax = 177;
  for (let i=0; i<imax; i++) {
    xx.pulse(1);
    if ((xx.sin.x == 0)&&(xx.cos.x > 0)) {
      cycles += 1;
      this_template.cycles.set(cycles);
      this_template.na.set(Math.round(1000*(pulses/cycles))/1000);
    }
  }
  pulses += imax;
  this_template.pulses.set(pulses);
  this_template.x2.set(500+xx.cos.x+5);
  this_template.y2.set(500+xx.sin.x+5);

  if (svg) {
      svg.rect(500+xx.cos.x, 500+xx.sin.x, 1,1); // DRAW A POINT EVERY ...
  }
};





Template.test_cosine2.onCreated(function(){
  console.log('> Template.test_cosine (onCreated)');
//  this.weight = new ReactiveVar(0); // this will update the W on the graphic.
  this.ticks = new ReactiveVar(0);
  this.time = new ReactiveVar(0);
  this.cycles = new ReactiveVar(0);
  this.pulses = new ReactiveVar(0);
  this.x2 = new ReactiveVar(0);
  this.y2 = new ReactiveVar(0);
  this.na = new ReactiveVar(0);
  this_template = this;
});


Template.test_cosine2.onRendered(function(){
  console.log('> Template.test_cosine (onRendered)');
  const svg_element = this.find('svg');
  svg = Snap(svg_element);
  console.log(' -- svg:', svg);
//  draw_graphic();
  var interval = Meteor.setInterval(t_handle, 1); // ms
});


Template.test_cosine2.helpers({
  pulses: ()=>{return Template.instance().pulses.get();},
  ticks: ()=>{return Template.instance().ticks.get();},
  time: ()=>{return Template.instance().time.get();},
  cycles: ()=>{return Template.instance().cycles.get();},
  x2: ()=>{return Template.instance().x2.get();},
  y2: ()=>{return Template.instance().y2.get();},
  na: ()=>{return Template.instance().na.get();}
});
