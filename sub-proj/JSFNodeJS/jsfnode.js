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
var resultJs = '';

var WriteStringFunc = Ffi.Callback('void', [VoidPtr, 'string'],
    function(context, outputString) {
        resultJs = outputString.toString();
    }
);

function CallLibJSF() {
    var libJSFormatter = new Ffi.Library(JSFORMATTER_REL_PATH_MAC, {
        'JSFCreateStringIO': [VoidPtr, [VoidPtr, 'string', 'pointer', FormatterOptionStructPtr]],
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
    var jsfObj = libJSFormatter.JSFCreateStringIO(ioContext, inputJS, WriteStringFunc, formatterOption.ref());

    libJSFormatter.JSFEnableDebug(jsfObj);

    libJSFormatter.JSFFormatJavaScript(jsfObj);

    libJSFormatter.JSFRelease(jsfObj);

    //console.log('');
    //console.log(resultJs);

    //console.log('libJSFormatter version: ' + libJSFormatter.JSFGetVersion() + '\n');
}

function Main() {
    if (process.argv.length != 4 && process.argv.length != 5) {
        console.log('Usage: node jsfnode.js {libJSFormatter path} [input file] [output file]');
    } else {
        var inputJSFile = '';
        var outputJSFile = '';

        if (process.argv.length == 4) {
            inputJSFile = process.argv[2];
            outputJSFile = process.argv[3];
        } else if (process.argv.length == 5) {
            JSFORMATTER_REL_PATH_MAC = process.argv[2];
            inputJSFile = process.argv[3];
            outputJSFile = process.argv[4];
        }

        inputJS = FS.readFileSync(inputJSFile, 'binary');
        inputJS = inputJS.toString();
        //console.log('inputJS:\n' + inputJS);

        CallLibJSF();

        FS.writeFileSync(outputJSFile, resultJs, 'binary');

        process.on('exit', function() {
            var keepWSF = WriteStringFunc;
        });
    }
}

Main();
