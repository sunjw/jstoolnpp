class ClassWithPrivateField {
	#privateField;

	constructor() {
		this.#privateField = 42;
	}
}

class Subclass extends ClassWithPrivateField {
	#subPrivateField;

	constructor() {
		super();
		this.#subPrivateField = 23;
	}
}

new Subclass(); // In some dev tools, it shows Subclass {#privateField: 42, #subPrivateField: 23}


class ClassWithPrivateField {
	#privateField;

	constructor() {
		delete this.#privateField; // Syntax error
		this.#undeclaredField = 42; // Syntax error
	}
}

const instance = new ClassWithPrivateField();
instance.#privateField; // Syntax error

class C {
	#x;
	constructor(x) {
		this.#x = x;
	}
	static getX(obj) {
		if (#x in obj)
			return obj.#x;

		return "obj must be an instance of C";
	}
}
console.log(C.getX(new C("foo"))); // "foo"
console.log(C.getX(new C(0.196))); // 0.196
console.log(C.getX(new C(new Date()))); // the current date and time
console.log(C.getX({})); // "obj must be an instance of C"

class Stamper extends class {
	// A base class whose constructor returns the object it's given
	constructor(obj) {
		return obj;
	}
} {
	// This declaration will "stamp" the private field onto the object
	// returned by the base class constructor
	#stamp = 42;
	static getStamp(obj) {
		return obj.#stamp;
	}
}

const obj = {};
new Stamper(obj);
// `Stamper` calls `Base`, which returns `obj`, so `obj` is
// now the `this` value. `Stamper` then defines `#stamp` on `obj`

console.log(obj); // In some dev tools, it shows {#stamp: 42}
console.log(Stamper.getStamp(obj)); // 42
console.log(obj instanceof Stamper); // false

// You cannot stamp private properties twice
new Stamper(obj); // Error: Initializing an object twice is an error with private fields

class ClassWithPrivateAccessor {
	#message;

	get #decoratedMessage() {
		return `🎬${this.#message}🛑`;
	}
	set #decoratedMessage(msg) {
		this.#message = msg;
	}

	constructor() {
		this.#decoratedMessage = "hello world";
		console.log(this.#decoratedMessage);
	}
}

new ClassWithPrivateAccessor(); // 🎬hello world🛑

class ClassWithPrivateStaticMethod {
	static #isInternalConstructing = false;
	static #privateStaticMethod() {
		return 42;
	}

	static publicStaticMethod() {
		return this.#privateStaticMethod();
	}
}

class Subclass extends ClassWithPrivateStaticMethod {}

console.log(Subclass.publicStaticMethod()); // TypeError: Cannot read private member #privateStaticMethod from an object whose class did not declare it
