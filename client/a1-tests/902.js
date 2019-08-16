
var tp = null;
var ticks = 0;

var a1 = null;

const plot = function(){
  let x = 10+ticks;
  if (true) {
    let y = 300-a1.TAS*(150/a1.dda103.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m1.set({x:x+3,y:y,label:'TAS:'+a1.KTAS+'kt'+' '+a1.dda103.x +':'+ a1.dda103.k});
  }

  if (true) {
    let y = 300-a1.dda106.x*(150/a1.dda106.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m2.set({x:x+3,y:y+15,label:'V2:'+a1.dda106.x+':'+ a1.dda106.k});
  }

  if (true) {
    let y = 500-a1.p1.dda4.x*(150/a1.p1.dda4.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m3.set({x:x+3,y:y+15,label:'Lift(p1):'+a1.p1.dda4.x+':'+ a1.p1.dda4.k});
  }

  if (true) {
    let y = 550-a1.dda331.x*(150/a1.dda331.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m4.set({x:x+3,y:y+15,label:'F1.x:'+a1.dda331.x+':'+ a1.dda331.k});
  }

  if (true) {
    let y = 600-a1.dda332.x*(150/a1.dda332.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m5.set({x:x+3,y:y+15,label:'F2.x:'+a1.dda332.x+':'+ a1.dda332.k});
  }

  if (true) {
    let y = 650-a1.dda333.x*(150/a1.dda333.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m6.set({x:x+3,y:y+15,label:'F3.x:'+a1.dda333.x+':'+ a1.dda333.k});
  }

  if(a1.pulses%100 == 0) {
    if (a1.pulses%1000 == 0)
      svg2.rect(10+ticks, 150-15, 2,20);
    else
      svg2.rect(10+ticks, 150-5, 2,10);
  }
};



const data = [];
var t1_handle = null;

const test2 = function(){

  if (a1.pulses%20 == 0) { // every 20*10ms = 200ms
    plot(); ticks ++;
  }

  if (a1.p1.dda4.x > 0.5*a1.p1.dda4.k) {
    if (a1.actual_flaps_slot == a1.requested_flaps_slot) { // to avoid transitions states
      a1.log_flaps();
      if (a1.actual_flaps_slot == 3)
        a1.set_flaps(2);
      a1.log_flaps();
    }
  }
  if (a1.p1.dda4.x > 0.7*a1.p1.dda4.k) {
    if (a1.actual_flaps_slot == a1.requested_flaps_slot) { // to avoid transitions states
      a1.log_flaps();
      if (a1.actual_flaps_slot == 2)
        a1.set_flaps(1);
      a1.log_flaps();
    }
  }
  if (a1.p1.dda4.x > 0.8*a1.p1.dda4.k) {
    if (a1.actual_flaps_slot == a1.requested_flaps_slot) { // to avoid transitions states
      a1.log_flaps();
      if (a1.actual_flaps_slot == 1)
        a1.set_flaps(0);
      a1.log_flaps();
    }
  }


  if ((a1.pulses > 80000)||(a1.dda103.x >= a1.dda103.k)) {
    Meteor.fsim.set('a1',a1); // last values.
    Meteor.clearInterval(t1_handle);
  }

  a1.pulse1(1);
  a1.pulse2(1);
  a1.pulse3(1); // to get Lift with flaps
  a1.pulse_flaps(1);
  a1.pulses += 1;
};

Template.a1_tests.events({
  'click .js-902': function(e,_tp){ // acceleration on RWY.
    tp = _tp;
    svg2 = tp.svg2;
    a1 = new Meteor.dda.a1.v1();
    a1.dda101.set(1);     // 2*20T max Thrust

    const max_weight = 73.5;
    const min_weight = 50.0;

    // MAX WEIGHT - CD max
    a1.dda102.set(min_weight/max_weight);  // 1/m = 1/72.5 T  weight min:50T MTOW:72.5
    a1.dda107.x = a1.dda107.k; // max DRAG
    a1.dda107_auto = false; // CD from pulse2
    a1.dda107.x = a1.CD_max; // will be ignored if auto := true
    a1.dda109.set(1);
    a1.aoa_locked = true;
    a1.set_flaps(3);


    time_zero = new Date().getTime();
    t1_handle = Meteor.setInterval(test2, 10);
    }
})
