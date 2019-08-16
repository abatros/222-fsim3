FlowRouter.route('/', {
  name: 'home',
  action: function(){
      BlazeLayout.render('engine_panel');
  }
});

FlowRouter.route('/dda-tests', {
  name: 'dda-tests',
  action: function(){
      BlazeLayout.render('dda_tests');
  }
});

FlowRouter.route('/pfd1', {
  name: 'pfd1',
  action: function(){
      BlazeLayout.render('PFD');
  }
});

FlowRouter.route('/pfd2', {
  name: 'pfd2',
  action: function(){
      BlazeLayout.render('pfd2');
  }
});


FlowRouter.route('/compass', {
  name: 'compass',
  action: function(){
      BlazeLayout.render('compass');
  }
});

FlowRouter.route('/webgl', {
  name: 'webgl',
  action: function(){
      BlazeLayout.render('webgl');
  }
});

FlowRouter.route('/pixi', {
  name: 'pixi',
  action: function(){
      BlazeLayout.render('pixi');
  }
});


FlowRouter.route('/three.js', {
  name: 'three.js',
  action: function(){
      BlazeLayout.render('three');
  }
});

FlowRouter.route('/turbine-dda', {
  name: 'turbine-dda',
  action: function(){
      BlazeLayout.render('turbine_dda');
  }
});


FlowRouter.route('/centrage', {
  name: 'centrage',
  action: function(){
      BlazeLayout.render('centrage');
  }
});


FlowRouter.route('/test-cosine', {
  name: 'test_cosine',
  action: function(){
      BlazeLayout.render('test_cosine');
  }
});

FlowRouter.route('/test-cosine2', {
  name: 'test_cosine2',
  action: function(){
      BlazeLayout.render('test_cosine2');
  }
});

FlowRouter.route('/test-v2', {
  name: 'test-v2',
  action: function(){
      BlazeLayout.render('test_square');
  }
});

FlowRouter.route('/test-inverse', {
  name: 'test-inverse',
  action: function(){
      BlazeLayout.render('test_inverse');
  }
});

FlowRouter.route('/test-inverse2', {
  name: 'test-inverse2',
  action: function(){
      BlazeLayout.render('test_inverse2');
  }
});


FlowRouter.route('/test-N1', {
  name: 'test-N1',
  action: function(){
      BlazeLayout.render('test_turbine');
  }
});

FlowRouter.route('/test-psim', {
  name: 'test-psim',
  action: function(){
      BlazeLayout.render('test_psim');
  }
});

FlowRouter.route('/test-servo', {
  name: 'test-servo',
  action: function(){
      BlazeLayout.render('test_servo');
  }
});

FlowRouter.route('/test-servo-inverse', {
  name: 'test-servo-inverse',
  action: function(){
      BlazeLayout.render('test_servo_inverse');
  }
});

FlowRouter.route('/dash', {
  name: 'dash',
  action: function(){
      BlazeLayout.render('dash');
  }
});

FlowRouter.route('/a1-tests', {
  name: 'a1-test',
  action: function(){
      BlazeLayout.render('a1_tests');
  }
});

FlowRouter.route('/formules', {
  name: 'formules',
  action: function(){
      BlazeLayout.render('formules');
  }
});
