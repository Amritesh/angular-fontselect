/**
 * Build instructions for grunt.
 *
 * Structure seen in [rprtr](https://github.com/mrmrs/rprtr)
 * by [aputinski](https://github.com/aputinski)
 *
 * @param  {Object} grunt
 * @return {void}
 */
module.exports = function(grunt) {
  'use strict';

  var Helpers = require('./tasks/helpers');
  var config  = Helpers.config;
  var _       = grunt.util._;

  config = _.extend(config, Helpers.loadConfig('./tasks/options/'));

  /* Load grunt tasks from NPM packages */
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');

  grunt.registerTask('_buildapikeys', function() {
    Helpers.setUpApiKeyFile();
    Helpers.ensureApiKeyFileExists();
  });

  grunt.registerTask(
    'tdd',
    'Watch source and test files and execute tests on change',
    function(suite) {
      var tasks = ['_buildapikeys'];
      var watcher = '';
      if (!suite || suite === 'unit') {
        tasks.push('karma:watch:start');
        watcher = 'watch:andtestunit';
      }
      if (!suite || suite === 'e2e') {
        tasks.push('http-server:test', 'shell:startsilenium');
        watcher = 'watch:andteste2e';
      }
      if (!suite) {
        watcher = 'watch:andtestboth';
      }
      tasks.push(watcher);
      grunt.task.run(tasks);
    }
  );

  grunt.registerTask('demo', 'Start the demo app', ['shell:opendemo', 'http-server:demo']);

  grunt.registerTask(
    'test',
    'Execute all the tests',
    function(suite) {
      var tasks = ['_buildapikeys', 'jshint', 'ngtemplates'];
      if (!suite || suite === 'unit') {
        process.env.defaultBrowsers = 'Firefox,Chrome';
        tasks.push('karma:all');
      }
      if (!suite || suite === 'e2e') {
        tasks.push('http-server:test', 'protractor:single');
      }
      grunt.task.run(tasks);
    }
  );


  /* Build dist files. */
  grunt.registerTask('build', 'Build dist files', [
    'ngtemplates',
    '_buildapikeys',
    'shell:buildWFL',
    'less:dist',
    'less:distmin',
    'concat:bannerToDistStyle',
    'concat:bannerToDistStyleMin',
    'concat:dist',
    'uglify'
  ]);

  /* Distribute a new patch version. */

  grunt.registerTask('release', 'Test, bump, build and release.', function(type) {
    grunt.task.run([
      'test',
      'bump-only:' + (type || 'patch'),
      'build',
      'bump-commit'
    ]);
  });

  grunt.registerTask('default', ['test']);

  grunt.initConfig(config);
};
