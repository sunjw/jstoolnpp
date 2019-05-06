const vscode = require('vscode');
const VSCUtils = require("./vscutils.js");
const JsonPP = require("./jsonpp.js");

const CTX_ROOT_NODE = "rootNode";
const CTX_COLLAP_NODE = "collapNode";
const CTX_LEAF_NODE = "leafNode";

function convertJsonValueToString(value) {
    if (typeof value !== 'string' && !(value instanceof String)) {
        return value.toString();
    }
    return value;
}

class JsonTreeNode {
    constructor(key, value, parent) {
        this.key = key;
        this.value = value;
        this.parent = parent;
        this.children = 0;
        this.treeItem = 0;
        this.valueLabel = "";
    }
}

class JsonTreeProvider {
    /*
     * A implementation of TreeDataProvider
     */
    constructor(rootJsonValue) {
        this.rootNode = new JsonTreeNode("ROOT", rootJsonValue, 0);
    }

    isRootNode(element) {
        if (!element) {
            return false;
        }
        return (element.parent == 0);
    }

    getTreeItem(element) {
        var treeItem = element.treeItem;
        if (treeItem != 0) {
            return treeItem;
        }

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

        var isRoot = this.isRootNode(element);
        if (isRoot) {
            collapState = vscode.TreeItemCollapsibleState.Expanded;
        } else {
            itemLabel = itemLabel + ": " + valueLabel;
        }

        element.valueLabel = valueLabel;

        treeItem = new vscode.TreeItem(itemLabel, collapState);
        treeItem.command = {
            command: "extension.JSONTreeViewClickItem",
            title: "Select JSON Tree View Item",
            arguments: [element]
        };
        if (collapState == vscode.TreeItemCollapsibleState.NONE) {
            treeItem.contextValue = CTX_LEAF_NODE;
        } else if (isRoot) {
            treeItem.contextValue = CTX_ROOT_NODE;
        } else {
            treeItem.contextValue = CTX_COLLAP_NODE;
        }

        element.treeItem = treeItem;
        return element.treeItem;
    }

    getParent(element) {
        if (!element) {
            return undefined;
        }
        return element.parent;
    }

    getChildren(element) {
        if (element) {
            var children = element.children;
            if (children != 0) {
                return children;
            }

            children = [];
            var jsonValue = element.value;
            var valueType = jsonValue.GetValueType();
            switch (valueType) {
            case JsonPP.JsonValue.MAP_VALUE:
                var mapValue = jsonValue.GetValue();
                var keysItr = mapValue.keys();
                var keysArray = Array.from(keysItr);
                for (var i = 0; i < keysArray.length; ++i) {
                    var key = keysArray[i];
                    var value = mapValue.get(key);
                    children.push(new JsonTreeNode(key, value, element));
                }
                break;
            case JsonPP.JsonValue.ARRAY_VALUE:
                var arrayValue = jsonValue.GetValue();
                for (var i = 0; i < arrayValue.length; ++i) {
                    var value = arrayValue[i];
                    children.push(new JsonTreeNode(i, value, element));
                }
                break;
            }

            element.children = children;
            return children;
        } else {
            // Root
            return [this.rootNode];
        }
    }

    clickElem(textEditor, element) {
        if (!textEditor || !element) {
            return;
        }
        var line = element.value.line - 1;
        if (line >= 0) {
            VSCUtils.moveToLine(textEditor, line);
        }
    }

    copyElem(element) {
        if (!element) {
            return;
        }
        var treeItem = element.treeItem;
        VSCUtils.copyToClipboard(treeItem.label);
    }

    copyElemName(element) {
        if (!element) {
            return;
        }
        var keyString = convertJsonValueToString(element.key);
        VSCUtils.copyToClipboard(keyString);
    }

    copyElemValue(element, raw) {
        if (!element) {
            return;
        }
        var valueLabel = element.valueLabel;
        if (raw) {
            VSCUtils.copyToClipboard(valueLabel);
            return;
        }
        if (valueLabel == "undefined") {
            VSCUtils.copyToClipboard(valueLabel);
            return;
        }
        var valueToEscape = "{\"value\":" + valueLabel + "}";
        var valueJson = JSON.parse(valueToEscape);
        var valueEscaped = valueJson.value;
        if (typeof valueEscaped !== 'string' && !(valueEscaped instanceof String)) {
            valueEscaped = JSON.stringify(valueEscaped);
        }
        VSCUtils.copyToClipboard(valueEscaped);
    }
}

exports.JsonTreeProvider = JsonTreeProvider
