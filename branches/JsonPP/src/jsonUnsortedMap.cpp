/* JsonUnsortedMap.cpp
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

JsonUnsortedMap::iterator JsonUnsortedMap::find(const std::string& key)
{
	JsonMapPairList::iterator itr = m_list.begin();
	for(; itr != m_list.end(); ++itr)
	{
		if(key == itr->first)
			return itr;
	}

	return m_list.end();
}

JsonValue& JsonUnsortedMap::operator[](const std::string& key)
{
	JsonMapPairList::iterator itr = find(key);
	if(itr == m_list.end())
	{
		// 没有, 插入一个
		m_list.push_back(JsonMapPair(key, JsonValue()));
		itr = m_list.end();
		--itr;
	}
	return (*itr).second;
}
