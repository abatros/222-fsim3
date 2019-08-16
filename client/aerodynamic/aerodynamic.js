/*

https://www.chromeexperiments.com/experiment/domino => three.js terrain.  WOW,

*/

// -------------------------------------------------------------------------------------

//Session.set('N1',0); // max: 1000


Session.set('N1-mva',0); // max: 1000
Template.registerHelper("N1_mva", function () {
    return Session.get('N1-mva');
});




Session.set('fuel-flow', 0);
Template.registerHelper("fuel-flow", function () {
    return Session.get('fuel-flow'); // set with throttle.
});


Session.set('egt-celsius', 0);
Template.registerHelper("egt_celsius", function () {
    return Session.get('egt-celsius'); // set with throttle.
});


Session.set('turbine', null);
Template.registerHelper("turbine", function () {
    return Session.get('turbine'); // set with throttle.
});

Session.set('gs', null);
Template.registerHelper("gs", function () {
    return Session.get('gs'); // set with throttle.
});


Template.registerHelper("roc_ft", function () {
    return Session.get('roc-ft'); // set with throttle.
});


// -------------------------------------------------------------------------------------

const turbine = new Meteor.turbine.turbine3(); // N1, EPR, EGT, fuel-flow.

const gs = new Meteor.gs.gs1(); // Thrust - Drag - acceleration - speed.

Session.set('turbine', turbine);
Session.set('gs', gs);


Tracker.autorun(function(){ // listen to AOA.
  var aoa = Session.get('aoa'); // +/- 100
  var v2 = Session.get('gs').dda3.x; // +/- 100
  gs.roc = (v2 * aoa)/(4000); // +/- 100
  Session.set('roc-ft', Math.round(gs.roc*30));
});


Tracker.autorun(function(){ // listen to AOA.
  var cdrag = Session.get('c-drag'); // +/- 100
  if (cdrag > 100)
    cdrag = 100;
  else if (cdrag < -100)
    cdrag = -100;

  gs.dda4.x = cdrag; // turbine2
});

/*
Tracker.autorun(function(){ // listen to AOA.
  var cl = Session.get('c-lift'); // +/- 100
  if (cl > 100)
    cl = 100;
  else if (cl < -100)
    cl = -100;

  gs.dda11.x = cl;
});
**/


var throttle = 0; // 0.0 -> 1.0

Tracker.autorun(function(){ // listen to throttle changes.
  throttle = Session.get('throttle'); // [0-100]
  throttle = Math.round(throttle);
  if (throttle > 100)
    throttle = 100;
  else if (throttle < 0)
    throttle = 0;

  // we assume here: thrust (temp approx) := throttle
//  turbine.dda2.x = throttle * 10; // turbine1
  turbine.dda2.x = throttle; // turbine2
// we should pass ratio.
});

// Moving Average:
//var N1 = 0;
//var egt = 0;
var N1_rpm = 0;


var timer = 0;
var dda11 = new Meteor.dda.DDA(0,120);
var dda12 = new Meteor.dda.DDA(0,120);


var aerodynamic_pulse = function(){
  timer += 1;
  turbine.pulse(1);
  gs.dda2.x = turbine.dda3.x*5; // thrust % N1
  gs.pulse(1);

/*
  dda11.x = turbine.N1_rpm;
  dda11.pulse(1);
  dda12.pulse(1);
  dda12.x += dda11.dy;
  dda12.x -= dda12.dy;
  turbine.N1_rpm_ = dda12.x
*/

  if (timer%30 != 0) return;

  turbine.N1_ = Math.round(turbine.N1_*0.4 + turbine.N1*0.6);

  N1_rpm = Math.round(N1_rpm*0.4 + turbine.N_rpm1*0.6);
  turbine.N1_rpm_ = Math.round(turbine.N1_rpm_*0.4 + turbine.N1_rpm*0.6);


/*************** evaluer 0.01 for delta.
  if (N1_rpm > turbine.N1_rpm) {
    if (N1_rpm > turbine.N1_rpm +3) {
      turbine.N1_rpm_ = N1_rpm - 3;
    }
    else {
      turbine.N1_rpm_ += 1;
    }
  }
  else if (N1_rpm < turbine.N1_rpm) {
    if (N1_rpm < turbine.N1_rpm - 3) {
      turbine.N1_rpm_ = N1_rpm + 3;
    }
    else {
      turbine.N1_rpm_ -= 1;
    }
  }
****************/

  turbine.egt_celsius_ = Math.round(turbine.egt_celsius_*0.4 + turbine.egt_celsius*0.6);
  turbine.fuel_flow_ = Math.round(turbine.fuel_flow_*0.4 + turbine.fuel_flow*0.6);

  Session.set('thrust', turbine.dda2.x);                              // 143
//  Session.set('egt-celsius', turbine.dda3.x);  // by chance max temp: 1000*C
  Session.set('turbine', turbine); // for diagnostics
  Session.set('gs', gs); // change
}


Template.aerodynamic_station.onRendered(function(){
  console.log('> Template.aerodynamic_station.onRendered.');
  var interval = Meteor.setInterval(aerodynamic_pulse, 10);
});



// ===============================================================================
/*
Template.turbine_dda.helpers({ // => global helper
  turbine: function(){
      const turbine = Session.get('engine-dda');
      if (!turbine)
        return null;
      turbine.timer = 0; //Math.round(turbine.dda1.acc / 100);
      return turbine;
  }
});
*/
