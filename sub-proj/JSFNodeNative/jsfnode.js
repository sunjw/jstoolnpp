const FileSystem = require('fs');
const Path = require('path');
const FileSystemEx = require('fs-extra');

const OSType = {
    WIN32: 0,
    LINUX: 1,
    MACOS: 2
};

const JSFORMATTER_REL_PATH_WIN32 = Path.resolve(__dirname, '../../trunk/release/JSFormatter.dll');
const JSFORMATTER_REL_PATH_MACOS = Path.resolve(__dirname, '../../trunk/DerivedData/JSTool/Build/Products/Release/libJSFormatter.dylib');

var Ffi = 0;
var Ref = 0;
var StructType = 0;

var VoidPtr = 0;

var FormatterOptionStruct = 0;
var FormatterOptionStructPtr = 0;

var OSRunning = 0;

var JSFORMATTER_REL_PATH = '';

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

    // Load default path
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

    var printVersion = false;
    var inputJSFile = '';
    var outputJSFile = '';

    var argvLen = process.argv.length;
    if (argvLen >= 2) {
        if (process.argv[argvLen - 1] == '--version') {
            printVersion = true;
            if (argvLen == 4) {
                JSFORMATTER_REL_PATH = process.argv[2];
            }
        } else if (argvLen >= 4) {
            inputJSFile = process.argv[argvLen - 2];
            outputJSFile = process.argv[argvLen - 1];
            if (argvLen == 5) {
                JSFORMATTER_REL_PATH = process.argv[2];
            }
        }
    }

    if (!printVersion && (inputJSFile == '' || outputJSFile == '')) {
        log('Usage: node jsfnode.js {libJSFormatter path} [input file] [output file]');
        log('');
        log('  {libJSFormatter path}: optional specify libJSFormatter path.');
        log('  --version: print version.');
        return;
    }

    if (printVersion) {
        log('libJSFormatter version: ' + CallLibJSFVersion());
    } else {
        var inputJS = FileSystem.readFileSync(inputJSFile, 'binary');
        inputJS = inputJS.toString();
        //log('inputJS:\n' + inputJS);

        var resultJS = CallLibJSFFormat(inputJS);

        FileSystem.writeFileSync(outputJSFile, resultJS, 'binary');
    }

}

Main();
