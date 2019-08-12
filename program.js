/**
 * Set up all your command line options in here.
 */

const program = require('commander')

program.version('0.0.1')
program.option('-d, --dev', 'use development config')

program.parse(process.argv)

console.log('processing args');

if (program.dev) {
  process.env.NODE_ENV = 'development';
} else {
  process.env.NODE_ENV = 'production';
}

module.exports = program;
