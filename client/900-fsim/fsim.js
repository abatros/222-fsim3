
const fmax = 300;

var ticks = 0;
var seconds = 0;
var etime = 0; // elapsed time published by every_second timer.
var start_time = 0;

//const tu1 = new Meteor.dda.turbine.GE4(fmax);
const tu2 = new Meteor.turbine.GE5(fmax);
Meteor.fsim.set('tu2',tu2);

const a1 = new Meteor.dda.a1.v1();
Meteor.fsim.set('a1',a1);


var clock_enabled = false;
Tracker.autorun(function(){
  clock_enabled =  Meteor.fsim.get('clock-enabled');
  // will be used to stop/resume fsim.
  // we could use DT value instead.
});

// --- Throttle ---------------------------------------

Meteor.fsim.set('throttle',0);

Tracker.autorun(()=>{
  const throttle_position = Meteor.fsim.get('throttle');
  console.log('> Tracker (sim.js) throttle_position:%f',throttle_position);
//  tu1.set_throttle(Math.round(throttle_position*1.0));
  tu2.set_throttle(throttle_position);
})


// --- Weight ---------------------------------------

Tracker.autorun(()=>{
  const W = Meteor.fsim.get('weight');
  console.log('> Tracker (fsim.js) Weight:%d', W);
//  dda103.x = Math.round(W*0.01*dda103.k);
})

// --- Tail/Trim ---------------------------------------

Meteor.fsim.set('vbar-aoa-tail',0);
Tracker.autorun(function(){
  const vbar_aoa_tail = -Meteor.fsim.get('vbar-aoa-tail'); // we should keep float.
  a1.set_aoa_tail(vbar_aoa_tail); // float
  Meteor.fsim.set('aoa-tail', a1.aoa_tail);
  Meteor.fsim.set('aoa-tail-deg', a1.aoa_tail_deg);
  Meteor.fsim.set('a1', a1); // to update changes.
});

// --- Elevator ---------------------------------------

Meteor.fsim.set('gp-aoa-elevator',0);
Tracker.autorun(function(){
//  psim.aoa_elevator = Meteor.fsim.get('gp-aoa-elevator');
  a1.set_aoa_elevator(Meteor.fsim.get('gp-aoa-elevator'));
  console.log('> Tracker (fsim.js) a1.aoa_elevator',  a1.aoa_elevator);
  Meteor.fsim.set('aoa-elevator',a1.aoa_elevator);
  Meteor.fsim.set('a1', a1); // to update changes.
});

// --- Centrage coG ---------------------------------------

Tracker.autorun(function(){
  const coG_ratio = Meteor.fsim.get('coG-ratio'); // from vbar
  console.log('> Tracker (fsim.js) coG-ratio:%d', coG_ratio);
//  psim.set_coG_ratio(coG_ratio);
  a1.set_coG(coG_ratio);
});

// -----------------------------------------------------------------

Tracker.autorun(function(){
  const flaps_setting = Meteor.fsim.get('requested-flaps-setting');
  a1.set_flaps(flaps_setting);
});


// -----------------------------------------------------------------

var set_av = function(name, new_val){
  const x = Meteor.fsim.get(name) *0.4 + new_val*0.6
  Meteor.fsim.set(name, Math.round(x));
}



// --------------------------------------------------------------------

const DT = 5; // ms
const every_10ms = Meteor.setInterval(function(){
  if (!clock_enabled) return;
  // -- turbine --
//  tu1.pulse();
  tu2.pulse();
//  a1.dda101.x = tu1.dda3.x;
  a1.dda101.x = tu2.dda3.x;
  a1.pulse(1);
  ticks += 1;
}, DT); // ms

// --- every 1/10 second -----------------------------------------------

const every_100ms = Meteor.setInterval(function(){
  if (!clock_enabled) return;
  // update reactive variables. N1, FF, EGT, EPR
  //    Meteor.fim.set('N1', Math.round(tu1.dda3.x/2));
  //    Meteor.fsim.set('N1_rpm', tu1.dda3.x*24);
//  set_av('N1_rpm', (tu1.dda3.x/tu1.dda3.k)*10000);
//  Meteor.fsim.set('FF', tu1.dda3.x);
//  Meteor.fsim.set('FF_kgh', Math.round((tu1.dda3.x/tu1.dda3.k)*10000));
//  Meteor.fsim.set('EPR', Math.round((tu1.dda3.x/tu1.dda3.k)*100));
//  Meteor.fsim.set('EGT', Math.round((tu1.EGT/tu1.dda3.k)*80));

//  Meteor.fsim.set('v2',dsim.v2);
//  Meteor.fsim.set('thrust',dsim.thrust);
  //    Meteor.fsim.set('r/c', dsim.rc*40); // 50 units == 2000 ft/min (empirique)
  //plane.log('plane');
  //    Meteor.fsim.set('altitude', dsim.dda201.y);
//  Meteor.fsim.set('tu1', tu1);

if (!a1) return;

  Meteor.fsim.set('tu2', tu2);
  Meteor.fsim.set('a1',a1);
  Meteor.fsim.set('N1', Math.round((tu2.dda3.x/tu2.dda3.k)*100));
  Meteor.fsim.set('TAS',a1.TAS); // :1200
  Meteor.fsim.set('aoa-body', a1.aoa_body);
  Meteor.fsim.set('aoa-body-deg', a1.aoa_body_deg); // for display only
  Meteor.fsim.set('aoa-body-deg-neg', -a1.aoa_body_deg); // for display only
  Meteor.fsim.set('r/c', a1.rc); // 6000/400
  Meteor.fsim.set('KTAS-5',a1.KTAS_5); // in 1/5 kts
  Meteor.fsim.set('KTAS',Math.round(a1.KTAS_5/5)); // in kts
}, 100); // ms





// --- every second ---------------------------------------------------


const every_second = Meteor.setInterval(function(){
  if (!clock_enabled) return;

  Meteor.fsim.set('ticks',Math.floor((DT/1000)*ticks)); // 1 tick per DT
  if (start_time == 0) {
     start_time = new Date().getTime();
  }
  const etime = new Date().getTime()-start_time;
  Meteor.fsim.set('etime',Math.round(etime/1000)); // to clean.
  Meteor.fsim.set('overheat',(etime-DT*ticks)%1000); //
}, 1000); // ms
