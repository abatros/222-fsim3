var _Template = Template.dda_tests
var svg;
const x1 = 270;
const y1 = 260;

const cosine1 = new Meteor.dda.cosine(250);
const cosine2 = new Meteor.dda.cosine(100);
const cosine3 = new Meteor.dda.cosine(250);

var ia = 0;
var dda_pulse = function(dz) {
    cosine1.pulse(1);
    cosine2.pulse(1);
    const dx = 1-Math.round((Math.round(ia/20)%3));
    ia ++;
    cosine3.pulse(dx);
//    cosine1.log('cosine1');
    Session.set('needle1', {x1:x1+cosine1.x.x*0.2, y1:y1+cosine1.y.x*0.2, x2:x1+cosine1.x.x, y2:y1+cosine1.y.x});
    Session.set('needle2', {x1:x1+cosine2.x.x*0, y1:y1+cosine2.y.x*0, x2:x1+cosine2.x.x*0.9, y2:y1+cosine2.y.x*0.9});
    Session.set('needle3', {x1:x1+cosine3.x.x*0.2, y1:y1+cosine3.y.x*0.2, x2:x1+cosine3.x.x, y2:y1+cosine3.y.x});
}


_Template.helpers({
  needle1 : function(){
    return Session.get('needle1');
  },
  needle2 : function(){
    return Session.get('needle2');
  },
  needle3 : function(){
    return Session.get('needle3');
  }
});

_Template.onRendered(function(){
  const element = this.find('svg');
  svg = Snap(element);
  if (!svg) {
    throw new Meteor.error('Unable to locate svg');
  }
/*
  // erase
  svg.rect(0,0,540,520).attr({
    fill: '#202020'
  });
*/

  const nsteps = 100000;
  cosine1.xlog('start');
  for (let i=0; i<nsteps; i++) {
    cosine1.pulse(1);
  }
  for (let i=0; i<nsteps; i++) {
    cosine1.pulse(-1);
  }
  console.log('after '+nsteps+' steps plus then minus')
  cosine1.xlog(' end');


  const v2 = new Meteor.dda.DDA2(0,2000);
  v2.log(' start v2');
  // we can only send 0.5*2000 in x.
  for (let i=0; i<2000; i++) {
    v2.pulse(1);
  }
  v2.log('middle v2');
  for (let i=0; i<2000; i++) {
    v2.pulse(-1);
  }
  v2.log('   end v2');






  for (let i=0; i<250*3.14*2; i++) {
    cosine1.pulse(1);
    svg.rect(x1+cosine1.x.x, y1+cosine1.y.x, 1,1).attr({
      fill:'lightgreen',
      'stroke-width': 0,
      'stroke': 'red'
    });
  }
  for (let i=0; i<250*3.14*2; i++) {
    cosine1.pulse(-1);
    svg.rect(x1+cosine1.x.x, y1+cosine1.y.x, 1,1).attr({
      fill:'yellow',
      'stroke-width': '1px',
      'stroke': 'none'
    });
  }

var interval = Meteor.setInterval(dda_pulse, 30);

});
