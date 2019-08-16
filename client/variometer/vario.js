
const rc_max = 240;
const dda2 = new Meteor.dda.DDA2(rc_max*2);
const cosine = new Meteor.dda.cosine(200);
const a = [0];
var svg;

var build_array = function() {
  for (let i=0; i<=2*rc_max; i++) {
    dda2.pulse(1);
    if (dda2.dy != 1) continue;
    dda2.log('test');
    const step = 6;
    switch(dda2.y) {
      case 1*step: a.push(i); break; // 0.5
      case 2*step: a.push(i); break; // 1.0
      case 3*step: a.push(i); break; // 1.5
      case 4*step: a.push(i); break; // 2.0
      case 5*step: a.push(i); break; // 2.0
      case 6*step: a.push(i); break; // 2.0
      case 7*step: a.push(i); break; // 2.0
      case 8*step: a.push(i); break; // 4.0
      case 9*step: a.push(i); break; // 4.0
      case 10*step: a.push(i); break; // 4.0
      case 11*step: a.push(i); break; // 4.0
      case 12*step: a.push(i); break; // 6.0
    }
  }
  console.log(' -- a:',a);
}


var build_array_cosine = function() {
  for (let i=0; i<=2*rc_max; i++) {
    cosine.pulse(1);
    const step = 33; //Math.round(300/12);
    switch(i) {
      case 1*step: a.push(cosine.sin.x); break; // 0.5
      case 2*step: a.push(cosine.sin.x); break; // 1.0
      case 3*step: a.push(cosine.sin.x); break; // 1.5
      case 4*step: a.push(cosine.sin.x); break; // 2.0
      case 5*step: a.push(cosine.sin.x); break; // 2.0
      case 6*step: a.push(cosine.sin.x); break; // 2.0
      case 7*step: a.push(cosine.sin.x); break; // 2.0
      case 8*step: a.push(cosine.sin.x); break; // 4.0
      case 9*step: a.push(cosine.sin.x); break; // 4.0
      case 10*step: a.push(cosine.sin.x); break; // 4.0
      case 11*step: a.push(cosine.sin.x); break; // 4.0
      case 12*step: a.push(cosine.sin.x); break; // 6.0
    }
  }
  console.log(' -- a:',a);
};


Template.vario.onCreated(function(){
//  build_array();
//  build_array_cosine();
});

const draw_marks = function() {
  const r = 130/(210);
  a.forEach(function(it,i){
    console.log(' -- mark at y:%d',it*r);
    const y = 130 - it*r;
    svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
    switch(i) {
      case 2: svg.text(10,y+4,'1').attr({stroke:'white', 'stroke-width':'1px', fill:'white'}); break;
      case 4: svg.text(10,y+4,'2').attr({stroke:'white', 'stroke-width':'1px', fill:'white'}); break;
      case 12: svg.text(10,y+4,'6').attr({stroke:'white', 'stroke-width':'1px', fill:'white'}); break;
      }
  });
}

var ypx = function(rc){
  // rc:100% => 6,000 ft/min => 120px
  // rc:33% => 2,000 ft/min => 100px
  if (rc <= 60) {
    return rc*1.5;
  }
  return 60*1.5 + 0.25*(rc-60);
  // f1 y = k1.x
  // f2 y = 85 + k2.x
}

const draw_marks2 = function() {
  var y = 130;
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  svg.text(10,y+4,'0').attr({stroke:'white', 'stroke-width':'1px', fill:'white'});

  y = 130-ypx(15); // 0.5
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  y = 130+ypx(15); // 0.5
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});

  y = 130-ypx(30); // 1.000
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  svg.text(10,y+4,'1').attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  y = 130+ypx(30); // 1.000
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  svg.text(10,y+4,'1').attr({stroke:'white', 'stroke-width':'1px', fill:'white'});

  y = 130-ypx(45); // 1.500
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  y = 130+ypx(45); // 1.500
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
//  svg.text(10,y+4,'1').attr({stroke:'white', 'stroke-width':'1px', fill:'white'});

  y = 130-ypx(60); // 2.000
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  svg.text(10,y+4,'2').attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  y = 130+ypx(60); // 2.000
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  svg.text(10,y+4,'2').attr({stroke:'white', 'stroke-width':'1px', fill:'white'});

  y = 130-ypx(120); // 4.000
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  y = 130+ypx(120); // 4.000
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
//  svg.text(10,y+4,'4').attr({stroke:'white', 'stroke-width':'1px', fill:'white'});

  y = 130-ypx(180); // 6.000
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  svg.text(10,y+4,'6').attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  y = 130+ypx(180); // 6.000
  svg.line(20,y,25,y).attr({stroke:'white', 'stroke-width':'1px', fill:'white'});
  svg.text(10,y+4,'6').attr({stroke:'white', 'stroke-width':'1px', fill:'white'});

/*
y = 130-ypx(120);
  svg.line(28,y,70,130).attr({stroke:'white', 'stroke-width':'3px', fill:'white', opacity:0.75});
*/
};



Template.vario.onRendered(function(){
  const element = this.find('svg');
  svg = Snap(element);
  if (!svg) {
    throw new Meteor.error('Unable to locate svg');
  }
  draw_marks2();
});


Template.vario.helpers({
y_needle: function(){
  const rc = Meteor.fsim.get('r/c'); // units 6000/400
  // ypx([0..120])
  // transform [0..400] into [1..120]
  return 130-ypx((120/400)*rc);
}
});
