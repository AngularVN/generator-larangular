'use strict';
var util = require('util'),
  path = require('path'),
  yeoman = require('yeoman-generator'),
  yosay = require('yosay'),
  fs = require('fs'),
  _ = require('lodash'),
  _s = require('underscore.string'),
  pluralize = require('pluralize'),
  asciify = require('asciify');


var LarangularGenerator = module.exports = function LarangularGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function() {
    this.installDependencies({
      skipInstall: options['skip-install']
    });

    if (this.generatorConfig.databaseType === 'sqlite') {
      this.spawnCommand('sqlite3', ['-line', this.generatorConfig.databaseName, 'select 1']);
    }

    if (this.generatorConfig.composer) {
      this.spawnCommand('composer', ['update']);
    }
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(LarangularGenerator, yeoman.generators.Base);


LarangularGenerator.prototype.rebuild = function rebuild() {
  this.generatorConfig = this.dest.readJSON('generator.json');
  this.baseURL = this.generatorConfig.baseURL;
  this.baseName = this.generatorConfig.baseName;
  this.databaseType = this.generatorConfig.databaseType;
  this.hostName = this.generatorConfig.hostName;
  this.databaseName = this.generatorConfig.databaseName;
  this.userName = this.generatorConfig.userName;
  this.password = this.generatorConfig.password;
  this.entities = this.generatorConfig.entities;
  this.authenticate = this.generatorConfig.authenticate;
  this.composer = this.generatorConfig.composer;
  this.pluralize = pluralize;
  this._s = _s;
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
    'app/storage/meta',
    'app/storage/logs',
    'app/storage/views',
    'app/storage/cache',
    'app/storage/sessions',
    'app/tests',
    'app/views',
    'bootstrap',
    'public',
    'docs',
    'source',
    'source/js',
    'source/views',
    'source/views/home',
    'source/styles-less',
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
    'app/controllers/BaseController.php',
    'app/database/seeds/DatabaseSeeder.php',
    'app/lang/en/pagination.php',
    'app/lang/en/reminders.php',
    'app/lang/en/validation.php',
    'app/views/index.php',
    'app/models/User.php',
    'public/.htaccess',
    'public/favicon.ico',
    'public/robots.txt',
    'public/index.php',
    'bootstrap/autoload.php',
    'bootstrap/paths.php',
    'bootstrap/start.php',
    'artisan',
    'server.php',
    'package.json',
    'bower.json',
    'composer.json',
    'GruntFile.coffee',
    '.editorconfig',
    '.gitignore',
    '.jshintrc',
    '.bowerrc',
  ];
  var template = '../../templates/';
  var sourceJsDir = 'source/js/';
  var sourceLessDir = 'source/styles-less/';
  var self = this;
  folders.forEach(function(folder) {
    self.mkdir(folder);
  });

  files.forEach(function(file) {
    self.copy(template + file, file);
  });

  self.template(template + 'public/index.php', 'source/index.php');
  self.template(template + 'app/views/index.php', 'app/views/index.php');
  self.template(template + 'app/routes.php', 'app/routes.php');
  this.template(template + 'client/styles-less/_common.less', sourceLessDir + 'common.less');
  this.template(template + 'client/styles-less/_app.less', sourceLessDir + 'app.less');
  this.template(template + 'client/js/_app.js', sourceJsDir + 'app.js');
  this.template(template + 'client/js/_filters.js', sourceJsDir + 'filters.js');
  this.template(template + 'client/js/_services.js', sourceJsDir + 'services.js');
  this.template(template + 'client/js/_directives.js', sourceJsDir + 'directives.js');
  this.template(template + 'client/js/_controllers.js', sourceJsDir + 'controllers.js');
  this.template(template + 'client/js/home/_home-controller.js', sourceJsDir + 'home/home-controller.js');

  this.template(template + 'client/htaccess', 'source/.htaccess');
  this.template(template + 'client/_index.html', 'source/index.html');
  this.template(template + 'client/views/_nav.html', 'source/views/nav.html');
  this.template(template + 'client/views/_flash.html', 'source/views/flash.html');
  this.template(template + 'client/views/_header.html', 'source/views/header.html');
  this.template(template + 'client/views/_signin.html', 'source/views/signin.html');
  this.template(template + 'client/views/home/_home.html', 'source/views/home/_home.html');

  _.each(this.entities, function(entity) {
    this.name = entity.name;
    this.attrs = entity.attrs;
    var d = new Date();
    var dateStr = d.getFullYear() + '_' + d.getMonth() + '_' + d.getDate() + '_' + d.getTime();
    this.template(template + 'client/styles-less/_model.less', sourceLessDir + entity.name.toLowerCase() + '.less');
    this.template(template + 'app/models/_model.php', 'app/models/' + _s.classify(entity.name) + '.php');
    this.template(template + 'app/controllers/api/_controller.php', 'app/controllers/api/' + _s.classify(entity.name) + 'Controller.php');
    this.template(template + 'app/database/migrations/_migration.php', 'app/database/migrations/' + dateStr + '_create_' + _s.classify(entity.name) + '_table.php');

    var publicEntityJsDir = sourceJsDir + entity.name + '/';
    var publicEntityViewDir = 'source/views/' + entity.name + '/';
    this.mkdir(publicEntityJsDir);
    this.mkdir(publicEntityViewDir);

    this.template(template + 'client/js/_model-controller.js', publicEntityJsDir + entity.name + '-controller.js');
    this.template(template + 'client/js/_model-router.js', publicEntityJsDir + entity.name + '-router.js');
    this.template(template + 'client/js/_model-service.js', publicEntityJsDir + entity.name + '-service.js');
    this.template(template + 'client/views/_models.html', publicEntityViewDir + pluralize(entity.name) + '.html');
    this.template(template + 'client/views/_model-modal.html', publicEntityViewDir + entity.name + '-modal.html');
  }.bind(this));
};