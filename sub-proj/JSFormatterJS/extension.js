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
    let editorSelection = editor.selection;

    let document = editor.document;
    let docEol = document.eol;
    let docLangId = document.languageId;

    var formatAllText = true;
    var inputJS;
    var currentLine;
    var newSelRange;
    var initIndent;
    if (editorSelection.isEmpty) {
        inputJS = editor.document.getText();
        currentLine = editorSelection.active.line;
    } else {
        formatAllText = false;

        // Re-select full line.
        let selStart = editorSelection.start;
        let selEnd = editorSelection.end;
        let selLine = document.lineAt(selEnd.line);
        let newSelStart = new vscode.Position(selStart.line, 0);
        let newSelEnd = selLine.range.end;
        newSelRange = new vscode.Range(newSelStart, newSelEnd);
        inputJS = editor.document.getText(newSelRange);
        currentLine = selStart.line;

        initIndent = "";
        let inputJSLen = inputJS.length;
        for (var i = 0; i < inputJSLen; ++i) {
            let ch = inputJS.charAt(i);
            if (ch != ' ' && ch != '\t') {
                break;
            }
            initIndent += ch;
        }
    }

    //log("inputJS:\n" + inputJS);

    // Make format options
    var formatOption = new RealJSFormatter.FormatterOption();
    formatOption.chIndent = editorIndentSpace ? ' ' : '\t';
    formatOption.nChPerInd = editorIndentSpace ? editorTabSize : 1;
    formatOption.eCRPut = (docEol == vscode.EndOfLine.CRLF) ? RealJSFormatter.CR_PUT.PUT_CR : RealJSFormatter.CR_PUT.NOT_PUT_CR;
    formatOption.eBracNL = RealJSFormatter.BRAC_NEWLINE.NO_NEWLINE_BRAC;
    formatOption.eEmpytIndent = RealJSFormatter.EMPTYLINE_INDENT.NO_INDENT_IN_EMPTYLINE;

    // Format
    var jsfStrIO = new JSFormatStringIO(inputJS, formatOption);
    if (!formatAllText) {
        jsfStrIO.SetInitIndent(initIndent);
    }
    //jsfStrIO.m_debug = true;
    jsfStrIO.Go();
    var resultJS = jsfStrIO.outputJS;
    let currentLineJSF = currentLine + 1;
    let formattedLineJSF = jsfStrIO.GetFormattedLine(currentLineJSF);

    //log(resultJS);

    // Change content
    editor.edit(function (editBuilder) {
        if (formatAllText) {
            let allRange = getJSAllRange(inputJS);
            editBuilder.delete(allRange);
            editBuilder.insert(new vscode.Position(0, 0), resultJS);
        } else {
            // Clean one more new line.
            if (resultJS.length >= 2 && resultJS.charAt(resultJS.length - 2) == '\r') {
                resultJS = resultJS.substring(0, resultJS.length - 2);
            } else {
                resultJS = resultJS.substring(0, resultJS.length - 1);
            }

            editBuilder.delete(newSelRange);
            editBuilder.insert(newSelRange.start, resultJS);
        }

        if (docLangId != "javascript" && docLangId != "json") {
            vscode.languages.setTextDocumentLanguage(document, "javascript");
        }
    });

    if (formatAllText) {
        // Move selection and viewport.
        let formattedLinePosition = new vscode.Position(formattedLineJSF - 1, 0);
        editor.selection = new vscode.Selection(formattedLinePosition, formattedLinePosition);
        editor.revealRange(new vscode.Range(formattedLinePosition, formattedLinePosition), vscode.TextEditorRevealType.InCenter);
    }
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
