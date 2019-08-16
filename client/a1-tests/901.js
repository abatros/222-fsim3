
var tp = null;
var ticks = 0;

var a1 = null;
var a2 = null;

const plot = function(){
  let x = 10+ticks;
  if (true) {
    let y = 300-a1.TAS*(150/a1.dda103.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m1.set({x:x+3,y:y+10,label:'TAS:'+a1.KTAS+'kt'+' '+a1.dda103.x +':'+ a1.dda103.k});
  }

  if (true) {
    let y = 300-a2.TAS*(150/a2.dda103.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m2.set({x:x+3,y:y-5,label:'TAS:'+a2.KTAS+'kt'+' '+a2.dda103.x +':'+ a2.dda103.k});
  }

  if (true) {
    let y = 300-a3.dda103.x*(150/a3.dda103.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m3.set({x:x+3,y:y+25,label:'TAS:'+a3.KTAS+'kt'+' '+a3.dda103.x +':'+ a3.dda103.k});
  }

  if (true) {
    let y = 500-a1.dda106.x*(150/a1.dda106.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m4.set({x:x+3,y:y+10,label:'V2:'+a1.dda106.x +':'+ a1.dda106.k});
  }

  if (true) {
    let y = 500-a2.dda106.x*(150/a2.dda106.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m5.set({x:x+3,y:y-5,label:'V2:'+a2.dda106.x +':'+ a2.dda106.k});
  }

  if (true) {
    let y = 500-a3.dda106.x*(150/a3.dda106.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m6.set({x:x+3,y:y+25,label:'V2:'+a3.dda106.x+':'+ a3.dda106.k});
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

  if ((a1.pulses > 80000)||(a1.dda103.x >= a1.dda103.k)) {
    Meteor.fsim.set('a1',a1); // last values.
    Meteor.clearInterval(t1_handle);
  }

  a1.pulse1(1);
  a1.pulses += 1;
  a2.pulse1(1);
  a2.pulses += 1;
  a3.pulse1(1);
  a3.pulses += 1;
};

Template.a1_tests.events({
  'click .js-901': function(e,_tp){ // acceleration on RWY.
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

    // MIN WEIGHT - CD max
    a2 = new Meteor.dda.a1.v1();
    a2.dda101.set(1);     // 2*20T max Thrust

    a2.dda102.set(min_weight/min_weight);  // 1/m = 1/72.5 T  weight min:50T MTOW:72.5
    a2.dda107.x = a1.dda107.k; // max DRAG
    a2.dda107_auto = false; // CD from pulse2
    a2.dda107.x = a1.CD_max; // will be ignored if auto := true
    a1.dda109.set(min_weight/max_weight);

    // MAX WEIGHT - CD max - slope 10% (5.7deg)
    a3 = new Meteor.dda.a1.v1();
    a3.dda101.set(1);     // 2*20T max Thrust

    a3.dda102.set(min_weight/max_weight);  // 1/m = 1/72.5 T  weight min:50T MTOW:72.5
    a3.dda107.x = a1.dda107.k; // max DRAG
    a3.dda107_auto = false; // CD from pulse2
    a3.dda107.x = a1.CD_max; // will be ignored if auto := true
    a3.dda109.set(1);
    a3.dda110.set(0.1); // sin(5.7)=0.1
    a3.dda110_auto = false; // block update from pulse3

    time_zero = new Date().getTime();
    t1_handle = Meteor.setInterval(test2, 10);
    }
})
