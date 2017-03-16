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

var inputJS = '';
var idx = 0;

var ReadCharFunc = Ffi.Callback('char', [VoidPtr],
    function(context) {
        if (idx == inputJS.length) {
            return 0;
        }
        return inputJS.charAt(idx++);
    }
);

var resultJs = '';

var WriteCharFunc = Ffi.Callback('void', [VoidPtr, 'char'],
    function(context, ch) {
        //console.log('WriteCharFunc(' + ch + ')');
        var chStr = String.fromCharCode(ch);
        resultJs = resultJs + chStr;
    }
);

function CallLibJSF() {
    var libJSFormatter = new Ffi.Library(JSFORMATTER_REL_PATH_MAC, {
        'JSFCreateGenericIO': [VoidPtr, [VoidPtr, 'pointer', 'pointer', FormatterOptionStructPtr]],
        'JSFRelease': ['void', [VoidPtr]],
        'JSFEnableDebug': ['void', [VoidPtr]],
        'JSFFormatJavaScript': ['void', [VoidPtr]],
        'JSFGetVersion': ['string', []]
    });

    var formatterOption = new FormatterOptionStruct;
    formatterOption.chIndent = '\t';
    formatterOption.nChPerInd = 1;
    formatterOption.eCRRead = 0;
    formatterOption.eCRPut = 1;
    formatterOption.eBracNL = 0;
    formatterOption.eEmpytIndent = 0;

    var ioContext = Ref.alloc(VoidPtr);
    var jsfObj = libJSFormatter.JSFCreateGenericIO(ioContext, ReadCharFunc, WriteCharFunc, formatterOption.ref());

    libJSFormatter.JSFEnableDebug(jsfObj);

    libJSFormatter.JSFFormatJavaScript(jsfObj);

    libJSFormatter.JSFRelease(jsfObj);

    console.log('');
    console.log(resultJs);

    console.log('libJSFormatter version: ' + libJSFormatter.JSFGetVersion() + '\n');
}

if (process.argv.length != 4) {
    console.log('Usage: node jsfnode.js [input file] [output file]');
} else {
    var inputJSFile = process.argv[2];
    var outputJSFile = process.argv[3];

    inputJS = FS.readFileSync(inputJSFile);
    inputJS = inputJS.toString();
    //console.log('inputJS:\n' + inputJS);

    CallLibJSF();

    FS.writeFileSync(outputJSFile, resultJs);

    process.on('exit', function() {
        var keepRCF = ReadCharFunc;
        var keepWCF = WriteCharFunc;
    });
}
