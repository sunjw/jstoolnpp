const vscode = require('vscode');

const JsonPP = require("./jsonpp.js");

class JsonTreeNode {
    constructor(nodeKey, nodeValue, nodeParent) {
        this.nodeKey = nodeKey;
        this.nodeValue = nodeValue;
        this.nodeParent = nodeParent;
    }

    getKey() {
        return this.nodeKey;
    }

    getValue() {
        return this.nodeValue;
    }

    getParent() {
        return this.nodeParent;
    }
}

class JsonTreeView {
    /*
     * A implementation of TreeDataProvider
     */
    constructor(rootJsonValue) {
        this.rootNode = new JsonTreeNode("ROOT", rootJsonValue, 0);
    }

    getTreeItem(element) {
        var collapState = vscode.TreeItemCollapsibleState.NONE;

        var itemLabel = element.getKey() + ": ";
        var jsonValue = element.getValue();

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

        if (element == this.rootNode) {
            collapState = vscode.TreeItemCollapsibleState.Expanded;
        }

        itemLabel = itemLabel + valueLabel;
        return new vscode.TreeItem(itemLabel, collapState);
    }

    getChildren(element) {
        if (element) {
            var childrenElem = [];
            var jsonValue = element.getValue();
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

exports.JsonTreeView = JsonTreeView
