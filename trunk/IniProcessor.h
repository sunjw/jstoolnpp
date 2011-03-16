/*
 * IniProcessor class header file
 * Author: Sun Junwen
 * Version: 1.2.5
 */
#ifndef _INI_PROCESSOR_H_
#define _INI_PROCESSOR_H_

#include <cstdlib>
#include <string>
#include <istream>
#include <map>

#include "IniValue.h"

using namespace std;

const string SPACES(" \t\r\n");

class IniProcessor
{
public:
	#if defined(UNICODE) || defined(_UNICODE)
	typedef wstring tstring;
	#else
	typedef string tstring;
	#endif
	typedef map<string, IniValue> IniMap;

	/*
	 * Constructor
	 * Specific the ini file name
	 */
	IniProcessor()
	{}

	// Set value into map
	void SetMap(const IniMap& map)
	{ m_iniMap = map; }

	// Save value into file
	virtual void Save() = 0;

	// Convert value to string
	inline string ToString() const
	{ return ToString(m_iniMap); }
	string ToString(IniMap map) const;

protected:
	// Get info from file
	IniMap GetInfo(istream& in, bool bProcSection, bool bRefresh);

private:
	IniMap m_iniMap;

	inline string strtrim_right(const string& s, const string& spaces = SPACES)
	{ 
		string d(s); 
		string::size_type i(d.find_last_not_of(spaces));
		if(i == string::npos)
			return "";
		else
			return d.erase(d.find_last_not_of(spaces) + 1); 
	}  // end of trim_right

	inline string strtrim_left(const string& s, const string& spaces = SPACES) 
	{ 
		string d(s); 
		return d.erase(0, s.find_first_not_of(spaces)); 
	}  // end of trim_left

	inline string strtrim(const string& s, const string& spaces = SPACES)
	{ 
		string d(s); 
		return strtrim_left(strtrim_right(d, spaces), spaces); 
	}  // end 

	// Add a section to map
	void AddSection(const string& sectionName, const IniValue::StrMap& sectionMap);
};

#endif
