// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const JSParser = require("./jsparser.js");
const RealJSFormatter = require("./realjsformatter.js");

const LineSeperator = /\r\n|\n|\r/;

function log(logString) {
    console.log(logString);
}

class JSFormatStringIO extends RealJSFormatter.RealJSFormatter {

    constructor(inputJS, formatOption) {
        super(formatOption);
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

function getJSAllRange(inputJS) {
    var start = new vscode.Position(0, 0);
    var lines = inputJS.split(LineSeperator);
    var end = new vscode.Position(lines.length - 1, lines[lines.length - 1].length);
    var allRange = new vscode.Range(start, end);
    return allRange;
}

function formatJS() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor opened.');
        return; // No open text editor
    }

    let editorTabSize = editor.options.tabSize;
    let editorIndentSpace = editor.options.insertSpaces;

    let document = editor.document;
    let docEol = document.eol;

    let inputJS = editor.document.getText();

    //log("inputJS:\n" + inputJS);

    var formatOption = new RealJSFormatter.FormatterOption();
    formatOption.chIndent = editorIndentSpace ? ' ' : '\t';
    formatOption.nChPerInd = editorIndentSpace ? editorTabSize : 1;
    formatOption.eCRPut = (docEol == vscode.EndOfLine.CRLF) ? RealJSFormatter.CR_PUT.PUT_CR : RealJSFormatter.CR_PUT.NOT_PUT_CR;
    formatOption.eBracNL = RealJSFormatter.BRAC_NEWLINE.NO_NEWLINE_BRAC;
    formatOption.eEmpytIndent = RealJSFormatter.EMPTYLINE_INDENT.NO_INDENT_IN_EMPTYLINE;

    var jsfStrIO = new JSFormatStringIO(inputJS, formatOption);
    //jsfStrIO.m_debug = true;
    jsfStrIO.Go();
    let resultJS = jsfStrIO.outputJS;

    //log(resultJS);

    editor.edit(function (editBuilder) {
        let allRange = getJSAllRange(inputJS);
        editBuilder.delete(allRange);
        editBuilder.insert(new vscode.Position(0, 0), resultJS);
    });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    log('Congratulations, your extension "jstool ' + RealJSFormatter.VERSION + '" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.formatJS', function () {
        // The code you place here will be executed every time your command is executed
        formatJS();
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
