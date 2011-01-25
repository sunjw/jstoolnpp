/*
 * IniFileProcessor class implementation file
 * Author: Sun Junwen
 * Version: 1.2
 */
#include <cstdlib>
#include <string>
#include <map>
#include <stack>
#include <iostream>
#include <fstream>

#include "IniFileProcessor.h"

using namespace std;

const string SPACES(" \t\r\n");

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

IniFileProcessor::IniMap IniFileProcessor::GetInfo(bool bProcSection, bool bRefresh)
{
	if(!bRefresh && iniMap.size() > 0)
		return iniMap;

	ifstream in(strFileName.c_str());
	
	if(in)
	{
		iniMap.clear();

		string line;
		bool bSection = false;
		string sectionName;
		//IniValue sectionMap;
		IniValue::StrMap sectionMap;

		while(true)
		{
			if(!getline(in, line)) // eof
			{
				if(bProcSection && bSection)
				{
					AddSection(sectionName, sectionMap);
				}
				break;
			}

			line = strtrim(line);
			if(line.length() <= 1 || 
				line[0] == ';' ||
				line[0] == '#')
				continue; // ×¢ÊÍÐÐ

			if(bProcSection && 
				line[0] == '[' &&
				line[line.length() - 1] == ']')
			{
				if(bSection)
				{
					AddSection(sectionName, sectionMap);
				}

				bSection = true;
				sectionMap.clear();
				sectionName = line.length() - 2 > 0 ?
					line.substr(1, line.length() - 2) : "";
				sectionName = strtrim(sectionName);
			}

			size_t eqPos = line.find("=");
			if(eqPos != string::npos)
			{
				string key = line.substr(0, eqPos);
				key = strtrim(key);
				
				string value = eqPos + 1 >= line.length() ?
					"" : line.substr(eqPos + 1);
				value = strtrim(value);

				if(bProcSection && bSection)
				{
					sectionMap[key] = value;
				}
				else
				{
					iniMap[key] = IniValue(value);
				}
			}
		}
	}

	return iniMap;
}

void IniFileProcessor::Save()
{
	ofstream out(strFileName.c_str());

	if(out)
	{
		out << ToString();
	}

	out.close();
}

string IniFileProcessor::ToString(IniFileProcessor::IniMap map) const
{
	typedef pair<const string, IniValue> MapEntry;
	string ret("");

	stack<MapEntry> sectionStack;

	IniMap::const_iterator iniItr = map.begin();
	string line;
	string key;
	IniValue value;
	for(; iniItr != map.end(); ++iniItr)
	{
		key = (*iniItr).first;
		value = (*iniItr).second;

		if(value.IsStrValue())
		{
			line = key;
			line.append("=");
			line.append(value.GetStrValue());
			line.append("\n");
			ret.append(line);
		}
		else
		{
			sectionStack.push(*iniItr);
		}
	}

	while(!sectionStack.empty())
	{
		key = sectionStack.top().first;
		value = sectionStack.top().second;

		line = "\n[";
		line.append(key);
		line.append("]\n");
		ret.append(line);

		line = value.ToString();
		ret.append(line);

		sectionStack.pop();
	}

	return ret;
}

void IniFileProcessor::AddSection(const string& sectionName, const IniValue::StrMap& sectionMap)
{
	IniValue iniValue = iniMap[sectionName];// = sectionMap;
	if(iniValue.IsStrValue())
	{
		iniValue.SetMode(false);
		iniValue.SetMapValue(sectionMap);
	}
	else
	{
		IniValue::StrMap::const_iterator itr = sectionMap.begin();
		for(; itr != sectionMap.end(); ++itr)
		{
			iniValue.Put((*itr).first, (*itr).second);
		}
	}
	iniMap[sectionName] = iniValue;
}
