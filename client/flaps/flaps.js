/*
    Signal is sent to A1, to select another Flaps setting.
    A1 send increment signals back to new flaps position.
    Template listen to those changes, until change complete.
    a1.set_flaps(3);
    Meteor.fsim.get('flap-steps2go');
    // update position
    when (s2go = 0) => operation completed.
*/


var requested_slot = 0;
var actual_slot = new ReactiveVar(0);

const set_flaps = function(fslot){
  Meteor.fsim.set('flaps::requested-slot',fslot);
  requested_slot = fslot;
}

Template.flaps.onCreated(function(){
});


Template.flaps.helpers({
  ypos: function(){
    const y0 = requested_slot*50; //
    const y = Meteor.fsim.get('flaps::steps2go');
//    console.log(' -- ypos helper y:%d y:%d',y0,y);
    if (y == 0) {
      actual_slot.set(requested_slot);
    }
    const _y = y0 - y*(150/390);
    if (_y%50 == 0) {
      console.log(' -- crossing slot y:%d slot:%d', _y, _y/50);
      actual_slot.set(_y/50);
    }
    return 12+10 + 150 - _y;
  },
  bcolor: function(bi){ // updated both when moving, and changing slot.
    const steps2go_ = Meteor.fsim.get('flaps::steps2go');
    const as = actual_slot.get();
    var bcolor = 'darkgray';
    if (as == bi){
      if (steps2go_ != 0) { // blink
        bcolor = (Math.abs(steps2go_%40) > 20)?'darkgray':'rgb(255,133,43)';
      }
      else { // target reached.
        if (bi == 0)
          bcolor = 'darkgray';
        else
          bcolor = 'rgb(255,133,43)'; // amber
      }
    }
//    console.log(' -- bcolor(%d, steps2go:%d)=>%s',bi,steps2go_,bcolor);
    return bcolor;
  },
  bo: function(bi){ // border color
    var color = '#666666';
    const steps2go = Meteor.fsim.get('flaps::steps2go'); // active when moving
    if ((requested_slot == bi)&&(steps2go != 0)) {
      color = 'rgb(255,133,43)';
    }
    return color;
  }
})

Template.flaps.events({
  'click .js-flaps3': function(){
    console.log('>> click.js-flaps3');
    set_flaps(3);
  },
  'click .js-flaps2': function(){
    console.log('>> click.js-flaps2');
    set_flaps(2);
  },
  'click .js-flaps1': function(){
    console.log('>> click.js-flaps1');
    set_flaps(1);
  },
  'click .js-zflaps': function(){
    console.log('>> click.js-zflaps');
    set_flaps(0);
  }
});
