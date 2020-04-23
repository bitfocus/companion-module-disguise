var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;
};

instance.prototype.init = function() {
	var self = this;
	self.status(0);
	console.log("init", config);
	debug = self.debug;
	log = self.log;
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module sends default OSC controls to the d3/disguise server. Remember to set up the server to receive OSC.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'OSC Port',
			width: 6,
			default: '51000',
			regex: self.REGEX_PORT
		}

	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	debug("destroy");
};

instance.prototype.actions = function(system) {
	var self = this;

	self.system.emit('instance_actions', self.id, {
		'play': { label: 'Play' },
		'play_to_end': { label: 'Play to end of section' },
		'loop_section': { label: 'Loop section' },
		'stop': { label: 'Stop' },

		'return_to_start': {
			label: 'Return to start'
		},

		'previous_section': { label: 'Section - Previous' },
		'next_section': { label: 'Section - Next' },

		'previous_track': { label: 'Track - Previous' },
		'next_track': { label: 'Track - Next' },

		'track_id': {
			label: 'Goto - Track ID',
			options: [{
				type: 'textinput',
				label: 'Track ID',
				id: 'track_id',
				default: '0',
				regex: self.REGEX_NUMBER
			}]
		},

		'track_name': {
			label: 'Goto - Track Name',
			options: [{
				type: 'textinput',
				label: 'Track Name',
				id: 'track_name',
				default: 'track',
				regex: self.REGEX_SOMETHING
			}]
		},

		'cue': {
			label: 'Goto - CUE',
			options: [{
				type: 'textinput',
				label: 'CUE number',
				id: 'cue',
				default: '0',
				regex: self.REGEX_NUMBER
			}]
		},

		'brightness': {
			label: 'Master Brightness - Set',
			options: [{
				type: 'textinput',
				label: 'Brightness (0-100)',
				id: 'brightness',
				default: '100',
				regex: self.REGEX_PERCENT
			}]
		},

		'fade_up': { label: 'Master Brightness - Fade up' },
		'fade_down': { label: 'Master Brightness - Fade down' },

		'volume': {
			label: 'Master Volume - Set',
			options: [{
				type: 'textinput',
				label: 'Volume (0-100)',
				id: 'volume',
				default: '100',
				regex: self.REGEX_PERCENT
			}]
		},

		'hold': { label: 'Hold' }
	});

}

instance.prototype.action = function(action) {
	var self = this;
	var args = [];
	var id = action.action;
	var port = (parseInt(self.config.port) > 1024 ? parseInt(self.config.port) : 51000);

	debug('run action:', id);

	var osc = {

		'play': '/d3/showcontrol/play',
		'play_to_end': '/d3/showcontrol/playsection',
		'loop_section': '/d3/showcontrol/loop',
		'stop': '/d3/showcontrol/stop',

		'previous_section': '/d3/showcontrol/previoussection',
		'next_section': '/d3/showcontrol/nextsection',

		'track_id': '/d3/showcontrol/trackid',
		'track_name': '/d3/showcontrol/trackname',

		'previous_track': '/d3/showcontrol/previoustrack',
		'next_track': '/d3/showcontrol/nexttrack',

		'brightness': '/d3/showcontrol/brightness',
		'fade_up': '/d3/showcontrol/fadeup',
		'fade_down': '/d3/showcontrol/fadedown',

		'cue': '/d3/showcontrol/cue',
		'return_to_start': '/d3/showcontrol/returntostart',
		'volume': '/d3/showcontrol/volume',

		'hold': '/d3/showcontrol/hold'

	};

	if (id == 'cue') {
		args.push({ type: 'f', value: action.options.cue });
	}

	else if (id == 'track_id') {
		args.push({ type: 'i', value: action.options.track_id });
	}

	else if (id == 'track_name') {
		args.push({ type: 's', value: action.options.track_name });
	}

	else if (id == 'volume') {
		args.push({ type: 'f', value: (parseInt(action.options.volume) / 100) });
	}

	else if (id == 'brightness') {
		args.push({ type: 'f', value: (parseInt(action.options.brightness) / 100) });
	}

	if (osc[id] !== undefined) {
		log("send osc", osc[id],args)
		self.system.emit('osc_send', self.config.host, port, osc[id], args);
	}

};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
