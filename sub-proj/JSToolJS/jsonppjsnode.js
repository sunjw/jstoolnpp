"use strict";

const FileSystem = require("fs");
const Path = require("path");

const JsonPP = require("./jsonpp.js");

function log(logString) {
    console.log(logString);
}

class JsonPPStringIO extends JsonPP.JsonParser {

    constructor(inputJS) {
        super();
        this.inputJS = inputJS;
        this.inputIdx = 0;
        this.outputJS = "";
    }

    GetChar() {
        if (this.inputIdx <= this.inputJS.length) {
            return this.inputJS.charAt(this.inputIdx++);
        } else {
            return '\0';
        }
    }

    PutChar(ch) {
        this.outputJS += ch;
    }
}

function Main() {
    //prepareEnv();

    var printVersion = false;
    var inputJSFile = "";
    var outputJSFile = "";

    var argvLen = process.argv.length;
    if (argvLen == 3 && process.argv[2] == "--version") {
        printVersion = true;
    } else if (argvLen == 4) {
        inputJSFile = process.argv[argvLen - 2];
        outputJSFile = process.argv[argvLen - 1];
    }

    if (!printVersion && (inputJSFile == "" || outputJSFile == "")) {
        log("Usage: node jsonppjsnode.js [input file] [output file]");
        log("");
        log("  --version: print version.");
        return;
    }

    if (printVersion) {
        log("JSFormatterJS version: " + JsonPP.VERSION);
    } else {
        var inputJS = FileSystem.readFileSync(inputJSFile, "binary");
        inputJS = inputJS.toString();
        //log("inputJS:\n" + inputJS);

        var jsonppStrIO = new JsonPPStringIO(inputJS);
        jsonppStrIO.m_debug = true;
        var jsonValue = new JsonPP.JsonValue();
        jsonppStrIO.Go(jsonValue);
        var resultJS = jsonppStrIO.outputJS;

        FileSystem.writeFileSync(outputJSFile, resultJS, "binary");
        log("Done");
    }

    /*
    var jsonValue = new JsonPP.JsonValue();

    var jsonMap = new Map();

    jsonMap.set("sfdasfsaf", new JsonPP.JsonValue("4654154"));

    var jsonMap2 = new Map();
    jsonMap2.set("mcyeurn", new JsonPP.JsonValue(true, JsonPP.JsonValue.BOOL_VALUE));
    jsonMap2.set("eetrffv", new JsonPP.JsonValue(5000, JsonPP.JsonValue.NUMBER_VALUE));
    jsonMap2.set("jrtythgb", new JsonPP.JsonValue("ncg646769jhg"));
    jsonMap.set("agyedjfj", new JsonPP.JsonValue(jsonMap2, JsonPP.JsonValue.MAP_VALUE));

    var jsonValue1 = new JsonPP.JsonValue();
    var jsonArray = [];
    jsonArray.push(new JsonPP.JsonValue("njhbfgmnb"));
    jsonArray.push(new JsonPP.JsonValue(false, JsonPP.JsonValue.BOOL_VALUE));
    jsonArray.push(new JsonPP.JsonValue(jsonMap2, JsonPP.JsonValue.MAP_VALUE));
    jsonArray.push(new JsonPP.JsonValue(2, JsonPP.JsonValue.NUMBER_VALUE));
    jsonValue1.SetArrayValue(jsonArray);
    jsonMap.set("pyiyhmhnj", jsonValue1);

    jsonValue.SetMapValue(jsonMap);

    log(jsonValue.ToString());
    log(jsonValue.ToStringSorted());

    log(JsonPP.VERSION);
    */
}

Main();
