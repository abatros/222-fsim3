/*
http://www.meriweather.com/flightdeck/777/fwd/pfd.html
https://www.youtube.com/watch?v=1TbLaYbGtwo   Autoland
*/

// ---------------------------------------------------------------

Meteor.fsim.set('bank-angle', 0);

var bank_req = 0;
var actual_bank = 0;
var ror = 0; // tests

const h_roll = function(){ // only for test.
  bank_req += ror;
//  const da = Math.round(bank_req - actual_bank);
  const da = bank_req - actual_bank;

//  console.log('>> servo bank actual:%d => %d (ror:%d) da:', actual_bank, bank_req, ror, da);

  if (da > 0.1) {
    actual_bank += 0.1;
    Meteor.fsim.set('bank-angle', actual_bank);
  }
  else if (da < -0.1) {
    actual_bank -= 0.1;
    Meteor.fsim.set('bank-angle', actual_bank);
  }

};

setInterval(h_roll, 1); // refresh each 10 ms

Tracker.autorun(function(){ // for tests.
  ror = Meteor.fsim.gp.get('roll')*0.1; //60;
  // first approx: this is the rate or roll requested from pilot
  // each dt we add the reading from gamepad.
  // when ror == 0  the bank should not move.
//  console.log('>> Tracker bank actual:%d => %d (ror:%d)', actual_bank, bank_req, ror);
});


// ---------------------------------------------------------------

var pitch_req = 0;
var actual_pitch = 0;
var rop = 0; // tests

const h_pitch = function(){ // only for test.
  pitch_req += rop;
//  const da = Math.round(bank_req - actual_bank);
  const da = pitch_req - actual_pitch;

//  console.log('>> servo bank actual:%d => %d (ror:%d) da:', actual_bank, bank_req, ror, da);

  if (da > 0.1) {
    actual_pitch += 0.1;
    Meteor.fsim.set('pitch-angle', actual_pitch);
  }
  else if (da < -0.1) {
    actual_pitch -= 0.1;
    Meteor.fsim.set('pitch-angle', actual_pitch);
  }

};

setInterval(h_pitch, 1); // refresh each 1 ms


// ---------------------------------------------------------------

Template.pfd2.onCreated(function(){
  console.log('> Template.pfd2 (onCreated)');
});


Session.set('pfd2-pitch',0);

var hh = 0;
var h = function(){
//  console.log(' -- pfd2 hh:%d',hh);
  Session.set('pfd2-pitch',hh++);
//  console.log(' -- pfd2 =>:%d',Session.get('pfd2-pitch'));
}



Template.pfd2.onRendered(function(){
  console.log('> Template.pfd2 (onRendered)');
  const element = this.find('svg');
  svg = Snap(element);
  if (!svg) {
    throw new Meteor.error('Unable to locate svg');
  }
//setInterval(h,500);
});



Template.pfd2.helpers({
  'pitch': ()=>{
    let p = Meteor.fsim.get('aoa-body'); // in d(aoa) NOT deg.
//    let deg100 = p*100;
//    console.log('>> pitch(aoa):%d  p:%d',deg100, p);
    return p/10; // Math.round(p*8*1000)/1000; // 8 pixels for 1 deg.
  }
});

Template.pfd2.helpers({
  'y_rotation': ()=>{
//    const y = 450 - Meteor.fsim.gp.get('pitch')*200;
    const y = 450 - Meteor.fsim.get('aoa-elevator')*1; //200;
//    console.log('>>>>>>> pfd2 helper PITCH:',y);
    return y;
  }
});



Template.pfd2.helpers({
  'roll': ()=>{
//    const y = Meteor.fsim.gp.get('roll')*60;
    const y = Meteor.fsim.get('bank-angle')*1; //60;
//    console.log('>>>>>>> pfd2 helper PITCH:',y);
    return -y;
  }
});


Template.pfd2.helpers({
  a10: ()=>{return {x1:200*Math.sin(Math.PI/18), y1:-200*Math.cos(Math.PI/18),
    x2:200*Math.sin(Math.PI/18)*0.95, y2:-200*Math.cos(Math.PI/18)*0.95}},
  a20: ()=>{return {x1:200*Math.sin(Math.PI/9), y1:-200*Math.cos(Math.PI/9),
    x2:200*Math.sin(Math.PI/9)*0.95, y2:-200*Math.cos(Math.PI/9)*0.95}},
  a30: ()=>{return {x1:200*Math.sin(Math.PI/6), y1:-200*Math.cos(Math.PI/6),
    x2:200*Math.sin(Math.PI/6)*0.95, y2:-200*Math.cos(Math.PI/6)*0.95}},
  a45: ()=>{return {x1:200*Math.sin(Math.PI/4), y1:-200*Math.cos(Math.PI/4),
    x2:200*Math.sin(Math.PI/4)*0.95, y2:-200*Math.cos(Math.PI/4)*0.95}},
  a60: ()=>{return {x1:200*Math.sin(Math.PI/3), y1:-200*Math.cos(Math.PI/3),
    x2:200*Math.sin(Math.PI/3)*0.95, y2:-200*Math.cos(Math.PI/3)*0.95}},
  a90: ()=>{return {x1:200*Math.sin(Math.PI/2), y1:-200*Math.cos(Math.PI/2),
    x2:200*Math.sin(Math.PI/2)*0.95, y2:-200*Math.cos(Math.PI/2)*0.95}}
});
