var _Template = Template['dummy_panel'];

var svg;

_Template.onCreated(()=>{
});

_Template.onRendered(function(){
  const t_name = Template.instance().data.name;
  var element = this.find("svg");
  console.log('>> onRendered svg element (%s) element:', t_name, element);
  $(element).addClass(t_name); // argument {{> epr_panel name="left"}}
  svg = Snap(element); // WOOOOOOOOOOOOOOOOOOOOOOWWWWWWWWWWWWWWWWWWWWWW
  console.log('onRendered svg (%s):', t_name, svg);
//  var x = svg.line(10,10,50,50);
//  svg.rect(100,100,100,100).attr({background-color:'red', color:'yellow'});
});
