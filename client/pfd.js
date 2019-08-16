var _Template = Template.PFD;

var svg;

_Template.onCreated(()=>{
});



// -----------------------------------------------------------------


var alti = 3000;


_Template.onRendered(function(){
  var element = this.find("svg");
  svg = Snap(element);
  if (!svg) {
      throw new Meteor.error('Snap Unable to find svg');
  }
//  draw_speed_tape();
//  draw_altimeter_tape(3000);

});
