
var svg;
var ticks = 0;
var pulses = 0;
var cycles = 0;
var this_template;
const cosine = new Meteor.dda.cosine(100);
if (true) { // using DDA M1
  cosine.cos.acc = 49;
  cosine.sin.acc = 49
}


const t_handle = function(){
  const max = 777; //Math.round(100*2*3.1416);
  for (let i=0; i<max; i++) {
    cosine.pulse(1);
    if ((cosine.sin.x == 0)&&(cosine.cos.x > 0)) {
      cycles += 1;
      this_template.cycles.set(cycles);
    }
  }
  pulses += max;
  this_template.pulses.set(pulses);
  this_template.x2.set(500+cosine.cos.x*3);
  this_template.y2.set(500+cosine.sin.x*3);

  if (svg) {
    svg.rect(500+cosine.cos.x*3, 500+cosine.sin.x*3, 1,1); // DRAW A POINT EVERY ...
  }

};

Template.test_cosine.onCreated(function(){
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


Template.test_cosine.onRendered(function(){
  console.log('> Template.test_cosine (onRendered)');
  const svg_element = this.find('svg');
  svg = Snap(svg_element);
  console.log(' -- svg:', svg);
//  draw_graphic();
  var interval = Meteor.setInterval(t_handle, 1); // ms
});


Template.test_cosine.helpers({
  pulses: ()=>{return Template.instance().pulses.get();},
  ticks: ()=>{return Template.instance().ticks.get();},
  time: ()=>{return Template.instance().time.get();},
  cycles: ()=>{return Template.instance().cycles.get();},
  x2: ()=>{return Template.instance().x2.get();},
  y2: ()=>{return Template.instance().y2.get();}
});
