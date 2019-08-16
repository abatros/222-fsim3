
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


  if (true) {
    let y = 700 - servo34.x*(150/servo34.k);
    svg2.rect(x, y, 1,1).attr({stroke:'lightgreen'}); // speed %1200 => 150 pixels
    tp.m3.set({x:x+3,y:y,label:'34.x:'+servo34.x +':'+ servo34.k});
  }

  if (true) {
    let y = 700 - servo31.x*(150/servo31.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m4.set({x:x+3,y:y,label:'31.x:'+servo31.x +':'+ servo31.k});
  }

  if (true) {
    let y = 350 - servo2.dda4.x*(150/servo2.dda4.k);
    svg2.rect(x, y, 1,1).attr({stroke:'orange'}); // speed %1200 => 150 pixels
    tp.m2.set({x:x+3,y:y,label:'servo1.4.x:'+servo2.dda4.x +':'+ servo2.dda4.k});

  }

  return;

  if (false) {
    let y = 550 - servo2.dda1.x*(150/servo2.dda1.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m3.set({x:x+3,y:y,label:'2.1.x:'+servo2.dda1.x +':'+ servo2.dda1.k});
  }




  if (true) {
    let y = 550 - servo2.dda4.x*(150/servo2.dda4.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m4.set({x:x+3,y:y,label:'2.4.x:'+servo2.dda4.x +':'+ servo2.dda4.k});
  }

  if (true) {
    let y = 550 - cosine.cos.x*(150/cosine.cos.k);
    svg2.rect(x, y, 1,1); // speed %1200 => 150 pixels
    tp.m4.set({x:x+3,y:y,label:'2.4.x:'+cosine.cos.x +':'+ cosine.cos.k});
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

  if ((pulses > 400)&&(pulses<10000)) {
    if (pulses%2 == 0) {
      servo34.x += 1;
      servo1.dda4.x += 1;
      servo2.dda4.x += 1;
    }
  }
  if (pulses > 30000) {
    Meteor.clearInterval(t1_handle);
  }


  servo31.pulse(1);
  servo31.x -= servo31.dy;

  servo34.x += servo31.dy;
  servo34.pulse(1);
  servo31.x -= servo34.dy;

  servo1.pulse(1);
  servo2.pulse(1);
  pulses += 1;
}
  etime = new Date().getTime() - time_zero;
  etime_average += etime;
};

Template.a1_tests.events({
  'click .js-903': function(e,_tp){ // response to step signal
    tp = _tp;
    svg2 = tp.svg2;

    if (false) {
      servo1 = new Meteor.dda.servo200(200,1,1,0.7);
      servo2 = new Meteor.dda.servo200(200,1,1,0);
    }
    else {
      servo1 = new Meteor.dda.servo300(1,1,1,1);
      servo2 = new Meteor.dda.servo300(100,1,1,1);
    }

    servo31 = new Meteor.dda.DDA(0,1);
    servo34 = new Meteor.dda.DDA(0,300);
    t1_handle = Meteor.setInterval(pulse, 1);
    }
})
