// https://github.com/sampumon/SVG.toDataURL

import './engine-panel.html';
import './engine-panel-background.html';
import './epr-panel.js';

var TP = Template.engine_panel;

var svg;

TP.onRendered(function() {
  const tp = this;
  const div_ep = tp.find('div#engine-panel')
  const {clientWidth:width, clientHeight:height} = div_ep;
  console.log({div_ep})
  console.log(`wd:${width} ht:${height}`);
});


FlowRouter.route('/', {
  name: 'engine-panel',
  action: function(){
      BlazeLayout.render('engine_panel');
  }
});
