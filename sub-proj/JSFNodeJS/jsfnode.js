var FileSystem = require('fs');
const Path = require('path');
var FileSystemEx = require('fs-extra');

var Ffi = 0;
var Ref = 0;
var StructType = 0;

var VoidPtr = 0;

var FormatterOptionStruct = 0;
var FormatterOptionStructPtr = 0;

var OSType = {
    WIN32: 0,
    LINUX: 1,
    MACOS: 2
};

var OSRunning = 0;

var JSFORMATTER_REL_PATH = '';
var JSFORMATTER_REL_PATH_WIN32 = Path.resolve(__dirname, '../../trunk/release/JSFormatter.dll');
var JSFORMATTER_REL_PATH_MACOS = Path.resolve(__dirname, '../../trunk/DerivedData/JSTool/Build/Products/Release/libJSFormatter.dylib');

function log(logString) {
    console.log(logString);
}

function detectOS() {
    var plat = process.platform;
    //log('process.platform=' + plat);
    if (plat.includes('win32')) {
        return OSType.WIN32;
    } else if (plat.includes('linux')) {
        return OSType.LINUX;
    } else if (plat.includes('darwin')) {
        return OSType.MACOS;
    }
}

function prepareEnv() {
    OSRunning = detectOS();

    var osPostfix = '';
    switch (OSRunning) {
    case OSType.WIN32:
        osPostfix = '.win32';
        break;
    case OSType.LINUX:
        break;
    case OSType.MACOS:
        osPostfix = '.macos';
        break;
    }

    var ffiNativePath = Path.resolve(__dirname, 'node_modules/ffi/build/Release/ffi_bindings.node');
    var ffiNativePathPlatPath = ffiNativePath + osPostfix;
    var refNativePath = Path.resolve(__dirname, 'node_modules/ref/build/Release/binding.node');
    var refNativePathPlatPath = refNativePath + osPostfix;

    FileSystemEx.copySync(ffiNativePathPlatPath, ffiNativePath);
    FileSystemEx.copySync(refNativePathPlatPath, refNativePath);

    Ffi = require('ffi');
    Ref = require('ref');
    StructType = require('ref-struct');

    VoidPtr = Ref.refType('void');

    FormatterOptionStruct = StructType({
            'chIndent': 'char',
            'nChPerInd': 'int',
            'eCRRead': 'int',
            'eCRPut': 'int',
            'eBracNL': 'int',
            'eEmpytIndent': 'int'
        });

    FormatterOptionStructPtr = Ref.refType(FormatterOptionStruct);
}

function LoadLibJSF() {
    if (JSFORMATTER_REL_PATH == '') {
        // Not determined path
        switch (OSRunning) {
        case OSType.WIN32:
            JSFORMATTER_REL_PATH = JSFORMATTER_REL_PATH_WIN32;
            break;
        case OSType.LINUX:
            break;
        case OSType.MACOS:
            JSFORMATTER_REL_PATH = JSFORMATTER_REL_PATH_MACOS;
            break;
        }
    }

    var libJSFormatter = new Ffi.Library(JSFORMATTER_REL_PATH, {
            'JSFCreateStringIO': [VoidPtr, [VoidPtr, 'string', 'pointer', FormatterOptionStructPtr]],
            'JSFRelease': ['void', [VoidPtr]],
            'JSFEnableDebug': ['void', [VoidPtr]],
            'JSFFormatJavaScript': ['void', [VoidPtr]],
            'JSFGetVersion': ['string', []]
        });

    return libJSFormatter;
}

function CallLibJSFFormat(inputJS) {
    var libJSFormatter = LoadLibJSF();

    var formatterOption = new FormatterOptionStruct;
    formatterOption.chIndent = '\t';
    formatterOption.nChPerInd = 1;
    formatterOption.eCRRead = 0;
    formatterOption.eCRPut = 1;
    formatterOption.eBracNL = 0;
    formatterOption.eEmpytIndent = 0;

    var resultJS = '';
    var WriteStringFunc = Ffi.Callback('void', [VoidPtr, 'string'],
            function (context, outputString) {
            resultJS = outputString.toString();
        });

    var ioContext = Ref.alloc(VoidPtr);
    var jsfObj = libJSFormatter.JSFCreateStringIO(ioContext, inputJS, WriteStringFunc, formatterOption.ref());

    libJSFormatter.JSFEnableDebug(jsfObj);

    libJSFormatter.JSFFormatJavaScript(jsfObj);

    libJSFormatter.JSFRelease(jsfObj);

    //log('');
    //log(resultJs);

    //log('libJSFormatter version: ' + libJSFormatter.JSFGetVersion() + '\n');

    process.on('exit', function () {
        var keepWSF = WriteStringFunc;
    });

    return resultJS;
}

function CallLibJSFVersion() {
    var libJSFormatter = LoadLibJSF();
    return libJSFormatter.JSFGetVersion();
}

function Main() {
    prepareEnv();

    if ((process.argv.length == 3 && process.argv[2] == '--version') ||
        (process.argv.length == 4 && process.argv[3] == '--version')) {
        if (process.argv.length == 4) {
            JSFORMATTER_REL_PATH = process.argv[2];
        }
        log('libJSFormatter version: ' + CallLibJSFVersion());
    } else if (process.argv.length != 4 && process.argv.length != 5) {
        log('Usage: node jsfnode.js {libJSFormatter path} [input file] [output file]');
    } else {
        var inputJSFile = '';
        var outputJSFile = '';

        if (process.argv.length == 4) {
            inputJSFile = process.argv[2];
            outputJSFile = process.argv[3];
        } else if (process.argv.length == 5) {
            JSFORMATTER_REL_PATH = process.argv[2];
            inputJSFile = process.argv[3];
            outputJSFile = process.argv[4];
        }

        var inputJS = FileSystem.readFileSync(inputJSFile, 'binary');
        inputJS = inputJS.toString();
        //log('inputJS:\n' + inputJS);

        var resultJS = CallLibJSFFormat(inputJS);

        FileSystem.writeFileSync(outputJSFile, resultJS, 'binary');
    }
}

Main();
