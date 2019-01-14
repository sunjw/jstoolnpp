/* jsonpp.js
2019-1-14

Copyright (c) 2012- SUN Junwen

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

'use strict';

const JSParser = require('./jsparser.js');

const VERSION = JSParser.VERSION;

function JsonMapToString(jsonMap, nRecuLevel, sort) {
    var ret = "";

    ++nRecuLevel;

    ret += "{";
    ret += "\n";

    var keysItr = jsonMap.keys();
    var keysArray = Array.from(keysItr);
    if (sort) {
        keysArray.sort();
    }
    for (var i = 0; i < keysArray.length; ++i) {
        var key = keysArray[i];
        var value = jsonMap.get(key);

        for (var r = 0; r < nRecuLevel; ++r) {
            ret += "\t";
        }
        ret += "\"";
        ret += key;
        ret += "\"";
        ret += ": ";
        if (!sort) {
            ret += value.ToString(nRecuLevel);
        } else {
            ret += value.ToStringSorted(nRecuLevel);
        }
        if (i != (keysArray.length - 1)) {
            ret += ",";
        }
        ret += "\n";
    }

    for (var r = 0; r < nRecuLevel - 1; ++r) {
        ret += "\t";
    }
    ret += "}";

    return ret;
}

class JsonValue {
    /*
     * Constructors
     * Default is string value
     */
    constructor(value = "", type = JsonValue.STRING_VALUE) {
        this.line = -1;
        this.m_valType = type;
        this.m_value = value;
    }

    // Get value
    GetValue() {
        return this.m_value;
    }

    // Set string value
    SetStrValue(str) {
        if (this.m_valType != JsonValue.STRING_VALUE &&
            this.m_valType != JsonValue.NUMBER_VALUE &&
            this.m_valType != JsonValue.BOOL_VALUE &&
            this.m_valType != JsonValue.REGULAR_VALUE &&
            this.m_valType != JsonValue.UNKNOWN_VALUE) {
            this.ChangeType(JsonValue.STRING_VALUE);
        }
        this.m_value = str;
    }

    // Set array value
    SetArrayValue(jArray) {
        this.ChangeType(JsonValue.ARRAY_VALUE);
        this.m_value = jArray;
    }

    // Set map value
    SetMapValue(jMap) {
        this.ChangeType(JsonValue.MAP_VALUE);
        this.m_value = jMap;
    }

    // Type of value this stored
    GetValueType() {
        return this.m_valType;
    }

    // Set value mode
    SetValueType(valType) {
        this.ChangeType(valType);
    }

    ChangeType(newType) {
        switch (newType) {
        case JsonValue.STRING_VALUE:
        case JsonValue.NUMBER_VALUE:
        case JsonValue.BOOL_VALUE:
        case JsonValue.REGULAR_VALUE:
        case JsonValue.UNKNOWN_VALUE:
            this.m_value = "";
            break;
        case JsonValue.MAP_VALUE:
            this.m_value = new Map();
            break;
        case JsonValue.ARRAY_VALUE:
            this.m_value = [];
            break;
        }

        this.m_valType = newType;
    }

    // Put key-value pair into array value
    ArrayPut(value) {
        this.m_value.push(value);
    }

    // Put key-value pair into map value
    MapPut(key, value) {
        this.m_value.set(key, value);
    }

    // Has specified string key for map value, or has specified index for array value
    HasKey(key) {
        if (this.m_valType == JsonValue.MAP_VALUE) {
            return this.m_value.has(key);
        }
        if (this.m_valType == JsonValue.ARRAY_VALUE) {
            return (this.m_value.length > key);
        }
        return false;
    }

    ToString(nRecuLevel = 0, sort = false) {
        var ret = "";

        switch (this.m_valType) {
        case JsonValue.STRING_VALUE:
            ret += "\"";
            ret += this.m_value;
            ret += "\"";
            break;
        case JsonValue.NUMBER_VALUE:
        case JsonValue.BOOL_VALUE:
        case JsonValue.REGULAR_VALUE:
        case JsonValue.UNKNOWN_VALUE:
            ret += this.m_value;
            break;
        case JsonValue.MAP_VALUE:
            var mapString = JsonMapToString(this.m_value, nRecuLevel, sort);
            ret += mapString;
            break;
        case JsonValue.ARRAY_VALUE:
            ret += "[";

            for (var i = 0; i < this.m_value.length; ++i) {
                var value = this.m_value[i];

                ret += value.ToString(nRecuLevel, sort);
                if (i != (this.m_value.length - 1)) {
                    ret += ", ";
                }
            }

            ret += "]";
            break;
        }

        return ret;
    }

    ToStringSorted(nRecuLevel = 0) {
        return this.ToString(nRecuLevel, true);
    }
}

JsonValue.STRING_VALUE = 0x00;
JsonValue.NUMBER_VALUE = 0x01;
JsonValue.BOOL_VALUE = 0x02;
JsonValue.REGULAR_VALUE = 0x03;
JsonValue.UNKNOWN_VALUE = 0x04;
JsonValue.ARRAY_VALUE = 0x10;
JsonValue.MAP_VALUE = 0x20;

// exports
exports.VERSION = VERSION;

exports.JsonValue = JsonValue;
