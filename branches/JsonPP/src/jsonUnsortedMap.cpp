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

JsonValue& JsonUnsortedMap::operator[](const std::string& key)
{
	JsonMapPairVec::iterator itr = m_vec.begin();
	for(; itr != m_vec.end(); ++itr)
	{
		if(key == itr->first)
			return (*itr).second;
	}

	// 没有, 插入一个
	m_vec.push_back(JsonMapPair(key, JsonValue()));
	itr = m_vec.end();
	--itr;
	return (*itr).second;
}
