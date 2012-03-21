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

string JsonValue::GetStrValue() const
{
	return strValue;
}

void JsonValue::SetStrValue(const string& str)
{
	strValue = str;
}

JsonVec JsonValue::GetArrayValue() const
{
	return arrayValue;
}

void JsonValue::SetArrayValue(const JsonVec& jArray)
{
	arrayValue = jArray;
}

JsonMap JsonValue::GetMapValue() const
{
	return mapValue;
}

void JsonValue::SetMapValue(const JsonMap& jMap)
{
	mapValue = jMap;
}

void JsonValue::ArrayPut(const JsonValue& value)
{
	arrayValue.push_back(value);
}

void JsonValue::MapPut(const string& key, const JsonValue& value)
{
	mapValue[key] = value;
}

string JsonValue::ToString() const
{
	string ret("");

	return ret;
}
