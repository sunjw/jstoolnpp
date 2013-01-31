/* JsonValue.cpp
   2012-3-11
   Version: 0.9.1

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
#include "jsonpp.h"

using namespace std;
using namespace sunjwbase;

JsonValue::JsonValue(const JsonValue& rhs)
{
	valType = rhs.valType;
	strValue = rhs.strValue;
	arrayValue = rhs.arrayValue;
	mapValue = rhs.mapValue;
	line = rhs.line;
}

JsonValue& JsonValue::operator=(const JsonValue& rhs)
{
	if(this == &rhs)
		return *this;

	valType = rhs.valType;
	strValue = rhs.strValue;
	arrayValue = rhs.arrayValue;
	mapValue = rhs.mapValue;
	line = rhs.line;

	return *this;
}

string JsonValue::GetStrValue() const
{
	return strValue;
}

void JsonValue::SetStrValue(const string& str)
{
	strValue = str;
	if(valType != JsonValue::STRING_VALUE && 
		valType != JsonValue::NUMBER_VALUE && 
		valType != JsonValue::BOOL_VALUE && 
		valType != JsonValue::REGULAR_VALUE && 
		valType != JsonValue::UNKNOWN_VALUE)
	ChangeType(JsonValue::STRING_VALUE);
}

JsonVec& JsonValue::GetArrayValue()
{
	return arrayValue;
}

const JsonVec& JsonValue::GetArrayValue() const 
{
	return arrayValue;
}

void JsonValue::SetArrayValue(const JsonVec& jArray)
{
	arrayValue = jArray;
	ChangeType(JsonValue::ARRAY_VALUE);
}

JsonUnsortedMap& JsonValue::GetMapValue()
{
	return mapValue;
}

const JsonUnsortedMap& JsonValue::GetMapValue() const
{
	return mapValue;
}

void JsonValue::SetMapValue(const JsonUnsortedMap& jMap)
{
	mapValue = jMap;
	ChangeType(JsonValue::MAP_VALUE);
}

void JsonValue::ArrayPut(const JsonValue& value)
{
	arrayValue.push_back(value);
}

void JsonValue::MapPut(const string& key, const JsonValue& value)
{
	mapValue[key] = value;
}

string JsonValue::ToString(int nRecuLevel) const
{
	string ret("");

	switch(valType)
	{
	case JsonValue::STRING_VALUE:
		{
			ret.append("\"");
			ret.append(strValue);
			ret.append("\"");
		}
		break;
	case JsonValue::NUMBER_VALUE:
	case JsonValue::BOOL_VALUE:
	case JsonValue::REGULAR_VALUE:
	case JsonValue::UNKNOWN_VALUE:
		ret.append(strValue);
		break;
	case JsonValue::MAP_VALUE:
		{
			++nRecuLevel;
			
			ret.append("{");
			ret.append("\n");
			
			JsonUnsortedMap::const_iterator itr = mapValue.begin();
			for(; itr != mapValue.end(); ++itr)
			{
				const string& key = itr->first;
				const JsonValue& value = itr->second;

				for(int r = 0; r < nRecuLevel; ++ r)
					ret.append("\t");
				ret.append("\"");
				ret.append(key);
				ret.append("\"");
				ret.append(" : ");
				ret.append(value.ToString(nRecuLevel));
				JsonUnsortedMap::const_iterator temp = itr;
				++temp;
				if(temp != mapValue.end())
				{
					ret.append(",");
				}
				ret.append("\n");
			}

			for(int r = 0; r < nRecuLevel - 1; ++ r)
				ret.append("\t");
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

				ret.append(value.ToString(nRecuLevel));
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

// for ArrayValue
JsonValue& JsonValue::operator[](JsonVec::size_type idx)
{
	// Change to ARRAY_VALUE
	ChangeType(JsonValue::ARRAY_VALUE);

	while(arrayValue.size() <= idx)
	{
		// need to expand
		arrayValue.push_back(JsonValue());
	}

	return arrayValue[idx];
}

// for MapValue
JsonValue& JsonValue::operator[](const std::string& key)
{
	// Change to MAP_VALUE
	ChangeType(JsonValue::MAP_VALUE);

	return mapValue[key];
}

void JsonValue::ChangeType(VALUE_TYPE newType)
{
	switch(newType)
	{
	case JsonValue::STRING_VALUE:
	case JsonValue::NUMBER_VALUE:
	case JsonValue::BOOL_VALUE:
	case JsonValue::REGULAR_VALUE:
	case JsonValue::UNKNOWN_VALUE:
		arrayValue.clear();
		mapValue.clear();
		break;
	case JsonValue::MAP_VALUE:
		strValue.clear();
		arrayValue.clear();
		break;
	case JsonValue::ARRAY_VALUE:
		strValue.clear();
		mapValue.clear();
		break;
	}

	valType = newType;
}
