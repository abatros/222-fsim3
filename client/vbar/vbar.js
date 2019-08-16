/*
    vbar
    ----
    control panel => result is value [0,100] with zero at some value ex: 50
    => value = x-zero => (100-zero)=> 50  (0-zero)=> -50
    Create a panel 100 pixels + borders + display actual value.
    Any value can be reached by click on panel or mouse wheel.
    MouseWheel understand user intended acceleration.
    Designed to manage multiple Template instances.

    Each vbar (template instance) holds some state:
    - actual position
    - zero value
    - name : key for identification.
    - label for display

    Actual position is a reactive data source
      stored (duplicated) at the fsim level, ez availaible
      everywhere in the app. The App should not be trying
      to access vbar internals.

    Each vbar got template config parameters into tp.data.
      ex: tp.data.zero = 50
      We could also give display value for 100%,
      number of ticks, grade display, etc...

    Vbar deliver value in 100%, not aware of real user units.

    Value is delivered instantly if click, animation smooth the process.
*/

//Meteor.fsim = new ReactiveDict();
Meteor.vbar_list = [];
const vpos_max = 200; // all vbar are 200px height. so far.

Template.vbar.onDestroyed(function(){
  const index = Meteor.vbar_list.indexOf(this);
  if (index > -1) {
    Meteor.vbar_list.splice(index, 1);
  }
});

// --------------------------------------------------------------

Template.vbar.onCreated(function(){
  const iName = this.data.name;
//  console.log('> Template.vbar[%s] (onCreated)', iName);
//  console.log(' -- fsim.coG-ratio (onRendered-2):', Meteor.fsim.get('coG-ratio'));
  Meteor.vbar_list.push(this);
  this.zero = parseInt(this.data.zero) || 0;
  assert((this.zero <= vpos_max), "Overflow for zero");
  const z = this.zero/100;
  this.magic_r = 1 + 4*z*(1-z);

//  console.log(' -- fsim.coG-ratio (onRendered-2a):', Meteor.fsim.get('coG-ratio'));
  this.vpos = new ReactiveVar(this.zero); // to update control position.
//  console.log(' -- fsim.coG-ratio (onRendered-2b):', Meteor.fsim.get('coG-ratio'));
//  console.log(' -- Meteor.fsim.set(%s,%d)',iName,retVal);
  /* bug:
    Meteor.fsim.set(iName, 0); // for outside
    DO NOT set any value here, it may be already initialized.
  */
//  console.log(' -- fsim.coG-ratio (onRendered-3):', Meteor.fsim.get('coG-ratio'));
});


// --------------------------------------------------------------

Template.vbar.onRendered(function(){
  const iName = Template.instance().data.name;
//  console.log('> vabr onRendered (%s)', iName);
//  console.log(' -- fsim.coG-ratio (onRendered-2):', Meteor.fsim.get('coG-ratio'));
  var element = this.find("svg");
//  console.log(' -- element:', element);
  bbox = element.getBoundingClientRect();
//  console.log(' -- BBOX: ', bbox.top, bbox.right, bbox.bottom, bbox.left);

  $(element).addClass(iName); // {{> vbar name="left-vbar"}} What FOR ???
});

// --------------------------------------------------------------

Template.vbar.events({
  'mousewheel': function(e,tp){
    e.preventDefault();
//      console.log('>> mousewheel e.target:', e.target);
    const oe = e.originalEvent;
    var delta;
    if (oe.wheelDelta > 0) {delta = 1;}
    else if (oe.wheelDelta < 0) {delta = -1;}
    else return false;

    const iName = tp.data.name;
    var vpos = tp.vpos.get();
//    var vpos_max = tp.vpos_max;
//    console.log('> wheel change (%s): vpos:%d', iName, vpos);

    vpos += delta;
    if (vpos < 0) delta = 0;
    else if (vpos > vpos_max) delta = 0;
    if (!delta) return false;

/* business for engine.
    // here vpos changed
    const new_target = from_gunits(tp,tp.vbar_pos);
    console.log(' -- pos:%d => %d',tp.vbar_pos, new_target);
    console.log('> new_target:%d', new_target);
    apc.set_target(new_target);
*/

//    console.log(' -- tp.vpos:%d vpos:%d tp.zero:%d tp.magic_r:%d', tp.vpos.get(), vpos, tp.zero, tp.magic_r);
    tp.vpos.set(vpos);
//    console.log(' -- tp.vpos:%d vpos:%d tp.zero:%d tp.magic_r:%d', tp.vpos.get(), vpos, tp.zero, tp.magic_r);
    const retVal = Math.round((vpos-tp.zero)*tp.magic_r)/(vpos_max-tp.zero);
//    console.log(' -- vbar magic_r:',tp.magic_r);
//    console.log(' -- vbar vpos_max:%d :',vpos_max);
//    console.log(' -- vbar tp.zero:%d :',tp.zero);
    console.log(' -- Meteor.fsim.set(%s,%f)',iName,retVal);
    Meteor.fsim.set(iName, retVal);
//    console.log(' -- Meteor.fsim.%s:%s  (%d)',iName, Meteor.fsim.get(iName), retVal);
//    console.log(' -- Meteor.fsim.get(%s)=>',iName, Meteor.fsim.get(iName));
    return false;
    } // mousewheel
}); // events


Template.vbar.events({
  'click': function(e,tp){
    const y = vpos_max - (e.clientY - bbox.top -12) ; // margin.
//    console.log('> Template.vbar[%s] (click) e.clientY %d -> %d', tp.data.name, e.clientY, y);
//    console.log(' -- bbox: ', bbox);
//    console.log(' -- bbox.top: %d -12 => %d', bbox.top, bbox.top-12);
//    console.log(' -- e.clientY - bbox.top -12 : %d', e.clientY - bbox.top -12);
//    console.log(' -- y:%d', y);

    const new_vpos = (y>vpos_max)? vpos_max: (y<0)?0:y; // [0..tp.vpos_max]
//    console.log(' -- new_vpos:%d', new_vpos);

    if (new_vpos == tp.vpos.get()) {
      return false; // unlikely
    }

    tp.vpos.set(new_vpos);
    const retVal = Math.round((new_vpos-tp.zero)*tp.magic_r)/(vpos_max-tp.zero);
    console.log(' -- Meteor.fsim.set(%s,%f)',tp.data.name,retVal);
//    assert((retVal >= 0),'FATAL');
    Meteor.fsim.set(tp.data.name, retVal);
    return false;
  }
});


Template.vbar.helpers({
  vbar_y: ()=>{
    const tp = Template.instance();
//    const av = instance.apc.get().xa ; //+ instance.xa_min; // now we are in [0...]
    const vpos = vpos_max - tp.vpos.get() +5;
    return vpos;
  },
  percent: ()=>{
    const tp = Template.instance(); // vpos must be reactive data source.
//    const av = instance.apc.get().xa ; //+ instance.xa_min; // now we are in [0...]
    const vpos = tp.vpos.get();
    const retVal = Math.round((100*(vpos-tp.zero)*tp.magic_r)/(vpos_max-tp.zero));
    return retVal;
  }
});
