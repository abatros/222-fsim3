/*
    Probe on cosine - or differentiation.
*/

var tp = null;
var ticks = 0;
var servo1;
var servo2;
const data = [];
var t1_handle = null;
var pulses = 0;
var etime_average = 0;


const plot = function(){
  let x = 10+ticks;

  if (true) {
    let y = 350 - servo1.dda1.x*(150/servo1.dda1.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m1.set({x:x+3,y:y,label:'servo1.1.x:'+servo1.dda1.x +':'+ servo1.dda1.k});
  }

  if (true) {
    let y = 350 - servo1.dda4.x*(150/servo1.dda4.k);
    svg2.rect(x, y, 1,1).attr({stroke:'lightblue'}); // speed %1200 => 150 pixels
    tp.m2.set({x:x+3,y:y,label:'servo1.4.x:'+servo1.dda4.x +':'+ servo1.dda4.k});
  }


  if (false) {
    let y = 350 - cosine.cos.x*(150/cosine.cos.k);
    svg2.rect(x, y, 1,1).attr({stroke:'orange'}); // speed %1200 => 150 pixels
    tp.m3.set({x:x+3,y:y,label:'cos:'+cosine.cos.x +':'+ cosine.cos.k});
  }

  if (true) {
    let y = 350 - cosine.sin.x*(150/cosine.sin.k);
    svg2.rect(x, y, 1,1).attr({stroke:'orange'}); // speed %1200 => 150 pixels
    tp.m3.set({x:x+3,y:y,label:'cos:'+cosine.sin.x +':'+ cosine.sin.k});
  }

  if (true) {
    let y = 350 - servo2.dda4.x*(150/servo2.dda4.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m4.set({x:x+3,y:y,label:'servo1.4.x:'+servo2.dda4.x +':'+ servo2.dda4.k});
  }


  if (true) {
    let y = 600 - etime_average*(150/pulses);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m5.set({x:x+3,y:y,label:'etime'+etime_average/pulses});
  }

  if(pulses%100 == 0) {
    if (pulses%1000 == 0)
      svg2.rect(10+ticks, 150-15, 2,20);
    else
      svg2.rect(10+ticks, 150-5, 2,10);
  }
};



var etime = 0;
const pulse = function(){
  const time_zero = new Date().getTime();
  if (pulses%2 == 0) { // 50fps * 200ms
//    data.push([servo1.dda4.x]);
    plot();
    ticks ++;
    console.log(' --  etime:%d',etime);
  }

/*
  if (pulses == 1000) {
    servo1.dda1.x = servo1.dda1.k;
  }
*/

  for (let i=0; i<20; i++) {
    if ((pulses > 400)&&(pulses<20000)) {
      if (pulses%5 == 0) {
        cosine.pulse(1);
//        servo1.dda4.x += 1;
      }
    }
  /*
  if (pulses%17 == 0) {
  }
  */
//  servo1.dda4.x += cosine.sin.dy;
  servo1.dda4.x += cosine.cos.dy;
  servo1.pulse(1);
  servo2.dda4.x += cosine.cos.dy;
  servo2.pulse(1);
  pulses += 1;
}
  etime = new Date().getTime() - time_zero;
  etime_average += etime;

  if (pulses > 30000) {
    Meteor.clearInterval(t1_handle);
  }
};

Template.a1_tests.events({
  'click .js-904': function(e,_tp){ // response to step signal
    tp = _tp;
    svg2 = tp.svg2;

    if (false) {
      servo1 = new Meteor.dda.servo200(1,1,1,1);
      servo2 = new Meteor.dda.servo200(200,1,1,0);
      cosine = new Meteor.dda.cosine(200);
    }
    else {
      servo1 = new Meteor.dda.servo300(1,1,1,1);
      servo2 = new Meteor.dda.servo300(150,1,1,1);
      cosine = new Meteor.dda.cosine(300);
    }

    t1_handle = Meteor.setInterval(pulse, 1);
    }
})
