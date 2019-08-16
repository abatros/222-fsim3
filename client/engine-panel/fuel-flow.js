var _Template = Template.fuel_flow;

var svg;


_Template.onCreated(()=>{
});

_Template.onRendered(function(){
  const t_name = Template.instance().data.name;
  var element = this.find("svg");
//  console.log('>> onRendered svg element (%s) element:', t_name, element);
  $(element).addClass(t_name); // argument {{> epr_panel name="left"}}
  svg = Snap(element); // WOOOOOOOOOOOOOOOOOOOOOOWWWWWWWWWWWWWWWWWWWWWW
if (!svg) {
  throw new Meteor.error('NO fuel-flow handle');
}
});


const rat1 = Math.round(12000/400);

_Template.helpers({
  fuel_flow: function(){
    var turbine = Session.get('turbine');
    return turbine.fuel_flow; // kg/h
  }
});
