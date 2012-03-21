/*
 * JsonValue class header file
 * Author: Sun Junwen
 */
#ifndef _JSON_VALUE_H_
#define _JSON_VALUE_H_

#include <cstdlib>
#include <string>
#include <vector>
#include <map>

using namespace std;

class JsonValue;
typedef map<string, JsonValue> JsonMap;
typedef vector<JsonValue> JsonVec;

class JsonValue
{
public:
	typedef map<string, string> StrMap;

	enum VALUE_TYPE
	{
		STRING_VALUE = 0x00,
		NUMBER_VALUE = 0x01,
		BOOL_VALUE = 0x02,
		REGULAR_VALUE = 0x03,
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
	explicit JsonValue(const string& strValue)
		:valType(STRING_VALUE), strValue(strValue)
	{};

	// Get string value
	string GetStrValue() const;
	// Set string value
	void SetStrValue(const string& str);
	// Get array value
	JsonVec GetArrayValue() const;
	// Set array value
	void SetArrayValue(const JsonVec& jArray);
	// Get map value
	JsonMap GetMapValue() const;
	// Set map value
	void SetMapValue(const JsonMap& jMap);
	
	// Is string value or not
	inline VALUE_TYPE GetValueType() const
	{ return valType; }
	// Set value mode, true is string, false is not string
	inline void SetValueType(VALUE_TYPE valType)
	{ this->valType = valType; }

	// Put key-value pair into array value
	void ArrayPut(const JsonValue& value);
	// Put key-value pair into map value
	void MapPut(const string& key, const JsonValue& value);

	// Convert string value or map value to string
	string ToString() const;

private:
	VALUE_TYPE valType;
	string strValue;
	JsonMap mapValue;
	JsonVec arrayValue;
};

#endif
