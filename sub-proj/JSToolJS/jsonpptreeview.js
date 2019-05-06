const vscode = require('vscode');

const JsonPP = require("./jsonpp.js");

class JsonTreeNode {
    constructor(key, value, parent) {
        this.key = key;
        this.value = value;
        this.parent = parent;
        this.children = 0;
        this.treeitem = 0;
    }
}

class JsonTreeProvider {
    /*
     * A implementation of TreeDataProvider
     */
    constructor(rootJsonValue) {
        this.rootNode = new JsonTreeNode("ROOT", rootJsonValue, 0);
    }

    getTreeItem(element) {
        var collapState = vscode.TreeItemCollapsibleState.NONE;

        var itemLabel = element.key;
        var jsonValue = element.value;

        var valueType = jsonValue.GetValueType();
        var valueLabel = "";
        switch (valueType) {
        case JsonPP.JsonValue.MAP_VALUE:
            valueLabel = "[Object]";
            collapState = vscode.TreeItemCollapsibleState.Collapsed;
            break;
        case JsonPP.JsonValue.ARRAY_VALUE:
            valueLabel = "[Array]";
            collapState = vscode.TreeItemCollapsibleState.Collapsed;
            break;
        default:
            valueLabel = jsonValue.ToString();
            break;
        }

        var isRoot = false;
        if (element == this.rootNode) {
            isRoot = true;
        }

        if (isRoot) {
            collapState = vscode.TreeItemCollapsibleState.Expanded;
        } else {
            itemLabel = itemLabel + ": " + valueLabel;
        }
        return new vscode.TreeItem(itemLabel, collapState);
    }

    getChildren(element) {
        if (element) {
            var childrenElem = [];
            var jsonValue = element.value
            var valueType = jsonValue.GetValueType();
            switch (valueType) {
            case JsonPP.JsonValue.MAP_VALUE:
                var mapValue = jsonValue.GetValue();
                var keysItr = mapValue.keys();
                var keysArray = Array.from(keysItr);
                for (var i = 0; i < keysArray.length; ++i) {
                    var key = keysArray[i];
                    var value = mapValue.get(key);
                    childrenElem.push(new JsonTreeNode(key, value, element));
                }
                break;
            case JsonPP.JsonValue.ARRAY_VALUE:
                var arrayValue = jsonValue.GetValue();
                for (var i = 0; i < arrayValue.length; ++i) {
                    var value = arrayValue[i];
                    childrenElem.push(new JsonTreeNode(i, value, element));
                }
                break;
            }
            return childrenElem;
        } else {
            // Root
            return [this.rootNode];
        }
    }
}

exports.JsonTreeProvider = JsonTreeProvider
