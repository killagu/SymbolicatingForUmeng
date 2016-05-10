'use strict';

const fs = require('fs');
const debug = require('debug')('symbolicating:umeng');
const atos = require('./atos');

const logPath = process.argv[2];
const dSYMDir = process.argv[3];

const kdSYMUUID = 'dSYM UUID';
const kBaseAddress = 'Base Address';
const kSlideAddress = 'Slide Address';
const kArchitecture = 'CPU Type';
const kAddressSepator = ': ';

const kStackStart = '((';
const kStackEnd = ')';

findLogFile(logPath)
	.then(findCrashInfo)
	.then(({
		slideAddress,
		baseAddress,
		dSYMUUID,
		architecture,
		stacks
	}) => {
		return finddSYMFile(dSYMUUID, dSYMDir).then(dSYMPath => {
			debug(dSYMPath);
			return atos.symbolicStacks(architecture, slideAddress, baseAddress, dSYMPath, stacks)
		});
	})
	.then(stacks => console.log(stacks))
	.catch(err => console.log(err.stack))
	.then(() => process.exit(0));

function finddSYMFile(dSYMUUID, dSYMDir) {
	return new Promise((resolve, reject) => {
		const path = `${dSYMDir}/${dSYMUUID}.dSYM/Contents/Resources/DWARF/`;
		fs.readdir(path, (err, list) => {
			if (err) {
				return reject(err);
			}
			if (list.length == 0) {
				return reject(new Error('can not find DWARF'));
			}
			return resolve(`${path}${list[0]}`);
		})
	});
}

function findLogFile(logPath) {
	return new Promise((resolve, reject) => {
		fs.readFile(logPath, (err, file) => {
			if (err) {
				debug('find log file error: ' + err);
				return reject(err);
			}
			return resolve(new String(file));
		})
	})
}

function findCrashInfo(file) {
	return new Promise((resolve, reject) => {
		return resolve({
			architecture: findAddress(file, kArchitecture),
			slideAddress: findAddress(file, kSlideAddress),
			baseAddress: findAddress(file, kBaseAddress),
			dSYMUUID: findAddress(file, kdSYMUUID),
			stacks: findStack(file)
		});
	});

	function findStack(file) {
		let stackInfo = file.substring(file.indexOf(kStackStart) + kStackStart.length);
		stackInfo = stackInfo.substring(0, stackInfo.indexOf(kStackEnd));
		return stackInfo
			.split('\n')
			.filter(stack => stack.indexOf('0x') > 0)
			.map(stack => {
				let stackModule = stack.substring(stack.indexOf(' '),stack.indexOf('0x')).trim();
				let stackInfo = stack.substring(stack.indexOf('0x'));
				let stackAddress;
				let stackLine;
				if (stackInfo.indexOf(' ') > 0) {
					stackAddress = stackInfo.substring(0, stackInfo.indexOf(' '));
					stackLine = stackInfo.substring(stackInfo.indexOf(' ') + 1);
				}
				return {
					address: stackAddress,
					line: stackLine,
					module: stackModule
				};
			})
	}

	function findAddress(file, addressName) {
		let address = file.substring(file.indexOf(addressName));
		if (address.indexOf('\n') > 0) {
			address = address.substring(address.indexOf(': ') + 2, address.indexOf('\n'));
		} else {
			address = address.substring(address.indexOf(': ') + 2);
		}
		debug(`${addressName}: ${address}`);
		return address;
	}
}