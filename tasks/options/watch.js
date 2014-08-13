var grunt = require('grunt');
var files = require('../files');
var testfiles = files.source.concat(files.sourceStyle).concat([files.allPartials, files.grunt]);
var unitTestfiles = grunt.util._.clone(testfiles).concat([files.unitTests]);
var e2eTestfiles = grunt.util._.clone(testfiles).concat([files.e2eTests]);
var bothTestfiles = grunt.util._.clone(unitTestfiles).concat([files.e2eTests]);

module.exports = {
  andtestunit: {
    files: unitTestfiles,
    tasks: ['ngtemplates', 'karma:watch:run']
  },
  andteste2e: {
    files: e2eTestfiles,
    tasks: ['ngtemplates', 'protractor:tdd']
  },
  andtestboth: {
    files: bothTestfiles,
    tasks: ['ngtemplates', 'karma:watch:run', 'protractor:tdd']
  }
};