/*
    Only 1 centrage => ok for static vars.
    aoa : angle w/damper apply sum fi.mi.dt
*/

/*
https://sarasoueidan.com/blog/svg-coordinate-systems/
*/

/*
Meteor.fsim.set('Dw', parseInt('50'));
console.log(' -- Dw:', Meteor.fsim.get('Dw'));
*/


var aoa_max = 0;

Template.centrage.onCreated(function(){
  console.log('> Template.centrage (onCreated)');
  this.weight = new ReactiveVar(0); // this will update the W on the graphic.
  // how to get info from vbar_apc. ???
  console.log(' -- fsim.coG-ratio (onCreated):', Meteor.fsim.get('coG-ratio'));

});


// -------------------------------------------------------------------


Template.centrage.onRendered(function(){
  aoa_max = Meteor.fsim.get('aoa_max'); // to get the resolution
  console.log('> Template.centrage (onRendered)');
  console.log(' -- fsim.coG-ratio (onRendered):', Meteor.fsim.get('coG-ratio'));
  console.log(' -- Dw:', Meteor.fsim.get('Dw'));
  const svg_element = this.find('svg');
  svg = Snap(svg_element);
  console.log(' -- svg:', svg);
  console.log(' -- fsim.coG-ratio (onRendered-1a):', Meteor.fsim.get('coG-ratio'));
  draw_graphic();
  console.log(' -- fsim.coG-ratio (onRendered-1b):', Meteor.fsim.get('coG-ratio'));

  console.log(' -- fsim.coG-ratio (onRendered-2):', Meteor.fsim.get('coG-ratio'));

  // get/set reading from vbar_apc: we have 4 here...
  console.log(' -- Template:', Meteor.vbar_apc_list);
  Meteor.vbar_apc_list.forEach(function(it){
    console.log(' -- vbar instance name:', it.data);
    switch(it.data.name) {
      case 'weight': vbar_weight = it; break;
      case 'coLt': vbar_coLt = it; break;
//      case 'Lt': vbar_Lt = it; break;
      case 'aoa_tail': vbar_aoa = it; break;
      case 'aoa_body': vbar_aoa_w = it; break;
      default:
        console.log('ALERT unknown vbar_apc instance:',it.data.name);
    }
    console.log(' -- fsim.coG-ratio (onRendered-3):', Meteor.fsim.get('coG-ratio'));

  });

  console.log(' -- fsim.coG-ratio (onRendered):', Meteor.fsim.get('coG-ratio'));


  Meteor.vbar_list.forEach(function(it){
    console.log(' -- vbar instance name:', it.data);
    switch(it.data.name) {
      case 'throttle': vbar_throttle = it; break;
      case 'coG-ratio': vbar_coG_ratio = it; break;
      default:
        console.log('ALERT unknown vbar instance:',it.data.name);
    }
    console.log(' -- fsim.coG-ratio (onRendered-4):', Meteor.fsim.get('coG-ratio'));
  });

//  vbar_coG_ratio.vpos.set(25); //set(Meteor.fsim.get('coG-ratio'));
  vbar_coG_ratio.vpos.set(Meteor.fsim.get('coG-ratio'));
  console.log(' -- fsim.coG-ratio:', Meteor.fsim.get('coG-ratio'));
  console.log(' -- vbar coG-ratio:', vbar_coG_ratio);

//  var interval = Meteor.setInterval(t_handle, 10);
});


const m = 100; // one meter.

var draw_graphic = function(){
  svg.line(10,500, 10 + 64*m, 500);
}

const gr = 300/100;


// --------------------------------------------------------------------

const ias2kts = 2;

Template.centrage.helpers({
  N1: function(){
      const N1 = Meteor.fsim.get('T1-N1'); return N1;
  },
  IAS_kts: function() {
    //return Math.round(Meteor.fsim.get('IAS')*ias2kts);
    return Meteor.fsim.get('a1').dda103.x;
    },
  _coG: function(){return Math.floor(0.1*Meteor.fsim.get("coG"));},
  _coLw: function(){
    const x = Math.floor(0.1*Meteor.fsim.get('coLw'));
    console.log('_coLw:%d', x);
    return x;
    },
  _coLt: function(){return Math.floor(0.1*Meteor.fsim.get('coLt'));},
  _coLe: function(){return Math.floor(0.1*Meteor.fsim.get('coLe'));},
  _LeMAC: function(){return Math.floor(0.1*Meteor.fsim.get('LeMAC'));},
  _TeMAC: function(){
    const x = Math.floor(0.1*Meteor.fsim.get('TeMAC'));
    console.log('_coLw:%d', x);
    return x;
  },
  _Lt: function(){
    const psim = Meteor.get('psim');
    if (psim)
      return psim.dda321.x;
    return 0;
  },
  _CL_tail: function(){return -Meteor.fsim.get('cl-tail')/2;},
  _CL_wing: function(){return -Meteor.fsim.get('cl-wing')/2;},
  _elevator_deg: ()=>{return -Math.round((1500/300)*Meteor.fsim.get('aoa-elevator'))/100;},
  _Lw: function(){
    const cl = Meteor.fsim.get('cl-wing'); // 300
    const v2 = Meteor.fsim.get("v2"); // 150
    return Math.round(10*200*cl*v2/(300*150)/10); // in kgf * 1000
  },
  _Lw_neg: function(){
    const cl = Meteor.fsim.get('cl-wing'); // 300
    const v2 = Meteor.fsim.get("v2"); // 150
    return -Math.round(10*200*cl*v2/(300*150)/10); // in kgf * 1000
  },
  y_aoa_tail: ()=>{
    aoa_max = Meteor.fsim.get('aoa_max');
    const y = Meteor.fsim.get('aoa-tail')*(240/aoa_max); // 240px == aoa_max
    console.log(' -- y_aoa_tail:%dpx aoa_max:%d',y,aoa_max);
    return y;
  },
  _aoa_body_deg: ()=>{
    aoa_max = Meteor.fsim.get('aoa_max'); // 20 deg.
    const a = Math.round(10*Meteor.fsim.get('aoa-body')*(20/aoa_max))/10; //
    console.log(' -- _aoa_body:%d deg aoa_max:%d',a,aoa_max);
    return a;
  },
  _aoa_tail_deg: ()=>{
    aoa_max = Meteor.fsim.get('aoa_max'); // 20 deg.
    const a = Math.round(10*Meteor.fsim.get('aoa-tail')*(20/aoa_max))/10; //
    console.log(' -- _aoa_tail:%d deg aoa_max:%d',a,aoa_max);
    return a;
  },
  _aoa_tail_deg_neg: ()=>{
    aoa_max = Meteor.fsim.get('aoa_max'); // 20 deg.
    const a = Math.round(10*Meteor.fsim.get('aoa-tail')*(20/aoa_max))/10; //
    console.log(' -- _aoa_tail:%d deg aoa_max:%d',a,aoa_max);
    return -a;
  }
});
