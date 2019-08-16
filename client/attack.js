var max_y = 200; // total 200 pixels.
var bbox; // bounding box for this attack.
// how to differentiate left and right attack ????
// for now we are using onlt bbox.top : the same for both attack.

var attack_y = 100;  // half way

Session.set('aoa', 0); // -100 +100


function mouseWheelHandler (e) {
    e.preventDefault();
//    console.log('e.target:', e.target);
//    console.log('e.wheelDelta:', e.wheelDelta);
    if (e.wheelDelta > 0) {
//      var attack = Session.get('attack-position');
      if (attack_y < max_y) {
//        console.log('> attack-up: %d',attack + 1);
        attack_y += 1;
        const aoa = -Math.round(attack_y - max_y/2);
        Session.set('aoa', aoa);
        Session.set('c-drag', compute_cdrag(aoa));
        Session.set('c-lift', compute_clift(aoa));
      }
    }
    else if (e.wheelDelta < 0) {
      if (attack_y > 0) {
        attack_y -= 1;
//        console.log('> attack-down: %d',attack - 1);
        const aoa = -Math.round(attack_y - max_y/2);
        Session.set('aoa', aoa);
        Session.set('c-drag', compute_cdrag(aoa));
        Session.set('c-lift', compute_clift(aoa));
      }
    }
}


var t_handle; // attack-handle

Template.attack.onRendered(function(){
  const t_name = Template.instance().data.name;
  console.log('> onRendered (%s)', t_name);
  var element = this.find("svg");
  console.log(' -- element:', element);
  bbox = element.getBoundingClientRect();
  console.log(' -- BBOX (attack): ', bbox.top, bbox.right, bbox.bottom, bbox.left);


  $(element).addClass(t_name); // {{> attack name="left-attack"}}
  svg = Snap(element); // WOOOOOOOOOOOOOOOOOOOOOOWWWWWWWWWWWWWWWWWWWWWW
  console.log('onRendered svg (%s):', t_name, svg);

  svg.node.addEventListener("mousewheel", mouseWheelHandler, false);
  t_handle = this.find('.attack-handle');
  console.log('h:', t_handle);
});


Template.attack.events({
  'click': (e,tp)=>{
    const y = max_y - (e.clientY - bbox.top);
    console.log('> onClick e.clientY %d -> %d', e.clientY, y);
    attack_y = (y>max_y)? max_attack: (y<0)?0:y;
    const aoa = -Math.round(attack_y - max_y/2);
    Session.set('aoa', aoa);
    Session.set('c-drag', compute_cdrag(aoa));
    Session.set('c-lift', compute_clift(aoa));
  }
});


Template.attack.helpers({
  attack_y: ()=>{
    return max_y/2 + (Session.get('aoa')/100)*(max_y/2);
  }
});


function compute_cdrag(aoa) {
  var cdrag = 50;
  if (aoa >= 0) cdrag += aoa*0.50;
  else cdrag -= aoa*0.50;
  return Math.round(cdrag);
}

/*
    See PNG chart
    aoa    CL
    -5     0
    +5     1
    10     1.5
    15     1.75 MAX - stall
*/

function compute_clift(aoa) {
  var cl = 0;
  cl += aoa * 1.00; // approx Ok. for tests.
  return Math.round(cl);
}


Session.set('c-drag', compute_cdrag(0));
Session.set('c-lift', compute_clift(0));

Template.registerHelper("c_drag", function () {
  return Session.get('c-drag');
});

Template.registerHelper("c_lift", function () {
  return Session.get('c-lift');
});

Template.registerHelper("aoa", function () {
  return Session.get('aoa');
});
