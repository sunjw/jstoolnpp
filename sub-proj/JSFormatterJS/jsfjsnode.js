'use strict';

const FileSystem = require('fs');
const Path = require('path');

const JSParser = require('./jsparser.js');

function log(logString) {
    console.log(logString);
}

class JSTokenDump extends JSParser.JSParser {
    constructor(inputJS) {
        super();
        this.inputJS = inputJS;
        this.inputIdx = 0;
    }

    GetChar() {
        if (this.inputIdx <= this.inputJS.length) {
            log("this.inputIdx=" + this.inputIdx);
            return this.inputJS.charAt(this.inputIdx++);
        } else {
            return 0;
        }
    }

    Go() {
        while (this.GetToken()) {}
    }
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

        var jsTokenDump = new JSTokenDump(inputJS);
        jsTokenDump.Go();

        //var resultJS = CallLibJSFFormat(inputJS);
        var resultJS = inputJS;

        FileSystem.writeFileSync(outputJSFile, resultJS, 'binary');
    }

}

Main();
