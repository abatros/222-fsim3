/*
    ATTN: will set/get fsim.set('iName') from template parameters

*/



var max_vbar = 200;
var bbox; // bounding box for this vbar.
// how to differentiate left and right vbar ????
// for now we are using onlt bbox.top : the same for both vbar.

//Session.set('vbar', 0); // max:100

/*****************************
var vbar_pos = 0;

function mouseWheelHandler (e) { // for all vbar !!!
    e.preventDefault();
//    console.log('e.target:', e.target);
//    console.log('e.wheelDelta:', e.wheelDelta);
    if (e.wheelDelta > 0) {
//      var vbar = Session.get('vbar-position');
      if (vbar_pos < max_vbar) {
        vbar_pos += 1;
        console.log('> vbar-up: %d',vbar_pos + 1);
        Session.set('vbar', Math.round(vbar_pos/2));
      }
    }
    else if (e.wheelDelta < 0) {
      if (vbar_pos > 0) {
        vbar_pos -= 1;
        console.log('> vbar-down: %d',vbar_pos - 1);
        Session.set('vbar', Math.round(vbar_pos/2));
      }
    }
}
********************************/


//var t_handle; // vbar-handle

Meteor.vbar_apc_list = [];
//Meteor.fsim = new ReactiveDict('vbar');

/*
dict.set("weather", "cloudy");
Tracker.autorun(function () { console.log("now " + dict.get("weather")); });
// now cloudy
dict.set("weather", "sunny");
*/


Template.vbar_apc.onDestroyed(function(){
  const index = Meteor.vbar_apc_list.indexOf(this);
  if (index > -1) {
    Meteor.vbar_apc_list.splice(index, 1);
  }
});

Template.vbar_apc.onCreated(function(){
  Meteor.vbar_apc_list.push(this);
  const apc = new Meteor.dda.Aperiodic21();
  apc.dda4.x = 100;
  apc.dda5.x = 33; // 33;
  console.log('> Template.vbar_apc (onCreated) apc:', apc);
  console.log(' -- apc.pulse:', apc.pulse);
//  this.actual_value = new ReactiveVar(apc);
  this.xa = new ReactiveVar(0);
  this.apc = new ReactiveVar(apc);
  this.vbar_pos = 0;
  this.max_vbar = 200;
  this.xa_min = parseInt(this.data.xa_min) || 0; // establish range min
  this.xa_max = parseInt(this.data.xa_max) || 100; // range max.

  console.log(' -- range [%d .. %d]',this.xa_min, this.xa_max);

//  this.data.apc = apc;
  console.log(' -- vbar (onCreated) a_value:', this.actual_value);
  const self = this;
  const iName = this.data.name;
  console.log(' -- iName:(%s)',iName);


/*
  $(window).on('scroll', function(e) {
          // ... event processing stuff;
          // say it produces value 'zoomAmount' ...
//          self.zoom.set(zoomAmount);
      console.log('>> scroll');
    });
*/
  const t_handle = function(){
//    const a_value = self.actual_value;
//    console.log(' -- vbar t_handle: self:', self);
//    console.log(' -- vbar t_handle: a_value:', a_value);
    const xa = apc.xa;
    const xa2 = Meteor.fsim.get(iName);

//console.log('> vbar_apc (%s) pulse xa:%d xa2:%d', iName, xa, xa2);


    apc.pulse();


    if (xa != apc.xa) {
//      console.log('> vbar pulse %d => %d', xa, apc.xa);
        self.xa.set(apc.xa); // update reactive variable
    }

    if (xa2 != apc.xa) {
//      console.log('> vbar pulse(2) %d => %d', xa2, apc.xa);
      console.log('> Meteor.fsim.set(%s, %d)',iName, apc.xa);
      assert((apc.xa != NaN), 'ALERT NaN');
      Meteor.fsim.set(iName, apc.xa); // can be used in any page.
    }

//    apc.log('apc');
//    a_value.set(apc.dda2.x);
    self.apc.set(apc); // to signal a change.
  }
  var interval = Meteor.setInterval(t_handle, 1);
});


Template.vbar_apc.onRendered(function(){
  const t_name = Template.instance().data.name;
  console.log('> onRendered (%s)', t_name);
  var element = this.find("svg");
  console.log(' -- element:', element);
  bbox = element.getBoundingClientRect();
  console.log(' -- BBOX: ', bbox.top, bbox.right, bbox.bottom, bbox.left);


  $(element).addClass(t_name); // {{> vbar name="left-vbar"}}
  svg = Snap(element); // WOOOOOOOOOOOOOOOOOOOOOOWWWWWWWWWWWWWWWWWWWWWW
  console.log('onRendered svg (%s):', t_name, svg);

//  svg.node.addEventListener("mousewheel", mouseWheelHandler, false);
  t_handle = this.find('.vbar-handle');
  console.log('h:', t_handle);

//  initialize tp.vbar_pos ???
});


Template.vbar_apc.events({
  'mousewheel': function(e,tp){
    e.preventDefault();
//      console.log('>> mousewheel e.target:', e.target);
      const oe = e.originalEvent;
//      const apc = tp.apc.get();
//      console.log('>> mousewheel e.orginalEvent:', oe);
//      console.log(' -- apc:', tp.apc);
//      console.log(' -- wheelDelta:', oe.wheelDelta);
//    console.log('e.target:', e.target);
//    console.log('e.wheelDelta:', e.wheelDelta);
/*
    if (oe.wheelDelta > 0) {
//      var vbar = Session.get('vbar-position');
      if (tp.vbar_pos < tp.max_vbar) {
        tp.vbar_pos += 1;
//        console.log('> vbar-up: %d',tp.vbar_pos + 1);
//        Session.set('vbar', Math.round(tp.vbar_pos/2));
      }
    }
    else if (oe.wheelDelta < 0) {
      if (tp.vbar_pos > 0) {
        tp.vbar_pos -= 1;
//        console.log('> vbar-down: %d',tp.vbar_pos - 1);
//        Session.set('vbar', Math.round(vbar_pos/2));
      }
    }
    // update Xt (dda6.x)
    const apc = tp.apc.get();
//    apc.dda3.x = Math.round(tp.vbar_pos/2);
//    apc.set_target(Math.round(tp.vbar_pos/2));
    const new_target = from_gunits(tp,tp.vbar_pos);
    apc.set_target(new_target);
*/

var delta;
if (oe.wheelDelta > 0) {delta = 1;}
else if (oe.wheelDelta < 0) {delta = -1;}
else return;

const apc = tp.apc.get();
const iName = tp.data.name;
console.log('> wheel change (%s): xa:%d', iName, apc.xa);

if (false) {
  const aValue = apc.xa;
  apc.set_target(aValue + delta);
//  Meteor.fsim.set(iName, apc.xa + delta); // can be used in any page.
}

if (true) {
  if (tp.vbar_pos < 0) delta = 0;
  else if (tp.vbar_pos > tp.max_vbar) delta = 0;
  if (!delta) return;

  tp.vbar_pos += delta;
  const new_target = from_gunits(tp,tp.vbar_pos);
  console.log(' -- pos:%d => %d',tp.vbar_pos, new_target);
  console.log('> new_target:%d', new_target);
  apc.set_target(new_target);

}




  } // fct
}); // events


Template.vbar_apc.events({
  'click': (e,tp)=>{
    const y = max_vbar - (e.clientY - bbox.top);
    console.log('> onClick e.clientY %d -> %d', e.clientY, y);
    const vbar_pos = (y>max_vbar)? max_vbar: (y<0)?0:y; // [0..200]

//    Session.set('vbar', Math.round(vbar_pos/2));
//    const instance = Template.instance();
//    console.log(' -- instance:', instance);
    const av1 = vbar_pos;
    const av2 = vbar_pos/max_vbar;
    console.log(' -- vpos:%d av1:%d av2:%d', vbar_pos, av1, av2);
//    instance.data.apc.dda1.x = Math.round(av2*100);
//    instance.data.apc.target = Math.round(av2*100);
//    instance.data.apc.dda1.x = Math.round(av2*100) - instance.data.apc.acc;


    tp.vbar_pos = Math.round(av2*100)*2;


//    const apc = Template.instance().apc.get();
    const apc = tp.apc.get();
//    apc.dda3.x = Math.round(av2*100);
//    apc.set_target(Math.round(av2*100));
    const new_target = from_gunits(tp,vbar_pos);
    console.log(' -- new_target:%d <> %d',new_target, Math.round(av2*100));
  apc.set_target(new_target);
  apc.log('after set-target');
  return false;
  }
});

var to_gunits = function(tp){
  const av = tp.apc.get().xa;
  const av1 = av - tp.xa_min; // now we are in [0...] if (xa_min < 0)
  const av2 = av/(tp.xa_max-tp.xa_min); // % relative
//  console.log('> helper vbar_y (%s) av1:%d av:%d av2:%d',tp.data.name,av1,av,Math.round(av2*100));
  const u = max_vbar - av1*2;
  return u;
};

var from_gunits = function(tp, vp){
  const r = vp/max_vbar;
  // convert back to internal units
  const x = (tp.xa_max - tp.xa_min)*r + tp.xa_min;
  return Math.round(x);
};


Template.vbar_apc.helpers({
  vbar_y: ()=>{ // must be reactive
//    const av = Template.instance().apc.get().dda2.x;
    const instance = Template.instance();
//    const av = instance.apc.get().xa ; //+ instance.xa_min; // now we are in [0...]
    return to_gunits(instance);
  }
});


  Template.vbar_apc.helpers({
      apc: function () {
//        console.log('> helper vbar instance:',Template.instance());
        return Template.instance().apc.get();
      }
    });
