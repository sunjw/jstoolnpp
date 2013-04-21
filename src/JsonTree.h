/*
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

#ifndef _JSON_TREE_H_
#define _JSON_TREE_H_

#include <string>

#include <shlwapi.h>

#include "strhelper.h"
#include "PluginInterface.h"
#include "TreeViewController.h"

class JsonTree: public TreeViewController
{
public:
	JsonTree(HWND hScintilla, HWND hWndWindow, HWND hWndTree);

	BOOL getTVItem(HTREEITEM hti, TCHAR *buf, int bufSize, TVITEM *tvi);
	void jumpToSciLine(HTREEITEM hti);
	HTREEITEM search(std::string& strSearchKey, HTREEITEM htiCurrent);

private:
	HWND m_hScintilla;
	
	HTREEITEM doSearch(std::string& strSearchKey, HTREEITEM htiCurrent, bool bSkipCurrent);
	void splitText(std::string& strText, std::string& strKey, std::string& strValue);
};

#endif
