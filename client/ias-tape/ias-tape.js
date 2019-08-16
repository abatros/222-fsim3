
var ias = 0;

var svg; // only 1 ias-tape.


var ias_target = 0;
var ias_actual = 0;

const handle = function(){ // refresh at 60fp
    const dv = ias_target - ias_actual;
    if (dv == 0)
      return;

    if ((dv > 10) || (dv < -10)) {
      console.log('> ALERT ias-tape dv:%d',dv);
    }

    if (dv > 1) ias_actual += 1;
    else if (dv < -1) ias_actual -=1;
    else return;
    svg.clear();
    draw_speed_tape(ias_actual);
}


const ias2kts = 2; // each IAS unit is 1/3 kts
var KTAS_fp = 0;
var vmax = 0;
var TAS_max = 0;

Tracker.autorun(function () {
  const a1 = Meteor.fsim.get('a1');
  if (!a1) return;

  const TAS = Meteor.fsim.get('TAS'); // in dda units = dv = 600/5400 kts = 0.1 kts
  vmax = a1.vmax; // => resolution : 1/vmax
  TAS_max = a1.TAS_max;
  // here we need 2 conversions (1) TAS -> KTAS (2) KTAS -> pixels
  KTAS_fp = TAS * (TAS_max/vmax); // floatp

  // (2) 1px = 128 KTAS / 420 => 1 KTAS = (420/128) px = (105/32) px =~ 3 px
  // if we want to get 600 KTAS max, each dv = 600 kts/vmax = 600/1800 = 1/3 px
  // to get 128 KTAS we need (vmax/600)*128 = (1800/600)*128 = 430 dv
  // => 1dv == 1px
  // if we want 10 dv == 1 px => vmax := 18,000 !!!
  // good ratio could be 1 px = 3 dv => vmax = 5400.

/*
  const ias_kts = Math.round(100*TAS*(a1.TAS_max/vmax))/100; // each IAS unit is 1/3 kts
//  console.log('> Tracker (ias-tape.js) ias(kts):%d [%d:%d]', ias_kts, ias, 300);
    // replace svg
    ias_target = ias_kts;
*/

    // refresh when speed change - should we limit ?
//    svg.clear();
//    draw_speed_tape(KTAS_fp);
  });



Template.ias_tape.onCreated(function(){
});

Template.ias_tape.onRendered(function(){
  const element = this.find('svg');
  svg = Snap(element);
  if (!svg) {
    throw new Meteor.error('Unable to locate svg');
  }

// -----------------------------------------------------------------------
//  svg.clear();
//  draw_speed_tape(0);

  // var interval = Meteor.setInterval(handle, 15); // ms

// -----------------------------------------------------------------------

/*
    tape display 1kt = 3.5 px
    we need change in speed for each pixel.
    => we need speed in 1/3 of kts.
    Since vmax = 800 kts => speed in [0..2400];
*/
});

/*
const mk = [];
for (let i=16 ; i>=0; i--) {
  mk.push({v:i*10});
}
*/

Template.ias_tape.helpers({
  y0: ()=>{
    const v = Meteor.fsim.get('KTAS-5'); // 1/5 kts
    const v20 = Math.floor(v/100)*100; // 100 = 20kts*5
    const delta_v = v - v20; // always >0
    let y0 = -30 + Math.round(100*(3/5)*(delta_v))/100;
//    console.log(' -- ias_tape v:%d v20:%d y0:%d',v,v20,y0);
    Meteor.fsim.set('KTAS-20', Math.floor(v20/5)); // rounded to nearest 20kts
    return y0;
  },
  mkv: (i)=>{
    const v20 = Meteor.fsim.get('KTAS-20'); // rounded to nearest 20kts and in kts
    const iret = v20 + 80 - i*10;
//    console.log(' -- mkv(%d):%d  [v20:%d]',i,iret,v20);
    return iret;
  }
});

// ------------------------------------------------------------------

const ht_panel = 420;
const delta_kts = 64; // plus-minus total 256

// kts-to-pixels 128kts = 420px
// 0.33kts-to-pixels
// each dv = 1/3 kts. ATT

const r = 420/128; // px = -70*r + v*r = (v-70)*r
const yref = 64*3*r;
// draw from ias-128kts -> ias+128kts

// -------------------------------------------------------------------

var draw_speed_tape = function(ias) { // ias: kts as float.
  if (!svg) return;

//  elapsed_time();
//  console.time("draw-speed-tape");
  var start = new Date().getTime();


  svg.clear();

// step 1: get multiple 10 kts above ias until ias + 70kts (64kts++)
// or multiple 30 above ias plus 210

//const vi = Math.round((ias+15)/30)*30 +70*3;
const vi = Math.floor((ias + 70)/10)*10;
//console.log(' draw_speed_tage ias:%d', ias);
//console.log(' -- vi:%d', vi);

// step 2: position v1 on the canvas.
//const yi = 210 - (ias-vi)*r;
const yi = 210 - (vi-ias)*r;
//console.log(' -- yi:%d', yi);

//  var xref=570; yref=10;
//  var xref=-5; yref=10;
  var x=0; y=0; ht=420+30;
  // height 420 should be computed.


//for (let v=ias-64; v <= ias+64; v+=10) {
for (let v=vi; v >= vi-128-10; v-=10) {
//  const y = yi + (vi-v)*r;
//  const y = 210 - (vi-ias)*r + (vi-v)*r;
//  const y = 210 + (ias)*r - (v)*r;
  const y = 210 + (ias-v)*r;

//  console.log(' -- v:%d:%d y:%d:%d',v, vi, y, yi);
  svg.line(50,y, 70,y).attr({
    stroke: 'white', 'stroke-width':'1px'
  });
  if (v%20 == 0) {
    svg.text(45, y+8, (Math.round(v)).toString()).attr({
      'font-size': '22px',
      'font-family': 'Droid Sans Mono', // 400,300,500,600,700,800
      'font-weight': 600,
      'letter-spacing': '1px',
      'fill' : 'white',
      'stroke': '#505050',
      'stroke-width': 1,
      'text-anchor': 'end',
      opacity: 0.75
    });
  }

}

  svg.line(2,210,75-2,210).attr({stroke:'#AAFFDD', 'stroke-width': '2px', opacity:0.5});
//  console.log(' -- etime in draw speed tape :%d',elapsed_time());
//  console.timeEnd("concatenation");

var end = new Date().getTime();

// Now calculate and output the difference
console.log('-- etime:%d ms',end - start);
}; // draw_speed_tape


// ------------------------------------------------------------------

var draw_ias_tape = function(ias) {

  // draw a partial tape around the actual ias.
  // then crop.

  var x=0, y=0, ht = 600, wd = 100;

  const flu = 50; // pixels for 100 ft.
  const fln = Math.round(ht/flu)+2; // safe value.

  const flevel = Math.round(ias/100); // fl rounded 130 => 13000
  const top_level = Math.round(flevel + fln/2);

  var xref = 650, yref = 10;

  // how many level in given ht.
  console.log('fln: %d  top_level:%d flevel:%d',fln, top_level, flevel);

  const xht = fln * flu;
  console.log('ias  %d -> %d',ht, xht);

  svg.rect(xref,yref,wd,xht).attr({
    fill: 'gray',
    stroke: 'none',
    'stroke-width': '0px'
  });

  // 0 -> 10,000 ft => 1000 marks

  let yoff = 100;

  for (let i=0; i<fln; i++) { // a mark for each 100 ft - text each 200 ft
    svg.line(xref, yref+yoff+i*flu, xref+8, yref+yoff+i*flu).attr({
      stroke: 'white', 'stroke-width':'1px'
    });
    if (i%2 == 1) {
      const a = top_level - i;
//      const b = i *
      svg.text(xref+45, yref + yoff + i*flu +6, (a).toString()).attr({
        'font-size': '22px',
        'font-family': 'Dosis', // 400,300,500,600,700,800
        'font-weight': 600,
        'letter-spacing': '1px',
        'fill' : 'white',
        'stroke': 'none',
        'stroke-width': 2,
        'text-anchor': 'end',
        opacity: 0.75
      });
    }
  }

  svg.line(xref, yref+ht/2, xref+wd, yref+ht/2).attr({
    stroke: 'red', 'stroke-width':'1px',
    opacity: 0.5
  });

}; // draw_iasmeter_tape

// -------------------------------------------------------------------
