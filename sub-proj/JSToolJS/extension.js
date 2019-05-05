// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const VSCUtils = require("./vscutils.js");
const JSMin = require("./jsmin.js");
const RealJSFormatter = require("./realjsformatter.js");
const JsonPP = require("./jsonpp.js");
const JsonTreeView = require("./jsonpptreeview.js");

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

class JsonPPStringIO extends JsonPP.JsonParser {

    constructor(inputJS) {
        super();
        this.inputJS = inputJS;
        this.inputIdx = 0;
    }

    GetChar() {
        if (this.inputIdx <= this.inputJS.length) {
            return this.inputJS.charAt(this.inputIdx++);
        } else {
            return '\0';
        }
    }
}

function guessJSON(jsCode) {
    var maybeJSON = false;
    var charJSON = 0;
    var jsCodeLen = jsCode.length;
    for (var i = 0; i < jsCodeLen; ++i) {
        var ch = jsCode.charAt(i);
        if (ch == ' ' || ch == '\t' ||
            ch == '\r' || ch == '\n') {
            continue; // Skip over whitespaces at beginning
        }
        if (ch == '{' || ch == '[') {
            maybeJSON = true;
            charJSON = ch;
        }
        break;
    }

    if (!maybeJSON) {
        return false;
    }

    for (var i = (jsCodeLen - 1); i >= 0; --i) {
        var ch = jsCode.charAt(i);
        if (ch == ' ' || ch == '\t' ||
            ch == '\r' || ch == '\n') {
            continue; // Skip over whitespaces at the end
        }
        if ((charJSON == '{' && ch == '}') ||
            (charJSON == '[' && ch == ']')) {
            return true;
        }
        break;
    }

    return false;
}

function makeFormatOptionFromTextEditor(textEditor) {
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

function makeFormatOptionFromFormattingOptions(formatOptions, textDocument) {
    let editorIndentSpace = formatOptions.insertSpaces;
    let editorTabSize = formatOptions.tabSize;

    let docEol = textDocument.eol;

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
    let docLangId = document.languageId;

    let inputJS = document.getText();
    let resultJS = JSMin.jsmin(inputJS).trim();

    if (!inNewDoc) {
        editor.edit(function (editBuilder) {
            let allRange = VSCUtils.getAllRangeFromTextEditor(editor);
            VSCUtils.replaceWithRange(editBuilder, allRange, resultJS);

            if (docLangId != "javascript" && docLangId != "json") {
                var newDocLangId = "javascript";
                if (guessJSON(resultJS)) {
                    newDocLangId = "json";
                }
                vscode.languages.setTextDocumentLanguage(document, newDocLangId);
            }
        });
    } else {
        var newDocLangId = "javascript";
        if (guessJSON(resultJS)) {
            newDocLangId = "json";
        }
        VSCUtils.newDocument(vscode.workspace, vscode.window, newDocLangId, resultJS);
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
    var formatOption = makeFormatOptionFromTextEditor(editor);

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
            let allRange = VSCUtils.getAllRangeFromTextEditor(editor);
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
            var newDocLangId = "javascript";
            if (guessJSON(resultJS)) {
                newDocLangId = "json";
            }
            vscode.languages.setTextDocumentLanguage(document, newDocLangId);
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

function formatJSAsRegisterFormatter(document, options) {
    var inputJS = document.getText();
    //VSCUtils.log("inputJS:\n" + inputJS);

    // Make format option
    var formatOption = makeFormatOptionFromFormattingOptions(options, document);

    // Format
    var jsfStrIO = new JSFormatStringIO(inputJS, formatOption);
    //jsfStrIO.m_debug = true;
    jsfStrIO.Go();
    var resultJS = jsfStrIO.outputJS;
    //VSCUtils.log(resultJS);

    let allRange = VSCUtils.getAllRangeFromTextDocument(document);

    var resultEdit = [];
    resultEdit.push(vscode.TextEdit.replace(allRange, resultJS));

    return resultEdit;
}

function JSONSort(inNewDoc) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor opened.');
        return; // No open text editor
    }

    let document = editor.document;
    let docLangId = document.languageId;

    let inputJSON = document.getText();
    var jsonppStrIO = new JsonPPStringIO(inputJSON);
    //jsonppStrIO.m_debug = true;
    var jsonValue = new JsonPP.JsonValue();
    jsonppStrIO.Go(jsonValue);
    let sortedJSON = jsonValue.ToStringSorted();

    // format
    var formatOption = makeFormatOptionFromTextEditor(editor);
    var jsfStrIO = new JSFormatStringIO(sortedJSON, formatOption);
    //jsfStrIO.m_debug = true;
    jsfStrIO.Go();
    sortedJSON = jsfStrIO.outputJS;

    if (!inNewDoc) {
        editor.edit(function (editBuilder) {
            let allRange = VSCUtils.getAllRangeFromTextEditor(editor);
            VSCUtils.replaceWithRange(editBuilder, allRange, sortedJSON);

            if (docLangId != "javascript" && docLangId != "json") {
                vscode.languages.setTextDocumentLanguage(document, "json");
            }
        });
    } else {
        VSCUtils.newDocument(vscode.workspace, vscode.window, "json", sortedJSON);
    }
}

function JSONTreeView() {
    vscode.window.registerTreeDataProvider("JSONTreeView", new JsonTreeView.JsonTreeView());
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

    let disposableJSONSort = vscode.commands.registerCommand('extension.JSONSort', function () {
        // The code you place here will be executed every time your command is executed
        JSONSort(false);
    });

    let disposableJSONSortNewFile = vscode.commands.registerCommand('extension.JSONSortNewFile', function () {
        // The code you place here will be executed every time your command is executed
        JSONSort(true);
    });

    let disposableJSONTreeView = vscode.commands.registerCommand('extension.JSONTreeView', function () {
        // The code you place here will be executed every time your command is executed
        JSONTreeView();
    });

    let disposableFormattingJS = vscode.languages.registerDocumentFormattingEditProvider('javascript', {
        provideDocumentFormattingEdits(document, options) {
            return formatJSAsRegisterFormatter(document, options);
        }
    });

    let disposableFormattingJSON = vscode.languages.registerDocumentFormattingEditProvider('json', {
        provideDocumentFormattingEdits(document, options) {
            return formatJSAsRegisterFormatter(document, options);
        }
    });

    context.subscriptions.push(disposableMinJS);
    context.subscriptions.push(disposableMinJSNewFile);
    context.subscriptions.push(disposableFormatJS);
    context.subscriptions.push(disposableJSONSort);
    context.subscriptions.push(disposableJSONSortNewFile);
    context.subscriptions.push(disposableJSONTreeView);

    context.subscriptions.push(disposableFormattingJS);
    context.subscriptions.push(disposableFormattingJSON);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
