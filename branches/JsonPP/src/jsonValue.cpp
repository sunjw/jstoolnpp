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

	switch(eType)
	{
	case JsonValue::STRING_VALUE:
		{
			ret.append("\"");
			ret.append(strValue);
			ret.append("\"");
			ret.append("\n");
		}
		break;
	case JsonValue::MAP_VALUE:
		{
			ret.append("{");
			ret.append("\n");
			
			JsonMap::const_iterator itr = mapValue.begin();
			for(; itr != mapValue.end(); ++itr)
			{
				const string& key = itr->first;
				const JsonValue& value = itr->second;

				ret.append("\"");
				ret.append(key);
				ret.append("\"");
				ret.append(":");
				ret.append(value.ToString());
				JsonMap::const_iterator temp = itr;
				++temp;
				if(temp != mapValue.end())
				{
					ret.append(",\n");
				}
			}

			ret.append("}");
		}
		break;
	case JsonValue::ARRAY_VALUE:
		{
			ret.append("[");
			
			JsonVec::const_iterator itr = arrayValue.begin();
			for(; itr != arrayValue.end(); ++itr)
			{
				const JsonValue& value = *itr;

				ret.append(value.ToString());
				JsonVec::const_iterator temp = itr;
				++temp;
				if(temp != arrayValue.end())
				{
					ret.append(",");
				}
			}

			ret.append("]");
		}
		break;
	}

	return ret;
}
