/* jsonpp.h
   2012-3-11
   Version: 0.9.8

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
#ifndef _JSONPP_H_
#define _JSONPP_H_

#include <cstdlib>
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <list>
#include <map>

#include "unsortedmap.h"
#include "strhelper.h"

class JsonValue;

typedef std::map<std::string, std::string> StrMap;
typedef std::map<std::string, JsonValue> JsonMap;
typedef std::pair<std::string, JsonValue> JsonMapPair;
typedef UnsortedMap<std::string, JsonValue> JsonUnsortedMap;
typedef std::vector<JsonValue> JsonVec;

class JsonValue
{
public:
	enum VALUE_TYPE
	{
		STRING_VALUE = 0x00,
		NUMBER_VALUE = 0x01,
		BOOL_VALUE = 0x02,
		REGULAR_VALUE = 0x03,
		UNKNOWN_VALUE = 0x04,
		ARRAY_VALUE = 0x10,
		MAP_VALUE = 0x20
	};

	long line; // line number

	/*
	 * Constructors
	 * Default is string value
	 */
	explicit JsonValue(VALUE_TYPE type = STRING_VALUE)
		:m_valType(type), line(-1)
	{};
	explicit JsonValue(const std::string& strValue)
		:m_valType(STRING_VALUE), m_strValue(strValue), line(-1)
	{};

	JsonValue(const JsonValue& rhs);
	JsonValue& operator=(const JsonValue& rhs);

	// Get string value
	std::string GetStrValue() const;
	// Set string value
	void SetStrValue(const std::string& str);
	// Get array value
	JsonVec& GetArrayValue();
	const JsonVec& GetArrayValue() const;
	// Set array value
	void SetArrayValue(const JsonVec& jArray);
	// Get map value
	JsonUnsortedMap& GetMapValue();
	const JsonUnsortedMap& GetMapValue() const;
	// Set map value
	void SetMapValue(const JsonUnsortedMap& jMap);
	
	// Is string value or not
	inline VALUE_TYPE GetValueType() const
	{ return m_valType; }
	// Set value mode, true is string, false is not string
	inline void SetValueType(VALUE_TYPE valType)
	{ ChangeType(valType); }

	// Put key-value pair into array value
	void ArrayPut(const JsonValue& value);
	// Put key-value pair into map value
	void MapPut(const std::string& key, const JsonValue& value);

	// Convert string value or map value to string
	std::string ToString(int nRecuLevel = 0) const;

	// for ArrayValue
	JsonValue& operator[](JsonVec::size_type idx);
	// for MapValue
	JsonValue& operator[](const std::string& key);

private:
	VALUE_TYPE m_valType;
	std::string m_strValue;
	JsonUnsortedMap m_mapValue;
	JsonVec m_arrayValue;

	void ChangeType(VALUE_TYPE newType);
};

#endif
