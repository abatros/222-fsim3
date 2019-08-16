
var svg1; // static
var svg2; // recorder
var ticks = 0;
var pulses = 0;
var cycles = 0;
var this_template;

var a1 = null;
var tu2 = null;

// ------------------------------------------------------------------

Template.dash.onCreated(function(){
  console.log('> Template.test_psim (onCreated)');
//  this.weight = new ReactiveVar(0); // this will update the W on the graphic.
  this.ticks = new ReactiveVar(0);
  this.time = new ReactiveVar(0);
  this.cycles = new ReactiveVar(0);
  this.pulses = new ReactiveVar(0);
  this_template = this;
});


var fsim_time = 0;


console.log('######### starting Tracker dash.js');

Tracker.autorun(function(){
  a1 = Meteor.fsim.get('a1');
  tu2 = Meteor.fsim.get('tu2');
});


Template.dash.onRendered(function(){
  console.log('> Template.dash (onRendered)');
  const svg_element = this.find('svg.test-psim');
  svg2 = Snap(svg_element);
  svg1 = Snap(this.find('svg.base'));
  ticks = 0;
});



Template.dash.helpers({
  pulses: ()=>{return Template.instance().pulses.get();},
  ticks: ()=>{return Template.instance().ticks.get();},
  time: ()=>{return Template.instance().time.get();},
  cycles: ()=>{return Template.instance().cycles.get();},
  x_origin: ()=>{return 500;},
  this_aoa_tail: ()=>{
    const psim = Meteor.fsim.get('psim');
    if (psim) {
      return psim.aoa_tail;
    }
  },
  tu2: ()=>{return Meteor.fsim.get('tu2');},
  a1: ()=>{return Meteor.fsim.get('a1');}
});
