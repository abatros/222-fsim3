var _Template = Template['Throttle'];
var max_throttle = 200;
var bbox; // bounding box for this throttle.
// how to differentiate left and right throttle ????
// for now we are using onlt bbox.top : the same for both throttle.

Session.set('throttle', 0); // max:100

var throttle_pos = 0;

function mouseWheelHandler (e) {
    e.preventDefault();
//    console.log('e.target:', e.target);
//    console.log('e.wheelDelta:', e.wheelDelta);
    if (e.wheelDelta > 0) {
//      var throttle = Session.get('throttle-position');
      if (throttle_pos < max_throttle) {
//        console.log('> throttle-up: %d',throttle + 1);
        throttle_pos += 1;
        Session.set('throttle', Math.round(throttle_pos/2));
        Session.set('fuel-flow', Math.round((throttle_pos/2)*100)); // max 10,000
      }
    }
    else if (e.wheelDelta < 0) {
      if (throttle_pos > 0) {
        throttle_pos -= 1;
//        console.log('> throttle-down: %d',throttle - 1);
        Session.set('throttle', Math.round(throttle_pos/2));
        Session.set('fuel-flow', Math.round((throttle_pos/2)*100)); // max 10,000
      }
    }
}


var t_handle; // throttle-handle

_Template.onRendered(function(){
  const t_name = Template.instance().data.name;
  console.log('> onRendered (%s)', t_name);
  var element = this.find("svg");
  console.log(' -- element:', element);
  bbox = element.getBoundingClientRect();
  console.log(' -- BBOX: ', bbox.top, bbox.right, bbox.bottom, bbox.left);


  $(element).addClass(t_name); // {{> Throttle name="left-throttle"}}
  svg = Snap(element); // WOOOOOOOOOOOOOOOOOOOOOOWWWWWWWWWWWWWWWWWWWWWW
  console.log('onRendered svg (%s):', t_name, svg);

  svg.node.addEventListener("mousewheel", mouseWheelHandler, false);
  t_handle = this.find('.throttle-handle');
  console.log('h:', t_handle);
});


_Template.events({
  'click': (e,tp)=>{
    const y = max_throttle - (e.clientY - bbox.top);
    console.log('> onClick e.clientY %d -> %d', e.clientY, y);
    throttle_pos = (y>max_throttle)? max_throttle: (y<0)?0:y;
    Session.set('throttle', Math.round(throttle_pos/2));
    Session.set('fuel-flow', Math.round((throttle_pos/2)*100)); // max 10,000
  }
});


_Template.helpers({
  throttle_y: ()=>{ // must be reactive
    return max_throttle - Session.get('throttle')*2;
  }
});
