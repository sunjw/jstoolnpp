const FileSystem = require('fs');
const Path = require('path');

function log(logString) {
    console.log(logString);
}

function Main() {
    //prepareEnv();

    var printVersion = false;
    var inputJSFile = '';
    var outputJSFile = '';

    var argvLen = process.argv.length;
    if (argvLen == 3 && process.argv[2] == '--version') {
        printVersion = true;
    } else if (argvLen == 4) {
        inputJSFile = process.argv[argvLen - 2];
        outputJSFile = process.argv[argvLen - 1];
    }

    if (!printVersion && (inputJSFile == '' || outputJSFile == '')) {
        log('Usage: node jsfjsnode.js [input file] [output file]');
        log('');
        log('  --version: print version.');
        return;
    }

    if (printVersion) {
        log('JSFormatterJS version: ?');
    } else {
        var inputJS = FileSystem.readFileSync(inputJSFile, 'binary');
        inputJS = inputJS.toString();
        //log('inputJS:\n' + inputJS);

        //var resultJS = CallLibJSFFormat(inputJS);
        resultJS = inputJS;

        FileSystem.writeFileSync(outputJSFile, resultJS, 'binary');
    }

}

Main();
