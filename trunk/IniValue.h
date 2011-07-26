/*
 * IniValue class header file
 * Author: Sun Junwen
 * Version: 1.1
 */
#ifndef _INI_VALUE_H_
#define _INI_VALUE_H_

#include <cstdlib>
#include <string>
#include <map>

using namespace std;

class IniValue
{
public:
	typedef map<string, string> StrMap;

	/*
	 * Constructors
	 * Default is string value
	 */
	explicit IniValue(bool bStr = true)
		:bStr(bStr)
	{};
	explicit IniValue(const string& strValue)
		:bStr(true), strValue(strValue)
	{};

	// Get map value
	StrMap GetMapValue() const;
	// Set map value
	void SetMapValue(const StrMap& map);
	// Get string value
	string GetStrValue() const;
	// Set string value
	void SetStrValue(const string& str);
	
	// Is string value or not
	inline bool IsStrValue() const
	{ return bStr; }
	// Set value mode, true is string, false is not string
	inline void SetMode(bool bStr)
	{ this->bStr = bStr; }

	// Put key-value pair into map value
	void Put(const string& key, const string& value);

	// Convert string value or map value to string
	string ToString() const;

private:
	bool bStr;
	string strValue;
	IniValue::StrMap mapValue;

	string PreMultiLine(const string& value) const;

};

#endif
