/*
 * IniProcessor class implementation file
 * Author: Sun Junwen
 * Version: 1.2.5
 */
#include <cstdlib>
#include <string>
#include <istream>
#include <map>
#include <stack>

#include "IniProcessor.h"

using namespace std;

IniProcessor::IniMap IniProcessor::GetInfo(istream& in, bool bProcSection, bool bRefresh)
{
	if(!bRefresh && m_iniMap.size() > 0)
		return m_iniMap;
	
	m_iniMap.clear();

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
				m_iniMap[key] = IniValue(value);
			}
		}
	}

	return m_iniMap;
}

string IniProcessor::ToString(IniProcessor::IniMap map) const
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

void IniProcessor::AddSection(const string& sectionName, const IniValue::StrMap& sectionMap)
{
	IniValue iniValue = m_iniMap[sectionName];// = sectionMap;
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
	m_iniMap[sectionName] = iniValue;
}
