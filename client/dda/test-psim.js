
var svg1; // static
var svg2; // recorder
var ticks = 0;
var pulses = 0;
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


// ------------------------------------------------------------------

const recorder_halted = new ReactiveVar(true);

Template.test_psim.events({
  'click .js-reset': function(){
      svg2.clear();
      ticks = 0;
    },
  'click .js-stop-resume': function(){
    recorder_halted.set(!recorder_halted.get()); // flip-flop
  }
});

Template.test_psim.helpers({
  stop_resume_label: ()=>{return (recorder_halted.get()?'resume':'stop');}
});
// -----------------------------------------------------------------


Template.test_psim.onCreated(function(){
//  console.log('> Template.test_psim (onCreated)');
//  this.weight = new ReactiveVar(0); // this will update the W on the graphic.
  this.ticks = new ReactiveVar(0);
  this.time = new ReactiveVar(0);
  this.cycles = new ReactiveVar(0);
  this.pulses = new ReactiveVar(0);
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
          svg2.rect(10+ticks, y, 1,1).attr({stroke:'orange'}); // cd.v2.dt
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


Template.test_psim.onRendered(function(){
//  console.log('> Template.test_psim (onRendered)');
  const svg_element = this.find('svg.test-psim');
  svg2 = Snap(svg_element);
  svg1 = Snap(this.find('svg.base'));
  ticks = 0;
});

const _i_ = Meteor.setInterval(function(){
  if (recorder_halted.get()) return;

//  Meteor.fsim.set('time',Math.floor(ticks/100)); // update a reactive data source.
  a1 = Meteor.fsim.get('a1');
  tu2 = Meteor.fsim.get('tu2');
  plot();
}, 150); //



Template.test_psim.helpers({
  pulses: ()=>{return Template.instance().pulses.get();},
  ticks: ()=>{return Template.instance().ticks.get();},
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
