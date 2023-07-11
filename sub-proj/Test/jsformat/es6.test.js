const PI = 3.141593;

//  only in ES5 through the help of object properties
//  and only in global context and not in a block scope
Object.defineProperty(typeof global === "object" ? global : window, "PI", {
	value: 3.141593,
	enumerable: true,
	writable: false,
	configurable: false
})

for (let i = 0; i < a.length; i++) {
	let x = a[i]
}
for (let i = 0; i < b.length; i++) {
	let y = b[i]
}

let callbacks = []
for (let i = 0; i <= 2; i++) {
	callbacks[i] = function () {
		return i * 2
	}
}

odds = evens.map(v => v + 1);
pairs = evens.map(v => ({
			even: v,
			odd: v + 1
		}));
nums = evens.map((v, i) => v + i);

nums.forEach(v => {
	if (v % 5 === 0)
		fives.push(v);
});

this.nums.forEach((v) => {
	if (v % 5 === 0) {
		this.fives.push(v);
	}
});

function f(x, y = 7, z = 42) {
	return x + y + z
}

function f(x, y, ...a) {
	return (x + y) * a.length;
}

var params = ["hello", true, 7]
var other = [1, 2, ...params]; // [ 1, 2, "hello", true, 7 ]
f(1, 2, ...params) === 9;
var str = "foo";
var chars = [...str]; // [ "f", "o", "o" ]

var customer = {
	name: "Foo"
};
var card = {
	amount: 7,
	product: "Bar",
	unitprice: 42
};

message = `Hello ${customer.name},
want to buy ${card.amount} ${card.product} for
a total of ${card.amount * card.unitprice} bucks?`;
vddd = 0;

get `http://example.com/foo?bar=${bar + baz}&quux=${quux}`;

function quux(strings, ...values) {
	strings[0] === "foo\n"
	strings[1] === "bar"
	strings.raw[0] === "foo\\n"
	strings.raw[1] === "bar"
	values[0] === 42
}

quux `foo\n${42}bar`
String.raw `foo\n${42}bar` === "foo\\n42bar"

var xxx = 0b111110111;
var yyy = sdfasdf - -0o767;

"𠮷".length === 2;
"𠮷".match(/./u)[0].length === 2;
5 | "𠮷" === "\uD842\uDFB7";

for (let codepoint of "𠮷")
	console.log(codepoint);
"𠮷" === "\u{20BB7}";
"𠮷".codePointAt(0) == 0x20BB7

let parser = (input, match) => {
	for (let pos = 0, lastPos = input.length; pos < lastPos; ) {
		for (let i = 0; i < match.length; i++) {
			match[i].pattern.lastIndex = pos;
			let found;
			if ((found = match[i].pattern.exec(input)) !== null) {
				match[i].action(found);
				pos = match[i].pattern.lastIndex;
				break;
			}
		}
	}
}

let report = (match) => {
	console.log(JSON.stringify(match));
};
parser("Foo 1 Bar 7 Baz 42", [{
			pattern: /^Foo\s+(\d+)/y,
			action: (match) => report(match)
		}, {
			pattern: /^Bar\s+(\d+)/y,
			action: (match) => report(match)
		}, {
			pattern: /^Baz\s+(\d+)/y,
			action: (match) => report(match)
		}, {
			pattern: /^\s*/y,
			action: (match) => {}
		}
	]);

sdfasdf => {
	sdfadfs
};

obj = {
	x,
	y
};

let obj = {
	foo: "bar",
	["baz" + quux()]: 42
};

obj = {
	foo(a, b) {
		x = 1;
	},
	bar(x, y) {
		x = 2;
	},
	 * quux(x, y) {
		x = 3;
	}
};

var {
	op,
	lhs,
	rhs
} = getASTNode();

function f([name, val]) {
	console.log(name, val);
}
function g({
	name: n,
	val: v
}) {
	console.log(n, v);
}
function h({
	name,
	val
}) {
	console.log(name, val);
}
f(["bar", 42]);
g({
	name: "foo",
	val: 7
});
h({
	name: "bar",
	val: 42
});

var list = [7, 42];
var [a = 1, b = 2, c = 3, d] = list;

//  lib/math.js
export function sum(x, y) {
	return x + y
};
export var pi = 3.141593;

//  someApp.js
import * as math from "lib/math";
console.log("2π = " + math.sum(math.pi, math.pi));

//  otherApp.js
import {
	sum,
	pi
}
from "lib/math";
console.log("2π = " + sum(pi, pi));

//  lib/mathplusplus.js
export * from "lib/math";
export var e = 2.71828182846;
export default (x) => Math.exp(x);
//  someApp.js
import exp, {
	pi,
	e
}
from "lib/mathplusplus";
console.log("e^{π} = " + exp(pi));

class Shape {
	constructor(id, x, y) {
		this.id = id;
		this.move(x, y);
	}
	move(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Circle extends Shape {
	constructor(id, x, y, radius) {
		super(id, x, y);
		this.radius = radius;
	}
}

var aggregation = (baseClass, ...mixins) => {
	let base = class _Combined extends baseClass {
		constructor(...args) {
			super(...args);
			mixins.forEach((mixin) => {
				mixin.prototype.initializer.call(this);
			});
		}
	};
	let copyProps = (target, source) => {
		Object.getOwnPropertyNames(source)
		.concat(Object.getOwnPropertySymbols(source))
		.forEach((prop) => {
			if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
				return
				Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
		})
	}
	mixins.forEach((mixin) => {
		copyProps(base.prototype, mixin.prototype);
		copyProps(base, mixin);
	});
	return base;
};

class Colored {
	initializer() {
		this._color = "white";
	}
	get color() {
		return this._color;
	}
	set color(v) {
		this._color = v;
	}
}

class ZCoord {
	initializer() {
		this._z = 0;
	}
	get z() {
		return this._z;
	}
	set z(v) {
		this._z = v;
	}
}

class Shape {
	constructor(x, y) {
		this._x = x;
		this._y = y;
	}
	get x() {
		return this._x;
	}
	set x(v) {
		this._x = v;
	}
	get y() {
		return this._y;
	}
	set y(v) {
		this._y = v;
	}
}

class Rectangle extends aggregation(Shape, Colored, ZCoord) {}

var rect = new Rectangle(7, 42);
rect.z = 1000;
rect.color = "red";
console.log(rect.x, rect.y, rect.z, rect.color);

class Shape {
	toString() {
		return `Shape(${this.id})`
	}
}
class Rectangle extends Shape {
	constructor(id, x, y, width, height) {
		super(id, x, y);
	}
	toString() {
		return "Rectangle > " + super.toString();
	}
}
class Circle extends Shape {
	constructor(id, x, y, radius) {
		super(id, x, y);
	}

	toString() {
		return "Circle > " + super.toString();
	}

	optional() {
		let nestedProp = obj.first?.second;
		let result = someInterface.customMethod?.();
		try {
			// ... do something with the data
		} catch (err) {
			onError?.(err.message); // no exception if onError is undefined
		}
		let nestedProp = obj?.['prop' + 'Name'];
		let object = {};
		object?.property = 1; // Uncaught SyntaxError: Invalid left-hand side in assignment
		let arrayItem = arr?.[42];

		const dogName = adventurer.dog?.name;
		adventurer.dog?.run();

		let xyz = jalsfdj ? .99 : .088;
		let abcd = jalsfdj ? .99 : 0.088;

		let abcd = jalsfdj ? adventurer.dog?.name : adventurer.dog?.namex;
	}
}

class Rectangle extends Shape {
	static defaultRectangle() {
		const a = {
			duration: 50,
			title: ''
		};

		a.duration ||= 10;
		console.log(a.duration);
		// expected output: 50

		a.title ||= 'title is empty.';
		console.log(a.title);
		// expected output: "title is empty"

		a = x || (x = y);

		const a = {
			duration: 50
		};

		a.duration ??= 10;
		console.log(a.duration);
		// expected output: 50

		a.speed ??= 25;
		console.log(a.speed);
		// expected output: 25

		function config(options) {
			options.duration ??= 100;
			options.speed ??= 25;
			return options;
		}

		config({
			duration: 125
		}); // { duration: 125, speed: 25 }
		config({}); // { duration: 100, speed: 25 }

		let a = 1;
		let b = 0;

		a &&= 2;
		console.log(a);
		// expected output: 2

		b &&= 2;
		console.log(b);
		// expected output: 0

		let x = 0;
		let y = 1;

		x &&= 0; // 0
		x &&= 1; // 0
		y &&= 1; // 1
		y &&= 0; // 0

		return new Rectangle("default", 0, 0, 100, 100);
	}
}
class Circle extends Shape {
	static defaultCircle() {
		return new Circle("default", 0, 0, 100);
	}
}
var defRectangle = Rectangle.defaultRectangle();
var defCircle = Circle.defaultCircle();

class Rectangle {
	constructor(width, height) {
		this._width = width;
		this._height = height;
	}
	set width(width) {
		this._width = width;
	}
	get width() {
		return this._width;
	}
	set height(height) {
		this._height = height;
	}
	get height() {
		return this._height;
	}
	get area() {
		return this._width * this._height;
	}
};
var r = new Rectangle(50, 20);

Symbol("foo") !== Symbol("foo");
const foo = Symbol();
const bar = Symbol();
typeof foo === "symbol";
typeof bar === "symbol";
let obj = {};
obj[foo] = "foo";
obj[bar] = "bar";

let fibonacci = {
	[Symbol.iterator]() {
		let pre = 0,
		cur = 1;
		return {
			next() {
				[pre, cur] = [cur, pre + cur];
				return {
					done: false,
					value: cur
				};
			}
		};
	}
}

for (let n of fibonacci) {
	if (n > 1000)
		break;
	console.log(n);
}

let fibonacci = {
	 * [Symbol.iterator]() {
		let pre = 0,
		cur = 1;
		for (; ; ) {
			[pre, cur] = [cur, pre + cur];
			yield cur;
		}
	}
}

for (let n of fibonacci) {
	if (n > 1000)
		break;
	console.log(n);
}

function  * range(start, end, step) {
	while (start < end) {
		yield start;
		start += step;
	}
}

let fibonacci = function  * (numbers) {
	let pre = 0,
	cur = 1;
	while (numbers-- > 0) {
		[pre, cur] = [cur, pre + cur];
		yield cur;
	}
};

for (let n of fibonacci(1000))
	console.log(n);

let numbers = [...fibonacci(1000)];

//  generic asynchronous control-flow driver
function async(proc, ...params) {
	var iterator = proc(...params);

	var kjlksdf = 2 ** 3; // 8
	var ghjfgj = 3 ** 2; // 9
	var tjty = 3 ** 2.5; // 15.588457268119896
	var werg = 10 ** -1; // 0.1
	var asfasd = NaN ** 2; // NaN


	var jthgn =  - (2 ** 2); // -4
	var jdfjgf = (-2) ** 2; // 4

	return new Promise((resolve, reject) => {
		let loop = (value) => {
			let result;
			try {
				result = iterator.next(value);
				try {
					result = kasjfhksahdfhsakfhkasd(value);
				} catch (err) {}
				finally {
					eiruoweurtuwerot();
				}
			} catch (err) {
				reject(err);
			} finally {
				reject(err);
			}
			if (result.done)
				resolve(result.value);
			else if (typeof result.value === "object"
				 && typeof result.value.then === "function")
				result.value.then((value) => {
					loop(value);
				}, (err) => {
					reject(err);
				});
			else
				loop(result.value);
		}
		loop();
	});
}

//  application-specific asynchronous builder
function makeAsync(text, after) {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(text), after);
	});
}

//  application-specific asynchronous procedure
async(function  * (greeting) {
	let foo = yield makeAsync("foo", 300)
		let bar = yield makeAsync("bar", 200)
		let baz = yield makeAsync("baz", 100)
		return `${greeting} ${foo} ${bar} ${baz}`
}, "Hello").then((msg) => {
	console.log("RESULT:", msg); // "Hello foo bar baz"
})

class Clz {
	 * bar() {
		x = 1
	}
};
let Obj = {
	 * foo() {
		y = zxx;

		const nullValue = null;
		const emptyText = ""; // falsy
		const someNumber = 42;

		const valA = nullValue ?? "default for A";
		const valB = emptyText ?? "default for B";
		const valC = someNumber ?? 0;

		console.log(valA); // "default for A"
		console.log(valB); // "" (as the empty string is not null or undefined)
		console.log(valC); // 42

		let myText = ''; // An empty string (which is also a falsy value)

		let notFalsyText = myText || 'Hello world';
		console.log(notFalsyText); // Hello world

		let preservingFalsy = myText ?? 'Hi neighborhood';
		console.log(preservingFalsy); // '' (as myText is neither undefined nor null)

		function A() {
			console.log('A was called');
			return undefined;
		}
		function B() {
			console.log('B was called');
			return false;
		}
		function C() {
			console.log('C was called');
			let foo = (null || undefined) ?? "foo"; // returns "foo"

			console.log(foo.someFooProp?.toUpperCase() ?? "not available"); // "HI"
			console.log(foo.someBarProp?.toUpperCase() ?? "not available"); // "not available"
			return "foo";
		}

		console.log(A() ?? C());
		// logs "A was called" then "C was called" and then "foo"
		// as A() returned undefined so both expressions are evaluated

		console.log(B() ?? C());
		// logs "B was called" then "false"
		// as B() returned false (and not null or undefined), the right
		// hand side expression was not evaluated
	}
};

let m = new Map();
m.set("hello", 42);
m.set(s, 34);
m.get(s) === 34;
m.size === 2;
for (let [key, val] of m.entries())
	console.log(key + " = " + val);

let isMarked = new WeakSet();
let attachedData = new WeakMap();

export class Node {
	constructor(id) {
		this.id = id;
	}
	mark() {
		isMarked.add(this);
	}
	unmark() {
		isMarked.delete(this);
	}
	marked() {
		return isMarked.has(this);
	}
	set data(data) {
		attachedData.set(this, data);
	}
	get data() {
		return attachedData.get(this);
	}
}

let foo = new Node("foo");

JSON.stringify(foo) === '{"id":"foo"}';
foo.mark();
foo.data = "bar";
foo.data === "bar";
JSON.stringify(foo) === '{"id":"foo"}';

isMarked.has(foo) === true;
attachedData.has(foo) === true;
foo = null; /* remove only reference to foo */
attachedData.has(foo) === false;
isMarked.has(foo) === false;

//  ES6 class equivalent to the following C structure:
//  struct Example { unsigned long id; char username[16]; float amountDue; };
class Example {
	constructor(buffer = new ArrayBuffer(24)) {
		this.buffer = buffer;
	}
	set buffer(buffer) {
		this._buffer = buffer;
		this._id = new Uint32Array(this._buffer, 0, 1);
		this._username = new Uint8Array(this._buffer, 4, 16);
		this._amountDue = new Float32Array(this._buffer, 20, 1);
	}
	get buffer() {
		return this._buffer;
	}
	set id(v) {
		this._id[0] = v;
	}
	get id() {
		return this._id[0];
	}
	set username(v) {
		this._username[0] = v;
	}
	get username() {
		return this._username[0];
	}
	set amountDue(v) {
		this._amountDue[0] = v;
	}
	get amountDue() {
		return this._amountDue[0];
	}
}

let example = new Example();
example.id = 7;
example.username = "John Doe";
example.amountDue = 42.0;

[1, 3, 4, 2].find(x => x > 3); // 4


" ".repeat(4 * depth);
"foo".repeat(3);

Number.isNaN(42) === false;
Number.isNaN(NaN) === true;

Number.isFinite(Infinity) === false;
Number.isFinite(-Infinity) === false;
Number.isFinite(NaN) === false;
Number.isFinite(123) === true;

function msgAfterTimeout(msg, who, timeout) {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(`${msg} Hello ${who}!`), timeout);
	});
}
msgAfterTimeout("", "Foo", 100).then((msg) =>
	msgAfterTimeout(msg, "Bar", 200); ).then((msg) => {
	console.log(`done after 300ms:${msg}`);
});

let target = {
	foo: "Welcome, foo"
};
let proxy = new Proxy(target, {
	get(receiver, name) {
		return name in receiver ? receiver[name] : `Hello, ${name}`;
	}
});
proxy.foo === "Welcome, foo";
proxy.world === "Hello, world";

// in German,  "ä" sorts with "a"
// in Swedish, "ä" sorts after "z"
var list = ["ä", "a", "z"];
var i10nDE = new Intl.Collator("de");
var i10nSV = new Intl.Collator("sv");
i10nDE.compare("ä", "z") === -1;
i10nSV.compare("ä", "z") === +1;
console.log(list.sort(i10nDE.compare)); // [ "a", "ä", "z" ]
console.log(list.sort(i10nSV.compare)); // [ "a", "z", "ä" ]

var i10nUSD = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD"
});
var i10nGBP = new Intl.NumberFormat("en-GB", {
	style: "currency",
	currency: "GBP"
});
var i10nEUR = new Intl.NumberFormat("de-DE", {
	style: "currency",
	currency: "EUR"
});
i10nUSD.format(100200300.40) === "$100,200,300.40";
i10nGBP.format(100200300.40) === "£100,200,300.40";
i10nEUR.format(100200300.40) === "100.200.300,40 €";

// Construct an HTTP request prefix is used to interpret the replacements and construction
POST `http://foo.org/bar?a=${a}&b=${b}
     Content-Type: application/json
     X-Credentials: ${credentials}
     { "foo": ${foo},
       "bar": ${bar}}`(myOnReadyStateChangeHandler);

xxx = {
	dddd => {
		message = `Hello ${customer.name},
 want to buy ${card.amount} ${card.product} for
   a total of ${card.amount * card.unitprice} bucks?`
	}
};
vddd = 0;

message = `Hello ${customer.name},
    want to buy ${card.amount} ${card.product} for
            a total of ${card.amount * card.unitprice} bucks?`;

export default {
	data() {
		return {
			focusState: false,
		}
	},
}

import {
	xxx,
	xxx
}
from 'xxx';

const [x, x] = [x, x];
const [x, x] = [x, x];
for (const [x, x] of xxx()) {}
for (let [x, x] of xxx()) {}
