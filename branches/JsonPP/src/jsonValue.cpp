/*
 * JsonValue class header file
 * Author: Sun Junwen
 */
#include <cstdlib>
#include <string>
#include <map>

#include "strhelper.h"
#include "jsonValue.h"

using namespace std;
using namespace sunjwbase;

JsonValue::JsonMap JsonValue::GetMapValue() const
{
	return mapValue;
}

void JsonValue::SetMapValue(const JsonValue::JsonMap& map)
{
	mapValue = map;
}

string JsonValue::GetStrValue() const
{
	return strValue;
}

void JsonValue::SetStrValue(const string& str)
{
	strValue = str;
}

void JsonValue::Put(const string& key, const string& value)
{
	mapValue[key] = JsonValue(value);
}

string JsonValue::ToString() const
{
	string ret("");

	return ret;
}
