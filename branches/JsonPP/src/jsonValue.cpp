/* JsonValue.cpp
   2012-3-11
   Version: 0.9

Copyright (c) 2012 SUN Junwen

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

string JsonValue::GetStrValue() const
{
	return strValue;
}

void JsonValue::SetStrValue(const string& str)
{
	strValue = str;
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
