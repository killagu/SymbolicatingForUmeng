'use strict';

const debug = require('debug')('symbolicating:atos');
const spawn = require('child_process').spawn;

exports.symbolicStacks = function(architecture, slideAddress, baseAddress, dSYMPath, stacks) {

	return new Promise((resolve, reject) => {
		let result = [];

		function* symbolicStackGenerator() {
			let slideAddressInt = parseInt(slideAddress, 16);
			let baseAddressInt = parseInt(baseAddress, 16);
			while (stacks.length > 0) {
				const stackInfo = stacks.shift();
				const stack = '0x' + (parseInt(stackInfo.address, 16) + slideAddressInt - baseAddressInt).toString(16);
				const stackLine = yield symbolicStack(stack);
				result.push(`${stackInfo.module} ${stack} ${stackLine == stack ? stackInfo.line : stackLine}`);
			}
			resolve(result);
		}

		const generator = symbolicStackGenerator();
		generator.next();

		function symbolicStack(stack) {
			return new Promise((resolve, reject) => {
					let result = '';
					let error = '';

					const atosSpawn = spawn('/usr/bin/atos', ['-o', dSYMPath, '-arch', architecture, stack]);
					atosSpawn.stdout.on('data', function(data) {
						result += data;
					});

					atosSpawn.stderr.on('data', function(data) {
						error += data;
					});

					atosSpawn.on('close', function(code) {
						if (code == 0) {
							return resolve(result.trim());
						} else {
							return reject(new Error(error));
						}
					});
				})
				.then((data) => generator.next(data))
				.catch(err => {
					generator.throw(error)
				});
		}
	});

}