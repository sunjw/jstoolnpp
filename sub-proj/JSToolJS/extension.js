// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const VSCUtils = require("./vscutils.js");
const JSMin = require("./jsmin.js");
const RealJSFormatter = require("./realjsformatter.js");

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

function makeFormatOption(textEditor) {
    let editorIndentSpace = textEditor.options.insertSpaces;
    let editorTabSize = textEditor.options.tabSize;

    let document = textEditor.document;
    let docEol = document.eol;

    var formatOption = new RealJSFormatter.FormatterOption();
    formatOption.chIndent = editorIndentSpace ? ' ' : '\t';
    formatOption.nChPerInd = editorIndentSpace ? editorTabSize : 1;
    formatOption.eCRPut = (docEol == vscode.EndOfLine.CRLF) ? RealJSFormatter.CR_PUT.PUT_CR : RealJSFormatter.CR_PUT.NOT_PUT_CR;
    formatOption.eBracNL = RealJSFormatter.BRAC_NEWLINE.NO_NEWLINE_BRAC;
    formatOption.eEmpytIndent = RealJSFormatter.EMPTYLINE_INDENT.NO_INDENT_IN_EMPTYLINE;

    return formatOption;
}

function minJS(inNewDoc) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor opened.');
        return; // No open text editor
    }

    let document = editor.document;

    let inputJS = document.getText();
    let resultJS = JSMin.jsmin(inputJS).trim();

    if (!inNewDoc) {
        editor.edit(function (editBuilder) {
            let allRange = VSCUtils.getAllRange(editor);
            VSCUtils.replaceWithRange(editBuilder, allRange, resultJS);
        });
    } else {
        VSCUtils.newDocument(vscode.workspace, vscode.window, "javascript", resultJS);
    }
}

function formatJS() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor opened.');
        return; // No open text editor
    }

    let editorSelection = editor.selection;
    let document = editor.document;
    let docLangId = document.languageId;

    var formatAllText = true;
    var inputJS;
    var currentLine;
    var newSelRange;
    var initIndent;
    if (editorSelection.isEmpty) {
        inputJS = document.getText();
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
        inputJS = document.getText(newSelRange);
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

    //VSCUtils.log("inputJS:\n" + inputJS);

    // Make format option
    var formatOption = makeFormatOption(editor);

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
    if (formattedLineJSF < 1) {
        formattedLineJSF = 1;
    }

    //VSCUtils.log(resultJS);

    // Change content
    editor.edit(function (editBuilder) {
        if (formatAllText) {
            let allRange = VSCUtils.getAllRange(editor);
            VSCUtils.replaceWithRange(editBuilder, allRange, resultJS);
        } else {
            // Clean one more new line.
            if (resultJS.length >= 2 && resultJS.charAt(resultJS.length - 2) == '\r') {
                resultJS = resultJS.substring(0, resultJS.length - 2);
            } else {
                resultJS = resultJS.substring(0, resultJS.length - 1);
            }

            VSCUtils.replaceWithRange(editBuilder, newSelRange, resultJS);
        }

        if (formatAllText && docLangId != "javascript" && docLangId != "json") {
            vscode.languages.setTextDocumentLanguage(document, "javascript");
        }
    }).then(function (applied) {
        if (!applied) {
            return;
        }

        if (formatAllText) {
            // Move selection and viewport.
            VSCUtils.moveToLine(editor, formattedLineJSF - 1);
        }
    });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    VSCUtils.log('Congratulations, your extension "jstool ' + RealJSFormatter.VERSION + '" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposableMinJS = vscode.commands.registerCommand('extension.minJS', function () {
        // The code you place here will be executed every time your command is executed
        minJS(false);
    });

    let disposableMinJSNewFile = vscode.commands.registerCommand('extension.minJSNewFile', function () {
        // The code you place here will be executed every time your command is executed
        minJS(true);
    });

    let disposableFormatJS = vscode.commands.registerCommand('extension.formatJS', function () {
        // The code you place here will be executed every time your command is executed
        formatJS();
    });

    context.subscriptions.push(disposableMinJS);
    context.subscriptions.push(disposableMinJSNewFile);
    context.subscriptions.push(disposableFormatJS);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
