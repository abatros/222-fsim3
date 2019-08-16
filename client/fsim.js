/*
http://www.flaps2approach.com/
*/

Template.hold_resume_button.helpers({
  hold_resume_label: ()=>{
    const ce = Meteor.fsim.get('clock-enabled');
    return (ce) ? 'halt':'resume';
  }
});
Template.hold_resume_button.events({
  'click .js-hold-resume': function(){
    Meteor.fsim.set('clock-enabled', !Meteor.fsim.get('clock-enabled'));
  }
});

// -----------------------------------------------------------------

Template.top_panel_selector.events({
  'click .js-turbines': function(){
    console.log('click -> turbines');
      FlowRouter.go('/');
      return false;
  },
  'click .js-compass': function(){
    console.log('click -> compass');
    FlowRouter.go('/compass');
    return false;
  },
  'click .js-PFD1': function(){
    FlowRouter.go('/pfd1');
    return false;
  },
  'click .js-PFD2': function(){
    FlowRouter.go('/pfd2');
    return false;
  },
  'click .js-webgl': function(){
    FlowRouter.go('/webgl');
    return false;
  },
  'click .js-pixi': function(){
    FlowRouter.go('/pixi');
    return false;
  },
  'click .js-three': function(){
    FlowRouter.go('/three');
    return false;
  },
  'click .js-turbine-dda': function(){
    FlowRouter.go('/turbine-dda');
    return false;
  },
  'click .js-centrage': function(){
    FlowRouter.go('/centrage');
    return false;
  },
  'click .js-psim': function(){
    FlowRouter.go('/test-psim');
    return false;
  },
  'click .js-dash': function(){
    FlowRouter.go('/dash');
    return false;
  },
  'click .js-a1-tests': function(){
    FlowRouter.go('/a1-tests');
    return false;
  },
  'click .js-formules': function(){
    FlowRouter.go('/formules');
    return false;
  }
});
