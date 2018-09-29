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

instance.prototype.configUpdate = function(config) {
	var self = this;

	self.config = config;
};

instance.prototype.init = function() {
	var self = this;
	self.status(0);
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
		'previous_section': { label: 'Previous Section' },
		'next_section': { label: 'Next Section' },
		'previous_track': { label: 'Previous track' },
		'next_track': { label: 'Next track' },
		'fade_up': { label: 'Master brightness - Fade up' },
		'fade_down': { label: 'Master brightness - Fade down' },
		'cue': {
			label: 'Trigger cue',
			options: [{
				type: 'textinput',
				label: 'Cue number',
				id: 'cue',
				default: '0',
				regex: self.REGEX_NUMBER
			}]
		}
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
		'previous_track': '/d3/showcontrol/previoustrack',
		'next_track': '/d3/showcontrol/nexttrack',
		'fade_up': '/d3/showcontrol/fadeup',
		'fade_down': '/d3/showcontrol/fadedown',
		'cue': '/d3/showcontrol/cue'
	};

	if (id == 'cue') {
		args.push({ type: 'f', value: action.options.cue });
	}

	if (osc[id] !== undefined) {
		self.system.emit('osc_send', self.config.host, port, osc[id], args);
	}

};

instance.module_info = {
	label: 'Disguise d3 OSC',
	id: 'disguise',
	version: '0.0.1'
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
