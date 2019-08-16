
var svg1; // static
var svg2; // recorder


var cycles = 0;
var this_template;

const fmax = 300;
const ratio = 300/fmax; // pixels
/*
  => stable when (fmax = drag) => (fmax == kv2)
  but max drag is only 0.5 v2 => do not thrust more tha 50% of fmax.
  => in GE4(200), T must be 100 max => 50%
*/

//const dsim = new Meteor.dda.aerodynamic.V2();
var dsim = null
//const psim = new Meteor.dda.psim.V1(); // local instance
var psim = null;
var strut1 = null;
var a1 = null;
var tu2 = null;

var ticks = 0;
var tick_count = new ReactiveVar(0);
var pulse_count = new ReactiveVar(0);
var etime = new ReactiveVar(0);
Template.a1_tests.helpers({
  etime: ()=>{return Math.round(etime.get()/100)/10;}
});
// ------------------------------------------------------------------

Tracker.autorun(function(){
  const flaps_setting = Meteor.fsim.get('flaps::requested-slot');
  if (!a1) return;
  a1.set_flaps(flaps_setting);
});

// ------------------------------------------------------------------
const recorder_halted = new ReactiveVar(true);

Template.a1_tests.events({
  'click .js-reset': function(){
      svg2.clear();
      ticks=0; tick_count.set(ticks);
    },
  'click .js-stop-resume': function(){
    recorder_halted.set(!recorder_halted.get()); // flip-flop
  }
});

Template.a1_tests.helpers({
  stop_resume_label: ()=>{return (recorder_halted.get()?'resume':'stop');}
});
// -----------------------------------------------------------------



Template.a1_tests.onCreated(function(){
//  console.log('> Template.test_psim (onCreated)');
//  this.weight = new ReactiveVar(0); // this will update the W on the graphic.
  this.time = new ReactiveVar(0);
  this.cycles = new ReactiveVar(0);
  this.x2 = new ReactiveVar(0);
  this.y2 = new ReactiveVar(0);
  this.m1 = new ReactiveVar(0);
  this.m2 = new ReactiveVar(0);
  this.m3 = new ReactiveVar(0);
  this.m4 = new ReactiveVar(0);
  this.m5 = new ReactiveVar(0);
  this.m6 = new ReactiveVar(0);
  this.m7 = new ReactiveVar(0);
  this.m8 = new ReactiveVar(0);
  this.m9 = new ReactiveVar(0);
  this.m10 = new ReactiveVar(0);
  this_template = this;
});


var fsim_time = 0;
const b1 = 300;
const b2 = 609;
const k300 = 300;

const plot = function(){
      if (!this_template) return;
      if (fsim_time%17 != 0) return;
  //    console.log('> t_handle pulses:%d', pulses);
      this_template.x2.set(10 + ticks);
  //    this_template.y2.set(400 - psim.pitch*ratio*1.0);
  //    this_template.y2.set(b1 - dsim.dda3.x*ratio*0.5);
      this_template.ticks.set(ticks);
      if (svg2) {
        // --- dsim -------------
        // --- m2 --- ORANGE -------------------------------------

        if (true) {
          let y = b1 - (150/a1.dda107.k)*a1.dda107.x; // CD
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'orange', 'stroke-width':'1px'}); // cd.v2.dt
          this_template.m2.set({x:10+ticks+3,y:y+20,label:'CD:'+a1.dda107.x+':'+a1.dda107.k});
        }

        if (false) {
          let y = b1-a1.dda109.y*(150/a1.dda109.k); // max 150
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'orange'}); // cd.v2.dt
          this_template.m2.set({x:10+ticks+3,y:y,label:'V2:'+a1.dda109.y+':'+a1.dda109.k});
        }

        if (false) {
          let y = b1-tu2.N1*0.5;
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'orange'}); // cd.v2.dt
          this_template.m2.set({x:10+ticks+3,y:y,label:'tu2.N1:'+tu2.N1});
        }

        // --- m3 : LIGHT GREEN  ---------------------------------------

        if (true) {
          let y = b1-tu2.dda1.x*0.5;
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'lightgreen'}); // cd.v2.dt
          this_template.m3.set({x:10+ticks+3,y:y,label:'dda1.x:'+tu2.dda1.x+':'+tu2.dda1.k});
        }




        // --- m1 ----------------------------------------
        if (true) {
          let y = b1-a1.TAS*(150/a1.dda103.k);
          svg2.rect(10+ticks, y, 1,1); // speed %1200 => 150 pixels
          this_template.m1.set({x:10+ticks+3,y:y,label:'TAS:'+a1.KTAS+'kts'});
        }




        // --- psim -------------

  //      svg2.rect(10+ticks, 600-psim.dda301.x*ratio, 1,1).attr({stroke:'red'});  // vitesse pitch

//          svg2.rect(10+ticks, b2-psim.dda308.x*ratio, 1,1).attr({stroke:'orange'}); // 1/m.V2.dt
//          this_template.m3.set({x:10+ticks+5,y:b2-psim.dda308.x*ratio,label:'V2'});


//        svg2.rect(10+ticks, b2-psim.dda332.y*ratio*0.5, 1,1).attr({stroke:'pink'}); // coG*weight*dt
//        this_template.m3.set({x:10+ticks+5,y:b2-psim.dda332.y*ratio*0.5,label:'332'});

        // --- m4 --- BLUE -------------------------------------

        if (true) {
          let y = b2 - (150/a1.dda302.k)*a1.dda302.x;
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'blue'});
          this_template.m4.set({x:10+ticks+3,y:y,label:'r/c:'+a1.dda302.x+':'+a1.dda302.k});
//          svg2.rect(10+ticks, b2-psim.servo300.x*ratio, 1,1); // servo
        }

        // --- m5 --- ORANGE -------------------------------------


        if (true) {
          let y = b2 - (150/a1.dda304.k)*a1.dda304.x;
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'orange'}); // servo
          this_template.m5.set({x:10+ticks+3,y:y,label:'304x:'+a1.dda304.x});
//          svg2.rect(10+ticks, b2-psim.servo300.x*ratio, 1,1); // servo
        }
        if (false) {
          let y = b2 - (150/a1.dda303.k)*a1.dda303.x;
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'orange'}); // servo
          this_template.m5.set({x:10+ticks+3,y:y,label:'303x:'+a1.dda303.x});
//          svg2.rect(10+ticks, b2-psim.servo300.x*ratio, 1,1); // servo
        }

        if (false) {
          let y = (a1.dda212.x)*0.5;
          svg2.rect(10+ticks, b2-y, 1,1).attr({stroke:'orange'}); // servo
          this_template.m5.set({x:10+ticks+3,y:b2-y,label:'212.x:'+y});
//          svg2.rect(10+ticks, b2-psim.servo300.x*ratio, 1,1); // servo
        }

        if (false) {
          let y = b2-a1.servo200.x*ratio*0.5;
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'orange'}); // servo
          this_template.m5.set({x:10+ticks+3,y:y,label:'servo200.x:'+a1.servo200.x});
//          svg2.rect(10+ticks, b2-psim.servo300.x*ratio, 1,1); // servo
        }
        if (false) { // 205y
          let y = b2-a1.dda205.y*ratio*0.5;
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'orange'}); // servo
          this_template.m5.set({x:10+ticks+3,y:y,label:'205y:'+a1.dda205.y});
//          svg2.rect(10+ticks, b2-psim.servo300.x*ratio, 1,1); // servo
        }
        if (false) { // 206x
          let y = b2-a1.dda206.x*ratio*0.5;
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'orange'}); // servo
          this_template.m5.set({x:10+ticks+3,y:y,label:'206x:'+a1.dda206.x});
//          svg2.rect(10+ticks, b2-psim.servo300.x*ratio, 1,1); // servo
        }


        if (false) {
          // coG_ratio
          svg2.rect(10+ticks, b2-psim.coG_ratio*ratio, 1,1).attr({stroke:'orange'}); // coG
          this_template.m5.set({x:10+ticks+5,y:b2-psim.coG_ratio*ratio,label:'%coG'});
        }

        if (false) {
          svg2.rect(10+ticks, b2-psim.coG*ratio*0.05, 1,1).attr({stroke:'green'}); // coG
//          this_template.m5.set({x:10+ticks+5,y:b2-psim.coG_ratio*ratio,label:'%coG'});
        }

        // --- m6 ----------------------------------------

        if (true) { // AOA
          let y = b2-a1.aoa_body*ratio*0.5;
          svg2.rect(10+ticks, y, 1,1); // pitch
          this_template.m6.set({x:10+ticks+5,y:y,label:'aoa:'+a1.aoa_body+' deg:'+a1.aoa_body_deg});
//          this_template.m6.set({x:10+ticks+5,y:y,label:'aoa:'+a1.dda206.y +':'+a1.dda202.k
//            +' 212.x:'+a1.dda212.x+':'+a1.dda212.k+':y:'+a1.dda212.y});
//          this_template.m6.set({x:10+ticks+5,y:y,label:'aoa:'+a1.dda206.y + ' servo200.x:'+a1.servo200.x+':y:'+a1.servo200.y});
        }

        // --- m7 --- LIGHTGREEN -------------------------------------

        if (false) {
          let y = k300*(psim.dda310.x * psim.dda311.x * psim.dda312.x)/(k300*k300*k300);
          if (y > k300) y=k300; else if (y<-k300) y=-k300;
          y = b2 - Math.round(y);
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'lightgreen'}); // servo
          this_template.m7.set({x:10+ticks+3,y:y,label:'Lw'});
        }

        if (true) {
          let y = b2 - a1.dda209.y;
//          svg2.rect(10+ticks, y, 1,1).attr({stroke:'lightgreen'}); // servo
//          this_template.m7.set({x:10+ticks+3,y:y,label:'CD('+a1.dda209.x+'):'+a1.dda209.y});
        }

        // --- m8 ----------------------------------------

        if (false) {
          let y = k300*(psim.dda320.x * psim.dda321.x * psim.dda322.x * psim.dda308.x)/(k300*k300*k300*150);
//          if (y > k300) y=k300; else if (y<-k300) y=-k300;
          y = b2 - Math.round(y*0.5);
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'lightgreen'}); // servo
          this_template.m8.set({x:10+ticks+3,y:y,label:'Lt'});
        }

        // --- m9 --- LIGHTGREEN -------------------------------------

        if (false) {
          let y = k300*(psim.dda330.x * psim.dda331.x * psim.dda332.x)/(k300*k300*k300);
          if (y > k300) y=k300; else if (y<-k300) y=-k300;
          y = b2 - Math.round(y);
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'lightgreen'}); // servo
          this_template.m9.set({x:10+ticks+3,y:y,label:'Le'});
        }

        if (true) {
          let y =b2 - a1.slope.sin.x*(200/a1.slope.sin.k);
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'lightgreen'});
//          this_template.m10.set({x:10+ticks+3,y:y,label:'sin('+a1.servo310.y+'):'+a1.slope.sin.x});
          this_template.m9.set({x:10+ticks+3,y:y,label:'sin(slope:'+a1.slope.deg+'deg):'+a1.slope.sin.x+':'+a1.slope.sin.k});
        }

        // --- m10 --- ORANGE  ---------------------------------


        if (false) {
          let y = b2 - a1.slope.sin.x*0.5;
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'orange'});
          this_template.m10.set({x:10+ticks+3,y:y-20,label:'sin(slope):'+a1.slope.sin.x+' 312.y:'+a1.dda312.y+' 304.y:'+a1.dda304.y});
        }

        if (false) {
          let y =b2 - a1.dda304.x*(200/a1.dda304.k);
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'orange'});
//          this_template.m10.set({x:10+ticks+3,y:y,label:'sin('+a1.servo310.y+'):'+a1.slope.sin.x});
          this_template.m10.set({x:10+ticks+3,y:y,label:'304.x:'+a1.dda304.x+':'+a1.dda304.k+' v:'+a1.dda302.x});
        }


        if(ticks%100 == 0) {
          svg2.rect(10+ticks, b1-5, 2,10);
          svg2.rect(10+ticks, b2-5, 2,10);
        }
      }
      ticks += 1;
}


console.log('######### starting Tracker text-psim.js');

/*
Tracker.autorun(function(){ // refresh each time
  fsim_time = Meteor.fsim.get('time');
  psim = Meteor.fsim.get('psim');
  dsim = Meteor.fsim.get('dsim');
  a1 = Meteor.fsim.get('a1');
  strut1 = Meteor.fsim.get('strut1');
  tu2 = Meteor.fsim.get('tu2');
//  console.log('>plot ticks:%d', time);
  plot();
});
*/


Template.a1_tests.onRendered(function(){
//  console.log('> Template.test_psim (onRendered)');
  const svg_element = this.find('svg.test-psim');
  svg2 = Snap(svg_element);
  this.svg2 = svg2; // for 901
  svg1 = Snap(this.find('svg.base'));
  ticks = 0;
  this.plot_data = function(data){
    for (let x=0; x<data.length; x++) {
//      console.log(data[i]);
    if (true) {
      let y = 300-150*data[x][0];
      svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    }
    if (true) {
      let y = 350-150*data[x][1];
      svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
      }
    }
  }
});

const _i_ = Meteor.setInterval(function(){
  if (recorder_halted.get()) return;

//  Meteor.fsim.set('time',Math.floor(ticks/100)); // update a reactive data source.
  a1 = Meteor.fsim.get('a1');
  tu2 = Meteor.fsim.get('tu2');
  plot();
}, 150); //



Template.a1_tests.helpers({
  pulses: ()=>{return pulse_count.get();},
  ticks: ()=>{return tick_count.get();},
  time: ()=>{return Template.instance().time.get();},
  cycles: ()=>{return Template.instance().cycles.get();},
  x2: ()=>{return Template.instance().x2.get();},
  y2: ()=>{return Template.instance().y2.get();},
  m1: ()=>{return Template.instance().m1.get();},
  m2: ()=>{return Template.instance().m2.get();},
  m3: ()=>{return Template.instance().m3.get();},
  m4: ()=>{return Template.instance().m4.get();},
  m5: ()=>{return Template.instance().m5.get();},
  m6: ()=>{return Template.instance().m6.get();},
  m7: ()=>{return Template.instance().m7.get();},
  m8: ()=>{return Template.instance().m8.get();},
  m9: ()=>{return Template.instance().m9.get();},
  m10: ()=>{return Template.instance().m10.get();},
  x_origin: ()=>{return 500;},
  this_aoa_tail: ()=>{
    const psim = Meteor.fsim.get('psim');
    if (psim) {
      return psim.aoa_tail;
    }
  },
  this_aoa_tail_deg: ()=>{
    const psim = Meteor.fsim.get('psim');
    if (psim) {
      return Math.round(10*psim.aoa_tail/3)/10;
    }
  },
  a1: ()=>{return Meteor.fsim.get('a1');},
  dsim: ()=>{
    return Meteor.fsim.get('dsim');
  },
  psim: ()=>{
//    console.log('psim:', Meteor.fsim.get('psim').dda312);
    return Meteor.fsim.get('psim');
  },
  altitude: ()=>{
    const a1 = Meteor.fsim.get('a1');
    if (!a1) return 0;
    return Math.round(a1.dda312.y*7.36);
  },
  rc: ()=>{
    const a1 = Meteor.fsim.get('a1');
    if (!a1) return 0;
    return Math.round(a1.dda302.x*(6000/a1.dda302.k));
  }
});

// ------------------------------------------------------------------------------

var time_zero = 0;
var t1_handle = null;

const plot1 = function(){
  let x = 10+ticks;
  if (true) {
    let y = 300-a1.TAS*(150/a1.dda103.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    this_template.m1.set({x:x+3,y:y,label:'TAS:'+a1.KTAS+'kts'});
  }
  if (true) {
    let y = 350-a1.aoa.angle*(150/a1.aoa_max);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    this_template.m2.set({x:x+3,y:y,label:'AOA:'+a1.aoa.deg+'deg'});
  }
  if (true) {
    let y = 400-a1.dda202.x*(150/a1.dda202.k);
    svg2.rect(x, y, 1,1).attr({stroke:'lightgreen'}); // speed %1200 => 150 pixels
    this_template.m3.set({x:x+3,y:y,label:'CL:'+a1.dda202.x+' '+ Math.round((30/a1.dda202.k)*a1.dda202.x)/10});
  }
  if (true) {
    let y = 450-a1.dda107.x*(150/a1.dda107.k);
    svg2.rect(x, y, 1,1).attr({stroke:'orange'}); // speed %1200 => 150 pixels
    this_template.m4.set({x:x+3,y:y,label:'CD:'+a1.dda202.x+' '+ Math.round((30/a1.dda107.k)*a1.dda107.x)/10});
  }
  if (true) {
    let y = 550-a1.servo310v2.dda4.x*(150/a1.servo310v2.dda4.k);
    svg2.rect(x, y, 1,1).attr({stroke:'orange'}); // speed %1200 => 150 pixels
    this_template.m5.set({x:x+3,y:y,label:'R/C:'+a1.servo310v2.dda4.x+':'+a1.servo310v2.dda4.k+
            ' ft/m:'+ Math.round(6000*(a1.servo310v2.dda4.x/a1.servo310v2.dda4.k))});
  }
  if (true) {
    let y = 600-a1.p1.dda4.x*(150/a1.p1.dda4.k);
    svg2.rect(x, y, 1,1).attr({stroke:'lightblue'});
    this_template.m6.set({x:x+3,y:y,label:'P1:'+Math.round(100*a1.p1.dda4.x/a1.p1.dda4.k)/100});
  }
  if (true) {
    let y = 600-a1.dda300.x*(150/a1.dda300.k);
    svg2.rect(x, y, 1,1).attr({stroke:'lightblue'});
    this_template.m7.set({x:x-10,y:y-10,label:'Weight:'+Math.round(330000*a1.dda300.x/a1.dda300.k)+'kgf'});
  }
  if (true) {
    let y = 600-a1.p2.dda4.x*(150/a1.p2.dda4.k);
    svg2.rect(x, y, 1,1).attr({stroke:'green'});
    this_template.m8.set({x:x+3,y:y,label:'P2:'+Math.round(100*a1.p2.dda4.x/a1.p2.dda4.k)/100});
  }
  if(a1.pulses%100 == 0) {
    if (a1.pulses%1000 == 0)
      svg2.rect(10+ticks, 150-15, 2,20);
    else
      svg2.rect(10+ticks, 150-5, 2,10);
  }
};


var q = 0;
const test1 = function(){
//  console.log(' -- (t1_handle) a1:', a1);
  if (a1.pulses%20 == 0) { // every 100*10ms
    plot1();
    ticks = ticks+1; tick_count.set(ticks);
    Meteor.fsim.set('a1',a1);
    etime.set(new Date().getTime() - time_zero); // this is real time not accelerated.
    Meteor.fsim.set('aoa-body', a1.aoa_body);
    Meteor.fsim.set('aoa-body-deg', a1.aoa_body_deg); // for display only
    Meteor.fsim.set('aoa-body-deg-neg', -a1.aoa_body_deg); // for display only
    if ((q == 0)&&(a1.dda103.x > 0.25*a1.dda103.k)) {
      q+=1;
      a1.set_aoa_tail(5);
      svg2.rect(10+ticks, 150-5, 2,500);
    }
    if ((q == 1)&&(a1.dda103.x > 0.5*a1.dda103.k)) {
      q+=1;
      a1.set_aoa_tail(0);
      svg2.rect(10+ticks, 150-5, 2,500);
    }
    if ((q == 2)&&(a1.dda103.x > 0.65*a1.dda103.k)) {
      q+=1;
      a1.set_aoa_tail(-5);
      a1.dda101.set(0.6);
      svg2.rect(10+ticks, 150-5, 2,500);
    }
  }
  // should have a loop n times pulses.
  for (let i=0; i<1; i++) {
    a1.pulse1(1);
    a1.pulse2(1);
    a1.pulse3(1);
    a1.pulse_flaps();
    a1.pulses += 1;
  }
  pulse_count.set(a1.pulses);
  if ((a1.pulses > 80000)||(a1.dda103.x >= a1.dda103.k)) {
    Meteor.fsim.set('a1',a1); // last values.
    Meteor.clearInterval(t1_handle);
  }
};


Template.a1_tests.events({
  'click .js-test1': ()=>{ // acceleration on RWY.
    a1 = new Meteor.dda.a1.v1();
//    a1.dda101.x = Math.round(0.1*a1.dda101.k); // thrust to reach 180kts in 30 sec.
    a1.dda101.set(1); //= Math.round(0.1*a1.dda101.k); // thrust to reach 180kts in 30 sec.
//    a1.dda102.set(0.33); //x = Math.round(0.33*a1.dda102.k); // thrust to reach 180kts in 30 sec.
    a1.dda102.set(0.36); // 1/m ; // thrust to reach 180kts in 60 sec because we are at DRAG MAX.
    a1.dda107_auto = true; // CD from pulse2
    a1.dda107.x = a1.CD_max; // will be ignored if auto := true
    a1.set_coG(0.50); // default 20%MAC
    a1.set_aoa_tail(0);
    a1.dda300.set(0.10); // weight

    Meteor.fsim.set('a1',a1);
    pulse_count.set(0);
    ticks=0; tick_count.set(0);
//    console.log(' -- a1:', a1);
    a1.pulses = 0;
    time_zero = new Date().getTime();
    t1_handle = Meteor.setInterval(test1, 10);
  }
});


// ------------------------------------------------------------------------------
