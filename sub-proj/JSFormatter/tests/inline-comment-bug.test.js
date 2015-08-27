function test5() {
	if (sadfsadf /** dsfdsf */) /* dsfdsf */ {
		skjfdladkfs;
		skjfdladkfs; /* dsfdsf */
		this.traceToString = function (trace) /*@explore*/
		{}
	}

	try {
		sdfsadf;
	} catch (e) /*@explore*/
	{ /*@explore*/
		dump("FBL Fails " + e + "\n"); /*@explore*/
	} /*@explore*/
}
/*@explore*/
function test4() { /*esssxplore*/
	return 10000 /*test*/ + 100;
}

function test() {
	return /*test*/ 10000;
}

function test2() {
	return 100 + /*test*/ 10000;
}

function test3() {
	return /*test*/ 10000 + 100;
}
