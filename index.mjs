'use strict';


import path from 'node:path';

import axios from 'axios';
import {hrtime} from 'process';


export const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];

export function getMonthName(month){
	return months[Number(month) - 1];
}

export function formatTime(dateStr, timeStr) {
	return new Date(dateStr+' ' + timeStr).toLocaleTimeString()
}

export function getTodayDateString() {
	let today = new Date();
	return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, 0)}-${today.getDate().toString().padStart(2, 0)}`;
}

export function getNowTimeString() {
	let today = new Date();
	return `${today.getHours().toString().padStart(2, 0)}:${today.getMinutes().toString().padStart(2, 0)}`;
}

export function getOnlyDate(date) {
	date = new Date(date);
	return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;
}

export function getOnlyTime(date) {
	// Check where this can be returned `${date.getHours()}:${(date.getMinutes() + 1).toString().padStart(2,0)}`;
	return new Date(date).toLocaleTimeString();
	
}

export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function toTitleCase(str, separator = ' ') {
	return str.split(separator)
		.map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
		.join(' ');
}

export function formatDate(
	datetime,
	showTime = true,
	forFormControl = false,
	formControlWithTime= false
) {
	if (datetime === undefined || datetime === null) {
		return ''
	}
	if (datetime === '') {
		return ''
	} else {
		datetime = new Date(datetime);
		datetime = datetime.toLocaleString('en-IN');
		console.log('tolocaletime ' + datetime)
		
		let [date, time] = datetime.split(', ');
		if (!showTime) {
			time = undefined
		}
		
		let [day, month, year] = date.split('/');
		day = day / 10 < 1 ? '0' + day : day;
		month = month / 10 < 1 ? '0' + month : month;
		
		if (forFormControl) {
			let resp = `${year}-${month}-${day}`;
			console.log('resp ' + resp);
			return resp
		} else if (formControlWithTime){
			if(!time){
				return;
			}
			time = time.trim();
			let [hh, min, sec] = time.split(':');
			let ampm = sec.split(' ')[1];
			let resp = `${year}-${month}-${day}T${ampm === 'pm' ? 12 + parseInt(hh) : hh.padStart(2,0)}:${min.padStart(2,0)}`;
			console.log('respo ', resp)
			return resp;
		}
		return `${day}-${months[Number(month) - 1]}-${year.slice(2)} ${
			time !== undefined ? time.split('.')[0] : ''
		}`
	}
}


export function debounce (a, b, c = false) {
	let d, e;
	return function () {
		function h () {
			d = null;
			c || (e = a.apply(f, g))
		}
		const f = this;
		
		const g = arguments;
		clearTimeout(d);
		d = setTimeout(h, b);
		c && !d && (e = a.apply(f, g));
		return e
	}
}

// Returns true iff arg is neither null nor Array and typeof arg is object and typeof arg.constructor is function
export function isObject(arg) {
	return (
		!(null === arg || Array.isArray(arg)) &&
		'object' === typeof arg &&
		'function' === typeof arg.constructor
	);
}

export function isNonEmptyObject(obj) {
	return isObject(obj) && Reflect.ownKeys(obj).length;
}

export function isNonEmptyString(string) {
	return (
		('string' === typeof string || string instanceof String) && string.length
	);
}


let consoleHolder = console;
export function modConsoleInDebug (bool) {
	if (!bool) {
		consoleHolder = console;
		console = {};
		Object.keys(consoleHolder).forEach(function (key) {
			console[key] = function () {}
		})
	} else {
		console = consoleHolder
	}
}

export function round (value, decimals = 2) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}


export function mergeArrays(oldArr, newArr) {
	return ([...oldArr, ...setDiff(oldArr, newArr)]);
}


export function setDiff(oldArr, newArr) {
	oldArr = new Set(oldArr);
	newArr = new Set(newArr);
	return new Set([...newArr].filter(x => !oldArr.has(x)))
}


export function arrayToObject(array, key, doCollect=false) {
	let obj = {};
	for(let item of array){
		if(doCollect){
			if(obj[item[key]] === undefined){
				obj[item[key]] = []
			}
			obj[item[key]].push(item)
		} else {
			obj[item[key]] = item
		}
	}
	return obj;
}


//TODO - fix error msg  - TypeError: Cannot assign to read only property 'x' of object '#<Immutable>' <Original
// classname> instead of '#<Immutable>. Also it is not required anymore, will move it to a helpers repo and complete
// the todo'
export function immuteClass(Original) {
	const Immutable = class extends Original {
		constructor(...args) {
			super(...args);
			if (new.target === Immutable) {
				Object.freeze(this);
			}
		}
	};
	return Immutable;
}


export function getCurrencyString(amount) {
	if (amount > 0) {
		return "+₹" + amount.toString();
	} else if (amount < 0) {
		return "-₹" + (-1 * amount).toString();
	} else {
		return "₹" + amount.toString();
	}
}

export function* zip(...iterables){
	let iterators = iterables.map(i => i[Symbol.iterator]());
	let index = 0;
	let collector = [];
	
	while (iterators.length > 0){
		while(collector.length < iterators.length) {
			if(index >= iterators.length){
				index = 0;
			}
			const item = iterators[index].next();
			if(item.done){
				iterators.splice(index, 1);
			} else {
				collector.push(item.value);
				index++;
			}
		}
		collector.length && (yield collector);
		collector = [];
	}
}


export class Singleton {
	constructor(child) {
		const instance = Symbol('instance');
		if(!Singleton[instance]){
			Singleton[instance] = child !== null ? child : this;
		}
		return Singleton[instance];
	}
}


/*
https://stackoverflow.com/questions/45395369/how-to-get-console-log-line-numbers-shown-in-nodejs/60305881#60305881
 */
export function superConsole(depth = 0){
	['debug', 'log', 'warn', 'error'].forEach((methodName) => {
		const originalLoggingMethod = console[methodName];
		console[methodName] = (firstArgument, ...otherArguments) => {
			const originalPrepareStackTrace = Error.prepareStackTrace;
			Error.prepareStackTrace = (_, stack) => stack;
			const callee = new Error().stack[depth + 1];
			Error.prepareStackTrace = originalPrepareStackTrace;
			const relativeFileName = path.relative(process.cwd(), callee.getFileName());
			
			const typeName = callee.getTypeName();
			const funcName = callee.getFunctionName();
			const methodName = callee.getMethodName();
			const lineNo = callee.getLineNumber();
			
			
			
			let prefix = `${relativeFileName}::`;
			if(typeName && typeName !== 'Object'){
				prefix += ` class:${typeName} method:${methodName} -`;
			} else if(funcName){
				prefix += ` function:${funcName} -`;
			}
			prefix += ` lineno:${lineNo} -- `;
			
			if (typeof firstArgument === 'string') {
				originalLoggingMethod(prefix + ' ' + firstArgument, ...otherArguments);
			} else {
				originalLoggingMethod(prefix, firstArgument, ...otherArguments);
			}
		};
	});
}


const capAlphaStart = 'A'.codePointAt(0);
const capAlphaEnd = 'Z'.codePointAt(0);

export function camelToSnakeCase(str){
	const acc = [];
	let ix = -1;
	let token = '';
	while(++ix < str.length){
		const asciiCode = str.codePointAt(ix);
		const char = str[ix];
		if( asciiCode >= capAlphaStart && asciiCode <= capAlphaEnd){
			if(token.length){
				acc.push(token.substring(0));
			}
			token = char.toLowerCase();
		} else {
			token += char;
		}
	}
	token.length && acc.push(token)
	return acc.join('_');
}


export function snakeToCamelCase(str){
	return str
		.split('_')
		.map((token, ix) => 0 === ix ? token : `${token[0].toUpperCase()}${token.substring(1)}`)
		.join('');
}


export function changeObjectKeyCase(obj, transformer){
	return Object.fromEntries(
		Object.entries(obj)
			.map(([key, value]) => ([transformer(key), value]))
	);
}


function getDateOrdinal(date){
	return {
		1: 'st',
		2: 'nd',
		3: 'rd'
	}[Number(date) % 10] || 'th';
}


export function getOrdinalDateMonthString(transformer, date){
	date = transformer(date ? date : Date.now());
	date = (new Date(date)).toGMTString().split(' ');
	const day = Number(date[1]);
	
	// 11-19 ordinal is th.
	const ordinal = day >= 10 && day <= 20 ? 'th' : getDateOrdinal(date[1]);
	
	return `${date[1]}${ordinal} ${date[2]}`;
}


export async function httpRequest({method, url, headers, postData, getQueryParams}) {
	// TODO: abstract call to axios providing proper error handling which user can tweak
	const options = {
		method,
		url,
		headers
	};
	(method.toLowerCase() === 'get' && isNonEmptyObject(getQueryParams) && (options.params = getQueryParams)) ||
	(options.data = postData);
	
	return axios(options)
		.then(result => result.data)
		.catch(err => {
			/** When server sends an error response i.e, response code >= 400 */
			if(err.response){
				//	TODO: log error response sent from the server for circuit-breaking and analytics
				throw Error(JSON.stringify(err.response.data));
			}
			/** When request was made but no response was received from the server */
			else if(err.request){
				// TODO: log this request for circuit-breaking and analytics
				throw Error(`No response received from Cloud API for the request for messaging ${payload.to}`);
			} else {
				throw err;
			}
		});
}


export function combine(fnArr){
	return function(...args){
		const initVal = fnArr.pop().apply(this, args);
		return fnArr.reduceRight(function(input, fn) {
			return fn.call(this, input);
		}, initVal);
	}
}


export function asyncFuncTimerProxyFactory(fn, timeUnit = 'milliSecond'){
	const unit = {
		milliSecond: ['ms', 1000000],
		microSecond: ['\u00b5s', 1000]
	};
	
	const tu = unit[timeUnit] || unit.milliSecond;
	
	return new Proxy(fn, {
		async apply(target, thisArg, argList){
			let output;
			let start;
			try{
				superConsole(1);
				start = hrtime.bigint();
				output = await target.apply(thisArg, argList);
				const end = hrtime.bigint();
				console.log(`${target.name} took ${(Number(end - start) / tu[1]).toFixed(3)} ${tu[0]}`);
				return output;
			} catch(err) {
				const end = hrtime.bigint();
				console.log(`${target.name} threw exception ${err} took ${(Number(end - start) / tu[1]).toFixed(3)} ${tu[0]}`);
				throw err;
			} finally {
				superConsole();
			}
		}
	});
}


export function syncFuncTimerProxyFactory(fn, timeUnit = 'milliSecond'){
	const unit = {
		milliSecond: ['ms', 1000000],
		microSecond: ['\u00b5s', 1000]
	};
	
	const tu = unit[timeUnit] || unit.milliSecond;
	
	return new Proxy(fn, {
		apply(target, thisArg, argList){
			let output;
			let start
			try{
				superConsole(1);
				start = hrtime.bigint();
				output = target.apply(thisArg, argList);
				const end = hrtime.bigint();
				console.log(`${target.name} took ${(Number(end - start) / tu[1]).toFixed(3)} ${tu[0]}`);
				return output;
			} catch(err) {
				const end = hrtime.bigint();
				console.log(`${target.name} threw exception ${err} took ${(Number(end - start) / tu[1]).toFixed(3)} ${tu[0]}`);
				throw err;
			} finally {
				superConsole();
			}
		}
	});
}


export function removeAllWhiteSpace(str){
	if(typeof str !== 'string' || !(str instanceof String)){
		throw Error(`${str} must be of type string`);
	}
	return str
		.split(' ')
		.filter(token => token !== '')
		.join('');
}


export function partitionArray(targetArray, predicateArray){
	const resArr = [];
	for(let i = 0; i <= predicateArray.length; i++){
		resArr.push([]);
	}
	
	function partition(acc, item){
		for(let ix = 0 ; ix < predicateArray.length; ix++){
			const predicate = predicateArray[ix];
			if(predicate(item)){
				acc[ix].push(item);
				return acc;
			}
		}
		acc[acc.length - 1].push(item);
		return acc;
	}
	
	return targetArray.reduce(partition, resArr);
}


export function groupArrayItems(targetArray, predicateArray){
	const resArr = [];
	for(let i = 0; i <= predicateArray.length; i++){
		resArr.push([]);
	}
	
	function group(acc, item){
		let addedToAGroup = false;
		for(let ix = 0 ; ix < predicateArray.length; ix++){
			const predicate = predicateArray[ix];
			if(predicate(item)){
				acc[ix].push(item);
				addedToAGroup = true;
			}
		}
		if(false === addedToAGroup){
			acc[acc.length - 1].push(item);
		}
		return acc;
	}
	
	return targetArray.reduce(group, resArr);
}
