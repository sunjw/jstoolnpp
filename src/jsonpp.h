/* jsonpp.h
   2012-3-11
   Version: 0.9.6

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
#ifndef _JSONPP_H_
#define _JSONPP_H_

#include <cstdlib>
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <list>
#include <map>

#include "strhelper.h"

class JsonValue;
class JsonUnsortedMap;

typedef std::map<std::string, std::string> StrMap;
typedef std::map<std::string, JsonValue> JsonMap;
typedef std::pair<std::string, JsonValue> JsonMapPair;
typedef std::vector<JsonValue> JsonVec;

/**
 * 对 std::list<JsonMapPair> 的简化版封装
 * 不具有完整的 std::list 和 std::map 特性
 */
class JsonUnsortedMap
{
public:
	typedef std::list<JsonMapPair> JsonMapPairList;
	typedef JsonMapPairList::iterator iterator;
	typedef JsonMapPairList::const_iterator const_iterator;
	typedef JsonMapPairList::size_type size_type;

	// 操作接口都是对 std::list 的封装
	inline size_type size()
	{ return m_list.size(); }

	inline void push_front(const JsonMapPair& pair)
	{ m_list.push_front(pair); }
	inline void push_back(const JsonMapPair& pair)
	{ m_list.push_back(pair); }

	inline iterator insert(iterator itr, const JsonMapPair& pair)
	{ return m_list.insert(itr, pair); }
	inline iterator erase(iterator itr)
	{ return m_list.erase(itr); }

	inline void clear()
	{ m_list.clear(); }

	inline const_iterator begin() const
	{ return m_list.begin(); }
	inline iterator begin()
	{ return m_list.begin(); }

	inline const_iterator end() const
	{ return m_list.end(); }
	inline iterator end()
	{ return m_list.end(); }

	iterator find(const std::string& key);
	// 只能提供 O(n) 的性能
	JsonValue& operator[](const std::string& key);

private:
	JsonMapPairList m_list;
};


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

	/*
	 * Constructors
	 * Default is string value
	 */
	explicit JsonValue(VALUE_TYPE type = STRING_VALUE)
		:valType(type)
	{};
	explicit JsonValue(const std::string& strValue)
		:valType(STRING_VALUE), strValue(strValue)
	{};

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
	{ return valType; }
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
	VALUE_TYPE valType;
	std::string strValue;
	JsonUnsortedMap mapValue;
	JsonVec arrayValue;

	void ChangeType(VALUE_TYPE newType);
};

#endif
