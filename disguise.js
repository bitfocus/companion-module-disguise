var instance_skel = require('../../instance_skel');
var OSC = require('osc');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	instance_skel.apply(this, arguments);
	self.actions();

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_presets();
	self.init_variables();
	self.init_feedbacks();
	self.init_osc();
}

instance.prototype.init = function() {
	var self = this;

	self.status(self.STATUS_OK);
	self.init_presets();
	self.init_variables();
	self.init_feedbacks();
	self.init_osc();
	debug = self.debug;
	log = self.log;
}

instance.prototype.destroy = function() {
	var self = this;

	if (self.listener) {
		self.listener.close();
	}
	debug("destroy", self.id);
}

instance.prototype.config_fields = function() {
	var self = this;

	return [
		{
			type: 'text',
			label: 'Information',
			id: 'info',
			value: 'This module provides default OSC controls to the d3/disguise server. Setup OSC transport within d3/disguise.'
		},
		{
			type: 'textinput',
			label: 'Target IP',
			id: 'host',
			default: '127.0.0.1',
			width: 3,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			label: 'OSC Port',
			id: 'port',
			default: '7401',
			width: 3,
			regex: self.REGEX_PORT
		},
		{
			type: 'textinput',
			label: 'Feedback Port',
			id: 'feedbackPort',
			default: '7400',
			width: 3,
			regex: self.REGEX_PORT
		}
	]
}

instance.prototype.actions = function(system) {
	var self = this;

	self.system.emit('instance_actions', self.id, {
		'play': { label: 'Play' },
		'play_section': { label: 'Play to end of section' },
		'loop_section': { label: 'Loop section' },
		'stop': { label: 'Stop' },
		'previous_section': { label: 'Previous section' },
		'next_section': { label: 'Next section' },
		'return_start': { label: 'Return to start' },
		'previous_track': { label: 'Previous track' },
		'next_track': { label: 'Next track' },
		'track_name': {
			label: 'Track name',
			options: [{
				type: 'textinput',
				label: 'Track name',
				id: 'track_name',
				default: 'track',
				regex: self.REGEX_SOMETHING
			}]
		},
		'track_ID': {
			label: 'Track ID',
			options: [{
				type: 'textinput',
				label: 'Track ID',
				id: 'track_id',
				default: '0',
				regex: self.REGEX_NUMBER
			}]
		},
		'cue': {
			label: 'Cue',
			options: [{
				type: 'textinput',
				label: 'Cue',
				id: 'cue',
				default: '0',
				regex: self.REGEX_NUMBER
			}]
		},
		'fade_up': { label: 'Fade up' },
		'fade_down': { label: 'Fade down' },
		'hold': { label: 'Hold' },
		'volume': {
			label: 'Volume',
			options: [{
				type: 'textinput',
				label: 'Volume',
				id: 'volume',
				default: '100',
				regex: self.REGEX_PERCENT
			}]
		},
		'brightness': {
			label: 'Brightness',
			options: [{
				type: 'textinput',
				label: 'Brightness',
				id: 'brightness',
				default: '100',
				regex: self. REGEX_PERCENT
			}]
		}
	});
}

instance.prototype.sendNoArg = function(str,) {
	var self = this;

	self.system.emit('osc_send', self.config.host, self.config.port, str, []);
	debug('Command =',str)
}

instance.prototype.sendArg = function(str,str2) {
	var self = this;

	self.system.emit('osc_send', self.config.host, self.config.port, str, [str2]);
	debug('Command =',str,str2)
}

instance.prototype.action = function(action) {
	var self = this;

	var cmd;
	var arg;
	var opt = action.options;

	switch (action.action) {

		case 'play':
			cmd = '/d3/showcontrol/play';
			self.sendNoArg(cmd);
			break;
		
		case 'play_section':
			cmd = '/d3/showcontrol/playsection';
			self.sendNoArg(cmd);
			break;
	
		case 'loop_section':
			cmd = '/d3/showcontrol/loop';
			self.sendNoArg(cmd);
			break;

		case 'stop':
			cmd = '/d3/showcontrol/stop';
			self.sendNoArg(cmd);
			break;

		case 'previous_section':
			cmd = '/d3/showcontrol/previoussection';
			self.sendNoArg(cmd);
			break;

		case 'next_section':
			cmd = '/d3/showcontrol/nextsection';
			self.sendNoArg(cmd);
			break;
			
		case 'return_start':
			cmd = '/d3/showcontrol/returntostart';
			self.sendNoArg(cmd);
			break;
			
		case 'previous_track':
			cmd = '/d3/showcontrol/previoustrack';
			self.sendNoArg(cmd);
			break;
			
		case 'next_track':
			cmd = '/d3/showcontrol/nexttrack';
			self.sendNoArg(cmd);
			break;

		case 'track_name':
			cmd = '/d3/showcontrol/trackname';
			arg = {
				type: "s",
				value: opt.track_name
			};
			self.sendArg(cmd,arg);
			break;

		case 'track_ID':
			cmd = '/d3/showcontrol/trackid';
			arg = {
				type: "i",
				value: opt.track_ID
			};
			self.sendArg(cmd,arg);
			break;

		case 'cue':
			cmd = '/d3/showcontrol/cue';
			arg = {
				type: "i",
				value: opt.cue
			};
			self.sendArg(cmd,arg);
			break;

		case 'fade_up':
			cmd = '/d3/showcontrol/fadeup';
			self.sendNoArg(cmd);
			break;

		case 'fade_down':
			cmd = '/d3/showcontrol/fadedown';
			self.sendNoArg(cmd);
			break;

		case 'hold':
			cmd = '/d3/showcontrol/hold';
			self.sendNoArg(cmd);
			break;

		case 'volume':
			cmd = '/d3/showcontrol/volume';
			arg = {
				type: "f",
				value: opt.volume
			};
			self.sendArg(cmd,arg);
			break;

		case 'brightness':
			cmd = '/d3/showcontrol/brightness';
			arg = {
				type: "f",
				value: opt.brightness
			};
			self.sendArg(cmd,arg);
			break;
	}
}

instance.prototype.init_osc = function() {
	var self = this;

	self.ready = true;

	if (self.listener) {
		self.listener.close();
	}

	self.listener = new OSC.UDPPort({
		localAddress: "0.0.0.0",
		localPort: self.config.feedbackPort,
		broadcast: true,
		metadata: true
	});

	self.listener.open();

	self.listener.on("ready", function () {
		self.ready = true;
	});

	self.listener.on("error", function (err) {
		if (err.code == "EADDRINUSE") {
			self.log('error', "Error: Selected port in use." + err.message);
		}
		});

	self.listener.on("message", function (message) {
		if (message.address === '/d3/showcontrol/heartbeat') {
			if (message.args.length > 0) {
				var heartbeat = message.args[0].value;
				self.setVariable('heartbeat', heartbeat);
			}
		} else if (message.address === '/d3/showcontrol/trackposition') {
			if (message.args.length > 0) {
				var trackPosition = message.args[0].value;
				self.setVariable('trackPosition', trackPosition);
				var trackPosition_hh = trackPosition.slice(0,2); // split timecode - hours
				self.setVariable('trackPosition_hh', trackPosition_hh);
				var trackPosition_mm = trackPosition.slice(3,5); // split timecode - minutes
				self.setVariable('trackPosition_mm', trackPosition_mm);
				var trackPosition_ss = trackPosition.slice(6,8); // split timecode - seconds
				self.setVariable('trackPosition_ss', trackPosition_ss);
				var trackPosition_ff = trackPosition.slice(9,11); // split timecode - frames
				self.setVariable('trackPosition_ff', trackPosition_ff);
			}
		} else if (message.address === '/d3/showcontrol/trackname') {
			if (message.args.length > 0) {
				var trackName = message.args[0].value;
				self.setVariable('trackName', trackName);
			}
		} else if (message.address === '/d3/showcontrol/trackid') {
			if (message.args.length > 0) {
				var trackID = message.args[0].value;
				self.setVariable('trackID', trackID);
			}
		} else if (message.address === '/d3/showcontrol/currentsectionname') {
			if (message.args.length > 0) {
				var currentSectionName = message.args[0].value;
				self.setVariable('currentSectionName', currentSectionName);
			}
		} else if (message.address === '/d3/showcontrol/nextsectionname') {
			if (message.args.length > 0) {
				var nextSectionName = message.args[0].value;
				self.setVariable('nextSectionName', nextSectionName);
			}
		} else if (message.address === '/d3/showcontrol/sectionhint') {
			if (message.args.length > 0) {
				var sectionHint = message.args[0].value;
				self.setVariable('sectionHint', sectionHint);
			}
		} else if (message.address === '/d3/showcontrol/volume') {
			if (message.args.length > 0) {
				var volume = message.args[0].value;
				self.setVariable('volume', volume.toFixed(2)*100); // volume in %
			}
		} else if (message.address === '/d3/showcontrol/brightness') {
			if (message.args.length > 0) {
				var brightness = message.args[0].value;
				self.setVariable('brightness', brightness.toFixed(2)*100); // brightness in %
			}
		} else if (message.address === '/d3/showcontrol/bpm') {
			if (message.args.length > 0) {
				var bpm = message.args[0].value;
				self.setVariable('bpm', bpm);
			}
		} else if (message.address === '/d3/showcontrol/playmode') {
			if (message.args.length > 0) {
				var togglePlayMode = message.args[0].value;
				if (togglePlayMode.valueOf() === "Play") {
					self.playMode = "Play";
				} else if (togglePlayMode.valueOf() === "PlaySection") {
					self.playMode = "PlaySection";
				} else if (togglePlayMode.valueOf() === "LoopSection") {
					self.playMode = "LoopSection";
				} else if (togglePlayMode.valueOf() === "Stop") {
					self.playMode = "Stop";
				} else if (togglePlayMode.valueOf() === "HoldSection") {
					self.playMode = "HoldSection";
				} else if (togglePlayMode.valueOf() === "HoldEnd") {
					self.playMode = "HoldEnd";
				}
				self.setVariable('playMode', self.playMode);
				self.checkFeedbacks('playMode');
			}
		}
	});
}

instance.prototype.init_presets = function() {
	var self = this;

	var presets = [];
	
	presets.push({
		category: 'Transport control',
		label: 'Play',
		bank: {
			style: 'text',
			text: 'Play',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		},
		actions: [{
			action: 'play'
		}]
	});
	
	presets.push({
		category: 'Transport control',
		label: 'Play section',
		bank: {
			style: 'text',
			text: 'Play\\nSection',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		},
		actions: [{
			action: 'play_section'
		}]
	});
	
	presets.push({
		category: 'Transport control',
		label: 'Loop section',
		bank: {
			style: 'text',
			text: 'Loop\\nSection',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		},
		actions: [{
			action: 'loop_section'
		}]
	});
	
	presets.push({
		category: 'Transport control',
		label: 'Stop',
		bank: {
			style: 'text',
			text: 'Stop',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		},
		actions: [{
			action: 'stop'
		}]
	});
	
	presets.push({
		category: 'Transport control',
		label: 'Previous section',
		bank: {
			style: 'text',
			text: 'Previous\\nSection',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		},
		actions: [{
			action: 'previous_section'
		}]
	});
	
	presets.push({
		category: 'Transport control',
		label: 'Next section',
		bank: {
			style: 'text',
			text: 'Next\\nSection',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		},
		actions: [{
			action: 'next_section'
		}]
	});

	presets.push({
		category: 'Transport control',
		label: 'Return to start',
		bank: {
			style: 'text',
			text: 'Return\\nStart',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		},
		actions: [{
			action: 'return_start'
		}]
	});

	presets.push({
		category: 'Transport control',
		label: 'Previous track',
		bank: {
			style: 'text',
			text: 'Previous\\nTrack',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		},
		actions: [{
			action: 'previous_track'
		}]
	});

	presets.push({
		category: 'Transport control',
		label: 'Next track',
		bank: {
			style: 'text',
			text: 'Next\\nTrack',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		},
		actions: [{
			action: 'next_track'
		}]
	});

	presets.push({
		category: 'Feedback',
		label: 'Track position',
		bank: {
			style: 'text',
			text: '$(d3osc:trackPosition)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'Track position HH',
		bank: {
			style: 'text',
			text: '$(d3osc:trackPosition_hh)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'Track position MM',
		bank: {
			style: 'text',
			text: '$(d3osc:trackPosition_mm)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'Track position SS',
		bank: {
			style: 'text',
			text: '$(d3osc:trackPosition_ss)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'Track position FF',
		bank: {
			style: 'text',
			text: '$(d3osc:trackPosition_ff)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'Track name',
		bank: {
			style: 'text',
			text: '$(d3osc:trackName)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'Track ID',
		bank: {
			style: 'text',
			text: '$(d3osc:trackID)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'Current section name',
		bank: {
			style: 'text',
			text: '$(d3osc:currentSectionName)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'Next section name',
		bank: {
			style: 'text',
			text: '$(d3osc:nextSectionName)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'Section hint',
		bank: {
			style: 'text',
			text: '$(d3osc:sectionHint)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'Volume',
		bank: {
			style: 'text',
			text: '$(d3osc:volume)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'Brightness',
		bank: {
			style: 'text',
			text: '$(d3osc:brightness)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	presets.push({
		category: 'Feedback',
		label: 'BPM',
		bank: {
			style: 'text',
			text: '$(d3osc:bpm)',
			size: '14',
			color: self.rgb(0,0,0),
			bgcolor: self.rgb(255,255,255)
		}
	});

	self.setPresetDefinitions(presets);
}

instance.prototype.init_variables = function () {
	var self = this;

	var variables = [];
	var heartbeat = '0';
	var trackPosition = '00:00:00:00';
	var trackPosition_hh = "00";
	var trackPosition_mm = "00";
	var trackPosition_ss = "00";
	var trackPosition_ff = "00";
	var trackName = 'None';
	var trackID = '0';
	var currentSectionName = 'None';
	var nextSectionName = 'None';
	var sectionHint = 'None';
	var volume = '100';
	var brightness = '100';
	var bpm = '0';
	var playMode = 'None';

	variables.push({
		label: 'Heartbeat',
		name:  'heartbeat'
	});
	self.setVariable('heartbeat', heartbeat);

	variables.push({
		label: 'Track position',
		name:  'trackPosition'
	});
	self.setVariable('trackPosition', trackPosition);

	variables.push({
		label: 'Track position HH',
		name:  'trackPosition_hh'
	});
	self.setVariable('trackPosition_hh', trackPosition_hh);

	variables.push({
		label: 'Track position MM',
		name:  'trackPosition_mm'
	});
	self.setVariable('trackPosition_mm', trackPosition_mm);

	variables.push({
		label: 'Track position SS',
		name:  'trackPosition_ss'
	});
	self.setVariable('trackPosition_ss', trackPosition_ss);

	variables.push({
		label: 'Track position FF',
		name:  'trackPosition_ff'
	});
	self.setVariable('trackPosition_ff', trackPosition_ff);

	variables.push({
		label: 'Track Name',
		name:  'trackName'
	});
	self.setVariable('trackName', trackName);

	variables.push({
		label: 'Track ID',
		name:  'trackID'
	});
	self.setVariable('trackID', trackID);

	variables.push({
		label: 'Current section name',
		name:  'currentSectionName'
	});
	self.setVariable('currentSectionName', currentSectionName);

	variables.push({
		label: 'Next section name',
		name:  'nextSectionName'
	});
	self.setVariable('nextSectionName', nextSectionName);

	variables.push({
		label: 'Section hint',
		name:  'sectionHint'
	});
	self.setVariable('sectionHint', sectionHint);

	variables.push({
		label: 'Volume',
		name:  'volume'
	});
	self.setVariable('volume', volume);

	variables.push({
		label: 'Brightness',
		name:  'brightness'
	});
	self.setVariable('brightness', brightness);

	variables.push({
		label: 'BPM',
		name:  'bpm'
	});
	self.setVariable('bpm', bpm);

	variables.push({
		label: 'Play mode',
		name:  'playMode'
	});
	self.setVariable('playMode', playMode);

	self.setVariableDefinitions(variables);
}

instance.prototype.init_feedbacks = function() {
	var self = this;

	var feedbacks = {}

	feedbacks['playMode'] = {
		label: 'Change colors based on play mode',
		description: 'Change colors based on play mode',
		options: [
			{
				type: 'colorpicker',
				label: 'Foreground color',
				id: 'fg',
				default: self.rgb(0,0,0)
			},
			{
				type: 'colorpicker',
				label: 'Background color',
				id: 'bg',
				default: self.rgb(255,255,255)
			},
			{
				type: 'dropdown',
				label: 'Play mode',
				id: 'playMode',
				default: 'Play',
				choices: [
					{ id: 'Play', label: 'Playing' },
					{ id: 'PlaySection', label: 'Playing to end of section' },
					{ id: 'LoopSection', label: 'Looping section'},
					{ id: 'Stop', label: 'Stopped'},
					{ id: 'HoldSection', label: 'Holding at end of section'},
					{ id: 'HoldEnd', label: 'Holding at end of track'}
				]
			}
		]
	}

	self.setFeedbackDefinitions(feedbacks);
}

instance.prototype.feedback = function(feedback) {
	var self = this;

	if (feedback.type === 'playMode') {
		if (self.playMode === feedback.options.playMode) {
			return { color: feedback.options.fg, bgcolor: feedback.options.bg }
		}
	}

	return {}
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;
