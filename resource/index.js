'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var LarangularGenerator = yeoman.generators.NamedBase.extend({
	initializing: function() {
		this.log('You called the larangular subgenerator with the argument ' + this.name + '.');
	},
	prompting: function() {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the slick Larangular generator!'
		));

		var prompts = [{
			type: 'input',
			name: 'attrName',
			message: 'What is the name of the attribute (First Name, Last Name,...)?',
			default: 'myAttr'
		}, {
			type: 'list',
			name: 'attrType',
			message: 'What is the type of the attribute?',
			choices: ['String', 'Text', 'Char', 'Integer', 'Float', 'Boolean', 'DateTime', 'Enum', 'Email', 'Password'],
			default: 'String'
		}, {
			when: function(props) {
				return (/Char/).test(props.attrType);
			},
			type: 'input',
			name: 'minLength',
			message: 'Enter the minimum length for the Char attribute, or hit enter:',
			validate: function(input) {
				if (input && isNaN(input)) {
					return "Please enter a number.";
				}
				return true;
			}
		}, {
			when: function(props) {
				return (/Char/).test(props.attrType);
			},
			type: 'input',
			name: 'maxLength',
			message: 'Enter the maximum length for the Char attribute, or hit enter:',
			validate: function(input) {
				if (input && isNaN(input)) {
					return "Please enter a number.";
				}
				return true;
			}
		}, {
			when: function(props) {
				return (/String/).test(props.attrType);
			},
			type: 'input',
			name: 'minLength',
			message: 'Enter the minimum length for the String attribute, or hit enter:',
			validate: function(input) {
				if (input && isNaN(input)) {
					return "Please enter a number.";
				}
				return true;
			}
		}, {
			when: function(props) {
				return (/String/).test(props.attrType);
			},
			type: 'input',
			name: 'maxLength',
			message: 'Enter the maximum length for the String attribute, or hit enter:',
			validate: function(input) {
				if (input && isNaN(input)) {
					return "Please enter a number.";
				}
				return true;
			}
		}, {
			when: function(props) {
				return (/Text/).test(props.attrType);
			},
			type: 'input',
			name: 'minLength',
			message: 'Enter the minimum length for the Text attribute, or hit enter:',
			validate: function(input) {
				if (input && isNaN(input)) {
					return "Please enter a number.";
				}
				return true;
			}
		}, {
			when: function(props) {
				return (/Text/).test(props.attrType);
			},
			type: 'input',
			name: 'maxLength',
			message: 'Enter the maximum length for the Text attribute, or hit enter:',
			validate: function(input) {
				if (input && isNaN(input)) {
					return "Please enter a number.";
				}
				return true;
			}
		}, {
			when: function(props) {
				return (/Integer|Float/).test(props.attrType);
			},
			type: 'input',
			name: 'min',
			message: 'Enter the minimum value for the numeric attribute, or hit enter:',
			validate: function(input) {
				if (input && isNaN(input)) {
					return "Please enter a number.";
				}
				return true;
			}
		}, {
			when: function(props) {
				return (/Integer|Float/).test(props.attrType);
			},
			type: 'input',
			name: 'max',
			message: 'Enter the maximum value for the numeric attribute, or hit enter:',
			validate: function(input) {
				if (input && isNaN(input)) {
					return "Please enter a number.";
				}
				return true;
			}
		}, {
			when: function(props) {
				return (/DateTime/).test(props.attrType);
			},
			type: 'list',
			name: 'dateConstraint',
			message: 'Constrain the date as follows:',
			choices: ['None', 'Past dates only', 'Future dates only'],
			filter: function(input) {
				if (/Past/.test(input)) return 'Past';
				if (/Future/.test(input)) return 'Future';
				return '';
			},
			default: 'None'
		}, {
			when: function(props) {
				return (/Enum/).test(props.attrType);
			},
			type: 'input',
			name: 'enumValues',
			message: 'Enter an enumeration of values, separated by commas'
		}, {
			type: 'confirm',
			name: 'required',
			message: 'Is the attribute required to have a value?',
			default: true
		}, {
			type: 'confirm',
			name: 'again',
			message: 'Would you like to enter another attribute or reenter a previous attribute?',
			default: true
		}];

		this.prompt(prompts, function(props) {
			this.attrs = this.attrs || [];
			var attrType = props.attrType;
			this.attrs = _.reject(this.attrs, function(attr) {
				return attr.attrName === props.attrName;
			});
			this.attrs.push({
				attrName: props.attrName,
				attrType: attrType,
				minLength: props.minLength,
				maxLength: props.maxLength,
				min: props.min,
				max: props.max,
				dateConstraint: props.dateConstraint,
				enumValues: props.enumValues ? props.enumValues.split(',') : [],
				required: props.required
			});

			if (props.again) {
				this.askFor();
			} else {
				cb();
			}
		}.bind(this));
	},
	writing: function() {
		this.baseName = this.generatorConfig.baseName;
		this.databaseType = this.generatorConfig.databaseType;
		this.hostName = this.generatorConfig.hostName;
		this.databaseName = this.generatorConfig.databaseName;
		this.userName = this.generatorConfig.userName;
		this.password = this.generatorConfig.password;
		this.entities = this.generatorConfig.entities;
		this.authenticate = this.generatorConfig.authenticate;
		this.composer = this.generatorConfig.composer;
		this.entities = _.reject(this.entities, function(model) {
			return model.name === this.name;
		}.bind(this));
		this.entities.push({
			name: this.name,
			attrs: this.attrs
		});
		this.pluralize = pluralize;
		this.generatorConfig.entities = this.entities;
		this.generatorConfigStr = JSON.stringify(this.generatorConfig, null, '\t');
	}
});

module.exports = LarangularGenerator;