var instance_skel = require('../../instance_skel')
var tcp = require('../../tcp')

// var feedback      = require('./feedback');

var debug
var log

function instance(system, id, config) {
	var self = this

	self.priInput = [
		{ id: '10', label: 'HDMI' },
		{ id: '11', label: 'DVI-U' },
		{ id: '12', label: 'PC/HD' },
		{ id: '30', label: 'CV' },
		{ id: '40', label: 'YC' },
		{ id: '50', label: 'SDI 1' },
		{ id: '60', label: 'SDI 2' },
		{ id: 'F1', label: 'Still 2' },
		{ id: 'F2', label: 'Still 3' },
		{ id: 'F3', label: 'Still 4' },
		{ id: 'F4', label: 'Still 5' },
	]

	self.backgroundInput = [
		{ id: '10', label: 'HDMI' },
		{ id: '11', label: 'DVI-U' },
		{ id: '12', label: 'PC/HD' },
		{ id: '30', label: 'CV' },
		{ id: '40', label: 'YC' },
		{ id: '50', label: 'SDI' },
	]

	self.presets = [
		{ id: '01', label: 'Preset 1' },
		{ id: '02', label: 'Preset 2' },
		{ id: '03', label: 'Preset 3' },
		{ id: '04', label: 'Preset 4' },
		{ id: '05', label: 'Preset 5' },
		{ id: '06', label: 'Preset 6' },
		{ id: '07', label: 'Preset 7' },
		{ id: '08', label: 'Preset 8' },
		{ id: '09', label: 'Preset 9' },
		{ id: '0A', label: 'Preset 10' },
		{ id: '0B', label: 'Preset 11' },
		{ id: '0C', label: 'Preset 12' },
	]

	self.logos = [
		{ id: '00', label: 'No Logo' },
		{ id: '01', label: 'Logo 1' },
		{ id: '02', label: 'Logo 2' },
		{ id: '03', label: 'Logo 3' },
		{ id: '04', label: 'Logo 4' },
		{ id: '05', label: 'Logo 5' },
	]

	// super-constructor
	instance_skel.apply(this, arguments)

	return self
}

instance.prototype.updateConfig = function (config) {
	var self = this
	self.config = config
	self.init_tcp()
	self.actions()
}

instance.prototype.init = function () {
	var self = this

	debug = self.debug
	log = self.log

	self.init_tcp()

	self.update_variables() // export variables
	self.init_presets()

	self.actions() // export actions
}

instance.prototype.init_presets = function () {
	var self = this
	var presets = []
	var i

	// Primary Inputs
	for (i = 0; i < self.priInput.length; ++i) {
		presets.push({
			category: 'Primary Input',
			label: self.priInput[i].label,
			bank: {
				style: 'text',
				text: self.priInput[i].label,
				size: '18',
				color: 16777215,
				bgcolor: 0,
			},
			actions: [
				{
					action: 'priInput',
					options: {
						priInput: self.priInput[i].id,
					},
				},
			],
			feedbacks: [
				{
					type: 'priInputFeedback',
					options: {
						bg: self.rgb(255, 0, 0),
						fg: self.rgb(255, 255, 255),
						input: self.priInput[i].id,
					},
				},
			],
		})
	}

	// Background Inputs
	for (i = 0; i < self.backgroundInput.length; ++i) {
		presets.push({
			category: 'Background Input',
			label: self.backgroundInput[i].label,
			bank: {
				style: 'text',
				text: self.backgroundInput[i].label,
				size: '18',
				color: 16777215,
				bgcolor: 0,
			},
			actions: [
				{
					action: 'backgroundInput',
					options: {
						backgroundInput: self.backgroundInput[i].id,
					},
				},
			],
			feedbacks: [
				{
					type: 'bgInputFeedback',
					options: {
						bg: self.rgb(255, 0, 0),
						fg: self.rgb(255, 255, 255),
						bgInput: self.backgroundInput[i].id,
					},
				},
			],
		})
	}

	// Select Preset
	for (i = 0; i < self.presets.length; ++i) {
		presets.push({
			category: 'Presets',
			label: 'Select ' + self.presets[i].label,
			bank: {
				style: 'text',
				text: 'Select ' + self.presets[i].label,
				size: '14',
				color: 16777215,
				bgcolor: 0,
			},
			actions: [
				{
					action: 'selectPreset',
					options: {
						selectedPreset: self.presets[i].id,
					},
				},
			],
		})
	}

	// Save Preset
	presets.push({
		category: 'Presets',
		label: 'Save Preset',
		bank: {
			style: 'text',
			text: 'Save Preset',
			size: '14',
			color: 16777215,
			bgcolor: 0,
		},
		actions: [
			{
				action: 'savePreset',
			},
		],
	})

	// Load Preset
	presets.push({
		category: 'Presets',
		label: 'Load Preset',
		bank: {
			style: 'text',
			text: 'Load Preset',
			size: '14',
			color: 16777215,
			bgcolor: 0,
		},
		actions: [
			{
				action: 'loadPreset',
			},
		],
	})

	// Erase Preset
	presets.push({
		category: 'Presets',
		label: 'Erase Preset',
		bank: {
			style: 'text',
			text: 'Erase Preset',
			size: '14',
			color: 16777215,
			bgcolor: 0,
		},
		actions: [
			{
				action: 'erasePreset',
			},
		],
	})

	// Freeze
	presets.push({
		category: 'Freeze',
		label: 'Set Freeze On',
		bank: {
			style: 'text',
			text: 'Freeze On',
			size: '18',
			color: 16777215,
			bgcolor: 0,
		},
		actions: [
			{
				action: 'freeze',
				options: {
					freeze: '01',
				},
			},
		],
	})

	presets.push({
		category: 'Freeze',
		label: 'Set Freeze Off',
		bank: {
			style: 'text',
			text: 'Freeze Off',
			size: '18',
			color: 16777215,
			bgcolor: 0,
		},
		actions: [
			{
				action: 'freeze',
				options: {
					freeze: '00',
				},
			},
		],
	})

	presets.push({
		category: 'Freeze',
		label: 'Toggle Freeze on and off',
		bank: {
			style: 'text',
			text: 'Freeze',
			size: '18',
			color: 16777215,
			bgcolor: 0,
			latch: true,
		},
		actions: [
			{
				action: 'freeze',
				options: {
					freeze: '01',
				},
			},
		],
		release_actions: [
			{
				action: 'freeze',
				options: {
					freeze: '00',
				},
			},
		],
		feedbacks: [
			{
				type: 'freeze',
				options: {
					fg: this.rgb(255, 255, 255),
					bg: this.rgb(255, 102, 0),
				},
			},
		],
	})

	// Logo
	for (i = 0; i < self.logos.length; ++i) {
		presets.push({
			category: 'Logo',
			label: self.logos[i].label,
			bank: {
				style: 'text',
				text: self.logos[i].label,
				size: '18',
				color: 16777215,
				bgcolor: 0,
			},
			actions: [
				{
					action: 'logo',
					options: {
						logo: self.logos[i].id,
					},
				},
			],
		})
	}

	self.setPresetDefinitions(presets)
}

instance.prototype.init_tcp = function () {
	var self = this
	var receivebuffer = ''

	if (self.socket !== undefined) {
		self.socket.destroy()
		delete self.socket
	}

	if (self.config.port === undefined) {
		self.config.port = 10001
	}

	self.has_data = false

	self.status(self.STATE_WARNING, 'Connecting')

	if (self.config.host) {
		self.socket = new tcp(self.config.host, self.config.port)

		self.socket.on('status_change', function (status, message) {
			self.status(status, message)
		})

		self.socket.on('error', function (err) {
			debug('Network error', err)
			self.status(self.STATE_ERROR, err)
			self.log('error', 'Network error: ' + err.message)
		})

		self.socket.on('connect', function () {
			self.status(self.STATE_OK)
			debug('Connected')
		})

		// separate buffered stream into lines with responses
		self.socket.on('data', function (chunk) {
			var i = 0,
				line = '',
				offset = 0
			receivebuffer += chunk

			while ((i = receivebuffer.indexOf('\r', offset)) !== -1) {
				line = receivebuffer.substr(offset, i - offset)
				offset = i + 1
				self.socket.emit('receiveline', line.toString())
			}

			receivebuffer = receivebuffer.substr(offset)
		})

		self.socket.on('receiveline', function (line) {
			if (line.length == 19) {
				if (line.substr(0, 1) == 'F') {
					if (line.substr(1, 2) == '44') {
						// all good
						cmdRx = line.substr(7, 4)
						switch (cmdRx) {
							case '009C': {
								// freeze
								freezeState = line.substr(15, 2)
								console.log('freeze state: ' + freezeState)
								self.freeze = freezeState
								self.checkFeedbacks('freeze')
								break
							}
							case '0082': {
								// pri input
								priInputState = line.substr(15, 2)
								console.log('feedback pri input: ' + priInputState)
								self.priInputFeedback = priInputState
								self.checkFeedbacks('priInputFeedback')
								break
							}
							case '0149': {
								// background input
								bgInputState = line.substr(15, 2)
								console.log('background input: ' + bgInputState)
								self.bgInputFeedback = bgInputState
								self.checkFeedbacks('bgInputFeedback')
								break
							}
							default: {
								// console.log(line);
							}
						}
					} else {
						self.log('error', 'Error message received from unit: ' + line)
					}
				}
			} else {
				self.log('error', 'Response string incorrect length (' + line.length + ')')
			}
		})
	}
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module is for TVOne Corio C2 universal scaler products',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Device IP',
			width: 6,
			regex: self.REGEX_IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Control port',
			width: 6,
			default: '10001',
			regex: self.REGEX_PORT,
		},
	]
}

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this

	if (self.socket !== undefined) {
		self.socket.destroy()
	}

	debug('destroy', self.id)
}

// Variables and Feedback
instance.prototype.update_variables = function (system) {
	var self = this

	// feedback
	var feedbacks = {}

	feedbacks['freeze'] = {
		label: 'Output Freeze State',
		description: 'Change colour of button on freeze state',
		options: [
			{
				type: 'colorpicker',
				label: 'Foreground colour',
				id: 'fg',
				default: self.rgb(255, 255, 255),
			},
			{
				type: 'colorpicker',
				label: 'Background colour',
				id: 'bg',
				default: self.rgb(255, 102, 0),
			},
		],
	}

	feedbacks['priInputFeedback'] = {
		label: 'Primary Input: Change background colour',
		description: 'Change colour of button on currenly active Primary Input',
		options: [
			{
				type: 'colorpicker',
				label: 'Foreground colour',
				id: 'fg',
				default: self.rgb(255, 255, 255),
			},
			{
				type: 'colorpicker',
				label: 'Background colour',
				id: 'bg',
				default: self.rgb(255, 0, 0),
			},
			{
				type: 'dropdown',
				label: 'Input',
				id: 'input',
				default: '10',
				choices: self.priInput,
			},
		],
	}

	feedbacks['bgInputFeedback'] = {
		label: 'Background Input: Change background colour',
		description: 'Change colour of button on currenly active Background Input',
		options: [
			{
				type: 'colorpicker',
				label: 'Foreground colour',
				id: 'fg',
				default: self.rgb(255, 255, 255),
			},
			{
				type: 'colorpicker',
				label: 'Background colour',
				id: 'bg',
				default: self.rgb(255, 0, 0),
			},
			{
				type: 'dropdown',
				label: 'Input',
				id: 'bgInput',
				default: '10',
				choices: self.backgroundInput,
			},
		],
	}

	self.setFeedbackDefinitions(feedbacks)
}

instance.prototype.presets = function () {
	var self = this
	self.setPresetDefinitions(presets.getPresets(self.label))
}

instance.prototype.actions = function (system) {
	var self = this

	self.setActions({
		freeze: {
			label: 'Set Output Freeze',
			options: [
				{
					type: 'dropdown',
					label: 'Freeze',
					id: 'freeze',
					default: '01',
					choices: [
						{ id: '01', label: 'On' },
						{ id: '00', label: 'Off' },
					],
				},
			],
		},
		selectPreset: {
			label: 'Select Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Select Preset',
					id: 'selectedPreset',
					default: '01',
					choices: self.presets,
				},
			],
		},
		loadPreset: {
			label: 'Load Preset',
		},
		savePreset: {
			label: 'Save Preset',
		},
		erasePreset: {
			label: 'Erase Preset',
		},
		priInput: {
			label: 'Set Primary Input',
			options: [
				{
					type: 'dropdown',
					label: 'Input',
					id: 'priInput',
					default: '10',
					choices: self.priInput,
				},
			],
		},
		backgroundInput: {
			label: 'Set Background Input',
			options: [
				{
					type: 'dropdown',
					label: 'Input',
					id: 'backgroundInput',
					default: '10',
					choices: self.backgroundInput,
				},
			],
		},
		logo: {
			label: 'Set Logo',
			options: [
				{
					type: 'dropdown',
					label: 'Select Logo',
					id: 'logo',
					default: '00',
					choices: self.logos,
				},
			],
		},
	})
}

instance.prototype.feedback = function (feedback, bank) {
	var self = this

	console.log('checking feedback: ' + feedback.type)

	switch (feedback.type) {
		case 'freeze': {
			// console.log('self.freeze: ' + self.freeze);
			if (self.freeze === '01') {
				return {
					color: feedback.options.fg,
					bgcolor: feedback.options.bg,
				}
			}
			break
		}
		case 'priInputFeedback': {
			// console.log('feedback priInput: ' + feedback.options.priInput);
			if (self.priInputFeedback === feedback.options.input) {
				return {
					color: feedback.options.fg,
					bgcolor: feedback.options.bg,
				}
			}
			break
		}
		case 'bgInputFeedback': {
			// console.log('feedback priInput: ' + feedback.options.priInput);
			if (self.bgInputFeedback === feedback.options.bgInput) {
				return {
					color: feedback.options.fg,
					bgcolor: feedback.options.bg,
				}
			}
			break
		}
	}
}

instance.prototype.action = function (action) {
	var self = this
	const opt = action.options

	switch (action.action) {
		case 'freeze': {
			self.sendCmd('040041009C0000' + opt.freeze)
			break
		}
		case 'selectPreset': {
			self.sendCmd('04004102250000' + opt.selectedPreset)
			break
		}
		case 'loadPreset': {
			self.sendCmd('0400410226000001')
			break
		}
		case 'savePreset': {
			self.sendCmd('0400410227000001')
			break
		}
		case 'erasePreset': {
			self.sendCmd('0400410228000001')
			break
		}
		case 'priInput': {
			self.sendCmd('04004100820000' + opt.priInput)
			break
		}
		case 'backgroundInput': {
			self.sendCmd('04004101490000' + opt.backgroundInput)
			break
		}
		case 'logo': {
			self.sendCmd('04006101430000' + opt.logo)
			break
		}
		default:
			break
	}
}

instance.prototype.sendCmd = function (cmdStr) {
	var self = this
	// self.log('info',cmdStr)

	// checksum calculation - add all bytes together and if greater than 0xFF take lowest 8 bits
	var checksum = 0

	// split into 2 character long chunks
	var numChunks = Math.ceil(cmdStr.length / 2)
	var chunks = new Array(numChunks)

	// for each 2 character byte convert to decimal and add them together
	for (var i = 0, o = 0; i < numChunks; ++i, o += 2) {
		chunks[i] = cmdStr.substr(o, 2)
		checksum = checksum + parseInt(chunks[i], 16)
		// self.log('error',chunks[i] + ' : ' + checksum);
	}

	// only take lowest 8 bits
	checksum = checksum & 0xff

	// convert back to a hex string
	var checksumHex = checksum.toString(16)

	// needs a leading zero
	checksumHex = checksumHex.padStart(2, '0')

	// add end of line (ascii 13)
	cmdStr += checksumHex + '\r'

	if (cmdStr.length == 19) {
		if (self.socket !== undefined && self.socket.connected) {
			console.log('sending: ' + cmdStr)
			// start every command with 'F'
			self.socket.send('F' + cmdStr)
		} else {
			debug('Socket not connected :(')
		}
	} else {
		self.log('error', 'Command string incorrect length (' + cmdStr.length + ')')
	}
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
