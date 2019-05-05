const vscode = require('vscode');

const JsonPP = require("./jsonpp.js");

class JsonTreeView {
    /*
     * A implementation of TreeDataProvider
     */
    constructor() {}

    getChildren(element) {
        return [];
    }

    getTreeItem(element) {
        return new vscode.TreeItem("Hello World!", vscode.TreeItemCollapsibleState.None);
    }
}

exports.JsonTreeView = JsonTreeView
