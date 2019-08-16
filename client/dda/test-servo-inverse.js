
var svg;
var ticks = 0;
var pulses = 0;
var cycles = 0;
var this_template;

const vmax = 100;
const inv = new Meteor.dda.inverse(vmax,vmax);
const servo = new Meteor.dda.servo1(); // not soft_Servo

var dx = 1;
var x = 0;




const t_handle = function(){
//  return;
  if (pulses > 1600) return;
  if (dx == 0) return;
  const max = 1;
  for (let i=0; i<max; i++) {
//    console.log('inv2 du:%d', ((pulses%2)*2)-1);
//    inv2.log('test(1)');
    inv.log('inv2');
    servo.pulse(1);
    inv.pulse(servo.dy);

    x+= dx; pulses += 1;
//    if ((svg)&&(pulses%77 == 0)) {
      svg.rect(10 + x, 200- inv.x, 1,1); // DRAW A POINT EVERY ...
      svg.rect(10 + x, 200- servo.x, 1,1); // DRAW A POINT EVERY ...
      this_template.x2.set(10 + x);
      this_template.y2.set(200-inv.x);
//    }
    if (x == 500) {
      dx = -1;
    } else if ((inv.x == vmax)&&(dx == -1)) {
      dx = 1;
    }

    switch(x) {
      case 20: servo.x += 30; break;
      case 41: servo.x += 7; break;
      case 101: servo.x -= 20; break;
      case 121: servo.x -= 17; break;
      case 200: servo.x +=120; break;
      case 300: servo.x -=120; break;
    }
  }
}





Template.test_servo_inverse.onCreated(function(){
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


Template.test_servo_inverse.onRendered(function(){
  console.log('> Template.test_cosine (onRendered)');
  const svg_element = this.find('svg');
  svg = Snap(svg_element);
  console.log(' -- svg:', svg);
//  draw_graphic();
  var interval = Meteor.setInterval(t_handle, 1); // ms
});


Template.test_servo_inverse.helpers({
  pulses: ()=>{return Template.instance().pulses.get();},
  ticks: ()=>{return Template.instance().ticks.get();},
  time: ()=>{return Template.instance().time.get();},
  cycles: ()=>{return Template.instance().cycles.get();},
  x2: ()=>{return Template.instance().x2.get();},
  y2: ()=>{return Template.instance().y2.get();}
});
