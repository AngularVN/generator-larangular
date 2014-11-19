'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var LarangularGenerator = yeoman.generators.Base.extend({
  initializing: function() {
    this.pkg = require('../package.json');
  },

  prompting: function() {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the slick Larangular generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'baseName',
      message: 'What is the name of your application?',
      default: 'myApp'
    }, {
      type: 'list',
      name: 'databaseType',
      message: 'Which database would you like to use?',
      choices: ['MySQL', 'SQLite', 'PostgreSQL'],
      default: 'SQLite'
    }, {
      type: 'input',
      name: 'hostName',
      message: 'What is your host name?',
      default: 'localhost'
    }, {
      type: 'input',
      name: 'databaseName',
      message: 'What is your database name?',
      default: 'example'
    }, {
      type: 'input',
      name: 'userName',
      message: 'What is your database user name?',
      default: 'username'
    }, {
      type: 'input',
      name: 'password',
      message: 'What is your database password?',
      default: 'password'
    }, {
      type: 'confirm',
      name: 'authenticate',
      message: 'Are you want include Authentication?',
      default: 'false'
    }, {
      type: 'confirm',
      name: 'composer',
      message: 'Is PHP composer installed globally (so that "composer update" can be run automatically)?',
      default: false
    }];

    this.prompt(prompts, function(props) {
      this.baseName = props.baseName;
      this.databaseType = props.databaseType == 'PostgreSQL' ? 'pgsql' : props.databaseType.toLowerCase();
      this.hostName = props.hostName;
      if (props.databaseType == 'SQLite' && props.databaseName.indexOf('/') != 0) {
        this.databaseName = '/tmp/' + props.databaseName + '.sqlite';
      } else {
        this.databaseName = props.databaseName;
      }
      this.userName = props.userName;
      this.password = props.password;
      this.composer = props.composer;
      this.authenticate = props.authenticate;

      cb();
    }.bind(this));
  },

  writing: {
    app: function() {
      this.entities = [];
      this.generatorConfig = {
        "baseName": this.baseName,
        "databaseType": this.databaseType,
        "hostName": this.hostName,
        "databaseName": this.databaseName,
        "userName": this.userName,
        "password": this.password,
        "authenticate": this.authenticate,
        "entities": this.entities,
        "composer": this.composer,
      };
      this.generatorConfigStr = JSON.stringify(this.generatorConfig, null, '\t');


      var folders = [
        'app',
        'app/commands',
        'app/config',
        'app/controllers',
        'app/controllers/api',
        'app/database',
        'app/database/migrations',
        'app/database/seeds',
        'app/lang',
        'app/lang/en',
        'app/models',
        'app/start',
        'app/storage',
        'app/tests',
        'app/views',
        'bootstrap',
        'public',
        'docs',
      ];

      var files = [
        'app/filters.php',
        'app/routes.php',
        'app/start/artisan.php',
        'app/start/global.php',
        'app/start/local.php',
        'app/config/app.php',
        'app/config/auth.php',
        'app/config/cache.php',
        'app/config/compile.php',
        'app/config/database.php',
        'app/config/mail.php',
        'app/config/queue.php',
        'app/config/remote.php',
        'app/config/services.php',
        'app/config/session.php',
        'app/config/view.php',
        'app/config/workbench.php',
        'app/database/seeds/DatabaseSeeder.php',
        'app/lang/en/pagination.php',
        'app/lang/en/reminders.php',
        'app/lang/en/validation.php',
        'app/views/hello.php',
        'app/models/User.php',
        'public/.htaccess',
        'public/favicon.ico',
        'public/robots.txt',
        'public/index.php',
      ];
      var self = this;
      folders.forEach(function(folder) {
        self.mkdir(folder);
      });

      files.forEach(function(file) {
        self.template('../../' + file, file);
      });
    },

    projectfiles: function() {
      this.copy('../../.editorconfig', '.editorconfig');
      this.copy('../../.gitignore', '.gitignore');
      this.copy('../../.jshintrc', '.jshintrc');
      this.copy('../../.bowerrc', '.bowerrc');
      this.copy('../../package.json', 'package.json');
      this.copy('../../bower.json', 'bower.json');
      this.copy('../../GruntFile.coffee', 'GruntFile.coffee');
    }
  },

  end: function() {
    this.installDependencies();
  }
});

module.exports = LarangularGenerator;