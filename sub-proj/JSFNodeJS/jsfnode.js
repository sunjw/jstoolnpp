var FS = require('fs');
var Ffi = require('ffi');
var Ref = require('ref');
var StructType = require('ref-struct');

var JSFORMATTER_REL_PATH_MAC = '../../trunk/DerivedData/JSTool/Build/Products/Release/libJSFormatter.dylib';

var VoidPtr = Ref.refType('void');

var FormatterOptionStruct = StructType({
    'chIndent': 'char',
    'nChPerInd': 'int',
    'eCRRead': 'int',
    'eCRPut': 'int',
	'eBracNL': 'int',
	'eEmpytIndent': 'int'
});
var FormatterOptionStructPtr = Ref.refType(FormatterOptionStruct);

var inputJS = "";
var idx = 0;

var ReadCharFunc = Ffi.Callback('char', [VoidPtr],
    function(context) {
        if (idx == inputJS.length) {
            return 0;
        }
        return inputJS.charAt(idx++);
    }
);

var resultJs = "";

var WriteCharFunc = Ffi.Callback('void', [VoidPtr, 'char'],
    function(context, ch) {
        console.log("WriteCharFunc(" + ch + ")");
        var chStr = String.fromCharCode(ch);
        resultJs = resultJs + chStr;
    }
);

function CallLibJSF() {
    var libJSFormatter = new Ffi.Library(JSFORMATTER_REL_PATH_MAC, {
        'CreateJSFormatter': [VoidPtr, [VoidPtr, 'pointer', 'pointer', FormatterOptionStructPtr]],
        'ReleaseJSFormatter': ['void', [VoidPtr]],
        'EnableJSFormatterDebug': ['void', [VoidPtr]],
        'FormatJavaScript': ['void', [VoidPtr]],
        'GetVersion': ['string', []]
    });

    var formatterOption = new FormatterOptionStruct;
    formatterOption.chIndent = '\t';
    formatterOption.nChPerInd = 1;
    formatterOption.eCRRead = 0;
    formatterOption.eCRPut = 0;
    formatterOption.eBracNL = 0;
    formatterOption.eEmpytIndent = 0;

    var ioContext = Ref.alloc(VoidPtr);
    var jsfObj = libJSFormatter.CreateJSFormatter(ioContext, ReadCharFunc, WriteCharFunc, formatterOption.ref());

    libJSFormatter.EnableJSFormatterDebug(jsfObj);

    libJSFormatter.FormatJavaScript(jsfObj);

    libJSFormatter.ReleaseJSFormatter(jsfObj);

    console.log(resultJs);

    console.log("libJSFormatter version: " + libJSFormatter.GetVersion());
}

if (process.argv.length != 3) {
    console.log("Usage: node jsfnode.js [input file]");
} else {
    var inputJSFile = process.argv[2];
    inputJS = FS.readFileSync(inputJSFile);
    inputJS = inputJS.toString();
    //console.log("inputJS:\n" + inputJS);

    CallLibJSF();

    process.on('exit', function() {
        var keepRCF = ReadCharFunc;
        var keepWCF = WriteCharFunc;
    });
}
