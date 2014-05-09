#!/usr/bin/env node

var http = require('http')
var child = require('child_process')
var findPort = require('find-port')
var os = require('os')
var rc = module.require('rc')
var argv = require('optimist').argv
var config = rc('hcat', {}, argv)

if (argv.usage) {
	console.log(require('./usage.js'))
	process.exit(0)
}

if (config.port) {
	cat(config.port)
} else {
	findPort(8080, 8181, findPortCallback)
}

function findPortCallback(ports) {
	if (ports.length === 0)
		throw new Error('no available ports found between 8080 - 8181')
	else
		cat(ports.pop())
}

function cat(port) {
	var server = http.createServer(handler)
	
	server.listen(port)
	
	var command = 'open'
	
	if (process.platform === 'win32')
		command = 'start'
	
	child.exec(command + ' http://localhost:' + port);
	
	function handler(request, response) {

		var contentType = 'text/html'

		var stream = process.stdin

		response.setHeader('Content-Type', contentType)

		stream.pipe(response)

		response.on('finish', function () {
			process.exit(0)
		})
	}
}