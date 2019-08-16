var a1 = null; // just for flaps.

const fo = new ReactiveVar();
const _a1 = new ReactiveVar();
var every_ms = null;

Template.formules.onCreated(function(){
  this.weight = new ReactiveVar(0); // this will update the W on the graphic.
});


// -------------------------------------------------------------------

const vmax_k = 300;
const dda101 = new Meteor.dda.DDA(0,200);
const dda102 = new Meteor.dda.DDA(0,vmax_k/2);
const dda103 = new Meteor.dda.DDA(0,300);

const servo101 = new Meteor.dda.servo100(1,1,1,1);
const servo102 = new Meteor.dda.servo100(1,1,1,1);
const servo103 = new Meteor.dda.servo300(1,1,1,1);
const dda104 = new Meteor.dda.DDA(0,150); // air density
const dda105 = new Meteor.dda.DDA2(vmax_k); // v::v2
//const servo105 = new Meteor.dda.servok(150);
//const servo105 = new Meteor.dda.servo200(1,1,1,1);


// FLAPS
const dda111 = new Meteor.dda.DDA(0,130*3);
const dda112 = new Meteor.dda.DDA(0,130);
const dda113 = new Meteor.dda.DDA(0,130);
const dda114 = new Meteor.dda.DDA(0,130);


dda104.x = 90.5;

var density = 1.2;
var CL = 0;
var Lw = 0;
var target_v = 0;
var ktas = 0;

const init_dda = function(){
  dda101.set(1.3/1.5);
  dda102.set(0.8);
  dda103.set(0.9/1.2);
};

const f1 = {
  dda101:dda101,
  dda102:dda102,
  dda103:dda103,
  servo101:servo101,
  servo102:servo102,
  servo103:servo103,
  dda105:dda105,
  dda104:dda104,
  dda111:dda111, // Flaps
  dda112:dda112,
  dda113:dda113,
  dda114:dda114,
  density:density,
  CL:CL, Lw:Lw, ktas
};


var pulses = 0;
const pulse = function(){
//  console.log('pulse');
  if (pulses%77 == 0) {
    f1.density = Math.round(100*(f1.density*0.5 + 0.5*(1.5*servo101.dda4.x)/servo101.dda4.k))/100;
    f1.CL = Math.round(100*((1.2*dda103.x)/dda103.k))/100;
    f1.Lw = Math.round(0.4*f1.Lw + 0.6*((1000*servo103.dda4.x)/servo103.dda4.k));
    f1.ktas = Math.round(0.4*f1.ktas + 0.6*((400*dda105.x)/dda105.k));
    f1.v = Math.round(0.4*f1.ktas + 0.6*400*(1852/3600)*(dda105.x/dda105.k));
    fo.set(f1);
  }

  dda101.pulse(1);
  dda102.x = dda105.y;
  dda102.pulse(dda101.dy);
  dda103.pulse(dda102.dy);

  // flaps
  dda111.pulse(dda102.dy); servo103.dda4.x += dda111.dy;
  dda112.pulse(dda102.dy); servo103.dda4.x += dda112.dy;
  dda113.pulse(dda102.dy); servo103.dda4.x += dda113.dy;
  dda114.pulse(dda102.dy); servo103.dda4.x += dda114.dy;

  servo101.dda4.x += dda101.dy;
  servo102.dda4.x += dda102.dy;
  servo103.dda4.x += dda103.dy;

  servo101.pulse(1);
  servo102.pulse(1);
  servo103.pulse(1);
//  servo105.pulse(1);
//  dda105.pulse(servo105.dda1.dy);
  dda105.pulse(target_v - dda105.x);
  dda102.x += dda105.dy;

  a1.pulse_flaps(1);
  a1.pulse6(1);
  _a1.set(a1);
//  console.log(' -- GG2.cos:%d',a1.G2.cos.x);
  pulses += 1;
};


Tracker.autorun(()=>{
  const d = Meteor.fsim.get('vbar-fo-density'); // we should keep float.
  console.log('>> vbar density:%f',d);
  dda101.set(d||0);
});
Tracker.autorun(()=>{
  const v = Meteor.fsim.get('vbar-fo-speed'); // we should keep float.
  console.log('>> vbar V:%f',v);
//  servo105.reset(v||0);
  target_v = Math.floor(v*dda105.k);
});
Tracker.autorun(()=>{
  const cl = Meteor.fsim.get('vbar-fo-CL'); // we should keep float.
  console.log('>> vbar CL:%f',cl);
  if (!a1) return;
  dda103.set(cl||0);
});
Tracker.autorun(()=>{
  const aoa = Meteor.fsim.get('vbar-fo-CL'); // we should keep float.
  if (!a1) return;
  console.log('>> aoa:%f =>CL:%d:100',aoa,a1.clw(aoa*100));
//  dda103.set(a1.cl||0);
});
Tracker.autorun(()=>{
//  const p = Meteor.fsim.get('flaps::actual-position'); // we should keep float.
  const p = Meteor.fsim.get('flaps::steps2go');
  console.log('>> flaps::steps2go:', p);
  if (!a1) return;

  const e = a1.requested_flaps_position - a1.actual_flaps_position;
  if (e > 0) {
    if (dda111.x < dda111.k) dda111.x += 1;
    else if (dda112.x < 0.25*dda112.k) dda112.x += 1;
    else if (dda113.x < 0.25*dda113.k) dda113.x += 1;
    else if (dda114.x < 0.25*dda114.k) dda114.x += 1;
  }
  else if (e < 0) {
    if (dda114.x > 0) dda114.x -= 1;
    else if (dda113.x > 0) dda113.x -= 1;
    else if (dda112.x > 0) dda112.x -= 1;
    else if (dda111.x > 0) dda111.x -= 1;
  }
});
Tracker.autorun(()=>{
//  const p = Meteor.fsim.get('flaps::actual-position'); // we should keep float.
  const p = Meteor.fsim.get('flaps::requested-slot');
  console.log('>> flaps::requested-slot:', p);
  if (a1)
    a1.set_flaps(p);
});


Template.formules.onRendered(function(){
  const svg_element = this.find('svg.formule');
  svg = Snap(svg_element);
  console.log(' -- svg:', svg);
  init_dda();
  a1 = new Meteor.dda.a1.v1(); // just for flaps.
  if (!every_ms)
    every_ms = Meteor.setInterval(pulse,1);

  for (let x=0; x<3000; x+=20) {
    if (x%100 == 0) {
      svg.line(x+40,0,x+40,3000).attr({
          stroke: 'rgba(100,100,100,0.45)',
          'stroke-width': '1px',
          'z-index':'-100'
          //,transform: "rotate(45 50 50)"
        });
    }
    else
    svg.line(x+40,0,x+40,3000).attr({
        stroke: 'rgba(100,255,100,0.45)',
        'stroke-width': '1px',
        'z-index':'-100'
        //,transform: "rotate(45 50 50)"
      });
  }

  for (let y=0; y<3000; y+=20) {
    if (y%100 == 0) {
      svg.line(40,y,3000,y).attr({
          stroke: 'rgba(100,100,100,0.45)',
          'stroke-width': '1px',
          'z-index':'-100'
          //,transform: "rotate(45 50 50)"
        });
    }
    else
    svg.line(40,y,3000,y).attr({
        stroke: 'rgba(100,255,100,0.45)',
        'stroke-width': '1px',
        'z-index':'-100'
        //,transform: "rotate(45 50 50)"
      });
  }


});


// --------------------------------------------------------------------

Template.formules.helpers({
  fo: function(){return fo.get();},
  a1: function(){return _a1.get();}
});
