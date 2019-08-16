/*
const h = function(){
  const x = Meteor.fsim.get('FF');
  Meteor.fsim.set('FF',x+1);
  const ff = Meteor.fsim.get('FF');
  Meteor.fsim.set('FF',ff+1);
//  console.log('> globals FF:%d',ff);
}
*/


Meteor.fsim = new ReactiveDict();


Meteor.fsim.set('dsim', null);
Template.registerHelper("dsim", function () {return Meteor.fsim.get('dsim');});

Meteor.fsim.set('tu1', null);
Template.registerHelper("tu1", function () {return Meteor.fsim.get('tu1');});

Meteor.fsim.set('a1', null);
Template.registerHelper("a1", function () {return Meteor.fsim.get('a1');});



// --- INPUT CONTROL COMMANDS

Meteor.fsim.set('throttle',0);
Template.registerHelper("throttle", function () {return Meteor.fsim.get('throttle');});


// ----------------------------------

Meteor.fsim.set('FF',0); // fuel-flow
Template.registerHelper("FF", function () {return Meteor.fsim.get('FF');});

Meteor.fsim.set('FF_kgh',0); // fuel-flow
Template.registerHelper("FF_kgh", function () {return Meteor.fsim.get('FF_kgh');});

Meteor.fsim.set('N1',0); // rpm turbine
Template.registerHelper("N1", function () {return Meteor.fsim.get('N1');});

Meteor.fsim.set('N1_rpm',0); // rpm turbine
Template.registerHelper("N1_rpm", function () {return Meteor.fsim.get('N1_rpm');});

Meteor.fsim.set('EPR',0);
Template.registerHelper("EPR", function () {return Meteor.fsim.get('EPR');});

Meteor.fsim.set('EGT',0);
Template.registerHelper("EGT", function () {return Meteor.fsim.get('EGT');});

Meteor.fsim.set('IAS',0); // Indicated Air Speed
Template.registerHelper("IAS", function () {return Meteor.fsim.get('IAS');});

Meteor.fsim.set('thrust',0); // dsim
Template.registerHelper("thrust", function () {return Meteor.fsim.get('thrust');});

Meteor.fsim.set('v2',0); // dsim
Template.registerHelper("v2", function () {return Meteor.fsim.get('v2');});

Meteor.fsim.set('r/c',0); // psim
Template.registerHelper('rc', function () {return Meteor.fsim.get('r/c');});
Template.registerHelper('rc_ft', function () {return Meteor.fsim.get('r/c');});

Meteor.fsim.set('weight_',0);
Template.registerHelper("weight", function () {
    return Meteor.fsim.get('weight_');
  });

Meteor.fsim.set('altitude',0);
Template.registerHelper("altitude", function () {return Meteor.fsim.get('altitude');});

Meteor.fsim.set('bank-angle',0); // psim
Template.registerHelper("bank_angle", function () {return Meteor.fsim.get('bank-angle');});


// --- Centrage ---

Meteor.fsim.set('coG-ratio',25*3); // default value
Template.registerHelper("coG_ratio", function () {return Meteor.fsim.get('coG-ratio');});

Meteor.fsim.set('coG',0);
Template.registerHelper("coG", function () {return Meteor.fsim.get('coG');});

Meteor.fsim.set('coLw',0);
Template.registerHelper("coLw", function () {return Meteor.fsim.get('coLw');});
Meteor.fsim.set('coLw-ratio',0); // in % of (coLe-coG)
Template.registerHelper("coLw_ratio", function () {return Meteor.fsim.get('coLw-ratio');});

Meteor.fsim.set('coLt',0);
Template.registerHelper("coLt", function () {return Meteor.fsim.get('coLt');});

Meteor.fsim.set('coLt-ratio',0); // in % of (coLe-coG)
Template.registerHelper("coLt_ratio", function () {return Meteor.fsim.get('coLt-ratio');});

// following are just for display in Centrage
Meteor.fsim.set('cl-wing',0);
Template.registerHelper('cl_wing', function () {return Meteor.fsim.get('cl-wing');});

Meteor.fsim.set('Lw',0);
Template.registerHelper('Lw', function () {return Meteor.fsim.get('Lw');});

Meteor.fsim.set('cl-tail',0);
Template.registerHelper('cl_tail', function () {return Meteor.fsim.get('cl-tail');});
Meteor.fsim.set('cl-elevator',0);
Template.registerHelper('cl_elevator', function () {return Meteor.fsim.get('cl-elevator');});

Meteor.fsim.set('pitch-angle', 0);

// =======================================================================

Meteor.fsim.set('aoa-aileron',0);  // => bank : roll axis
Template.registerHelper("aoa_aileron", function () {return Meteor.fsim.get('aoa-aileron');});

Meteor.fsim.set('aoa-body',0); // psim
Template.registerHelper("aoa_body", function () {return Meteor.fsim.get('aoa-body');});

Meteor.fsim.set('aoa-body-deg',0); // psim
Template.registerHelper("aoa_body_deg", function () {return Meteor.fsim.get('aoa-body-deg');});
Template.registerHelper("aoa_body_deg_neg", function () {return -Meteor.fsim.get('aoa-body-deg');});

Meteor.fsim.set('aoa-elevator',0);  // => elevator horizontal stabilizer : pitch axis
Template.registerHelper("aoa_elevator", function () {return Meteor.fsim.get('aoa-elevator');});
Template.registerHelper("aoa_elevator_deg", function () {return Math.round((150/300)*Meteor.fsim.get('aoa-elevator')/10);});

Meteor.fsim.set('aoa-rudder',0); // => vertical stabilizer : yaw axis
Template.registerHelper("aoa_rudder", function () {return Meteor.fsim.get('aoa-rudder');});

Meteor.fsim.set('aoa-tail',0);      // => horizontal stabilizer : pitch axis
// ATTN: positive angles are PULL (UP) opposite convention for SVG.
Template.registerHelper('aoa_tail', function () {return Meteor.fsim.get('aoa-tail');});
Template.registerHelper('aoa_tail_deg', function () {return Meteor.fsim.get('aoa-tail-deg');});
Template.registerHelper('aoa_tail_deg_neg', function () {return -Meteor.fsim.get('aoa-tail-deg');});

// ---C---

Meteor.fsim.set('clock-enabled', false); // real etime
Template.registerHelper('clock_enabled', function () {return Meteor.fsim.get('clock-enabled');});

// --- E ---

Meteor.fsim.set('etime', 0); // real etime
Template.registerHelper('etime', function () {return Meteor.fsim.get('etime');});

// --- F ---

Meteor.fsim.set('flaps::steps2go', 0);
Meteor.fsim.set('flaps::requested-slot',0);

// --- K ---

Meteor.fsim.set('KTAS', 0); // TAS in kts.
Template.registerHelper('KTAS', function () {return Meteor.fsim.get('KTAS');});

// --- O ---

Meteor.fsim.set('overheat', 0); // in ms [0...1000] behind the clock
Template.registerHelper('overheat', function () {return Meteor.fsim.get('overheat');});

// --- R ---


// --- T ---

Meteor.fsim.set('TAS', 0); // TAS in DDA units. (dv)
Template.registerHelper('TAS', function () {return Meteor.fsim.get('TAS');});

Meteor.fsim.set('ticks', 0); // etime from fsim timer
Template.registerHelper('ticks', function () {return Meteor.fsim.get('ticks');});
