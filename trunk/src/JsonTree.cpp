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
#include "JsonTree.h"

using namespace std;
using namespace sunjwbase;

JsonTree::JsonTree(HWND hScintilla, HWND hWndWindow, HWND hWndTree):
	m_hScintilla(hScintilla), TreeViewController(hWndWindow, hWndTree)
{}

/*
 * Get TVITEM of specified HTREEITEM on TreeView.
 */
BOOL JsonTree::getTVItem(HTREEITEM hti, TCHAR *buf, int bufSize, TVITEM *tvi)
{
	tvi->mask = TVIF_HANDLE | TVIF_TEXT | TVIF_PARAM;
	tvi->cchTextMax = bufSize;
	tvi->pszText = buf;
	tvi->hItem = hti;
	tvi->lParam = -1;
					
	return TreeView_GetItem(getHWndTree(), tvi);
}

/*
 * Jump to the line linked with specified HTREEITEM.
 */
void JsonTree::jumpToSciLine(HTREEITEM hti)
{
	TCHAR buf[1024] = {0};
	TVITEM tvi = {0};
	if(getTVItem(hti, buf, 1024, &tvi))
	{
		long line = (long)tvi.lParam;
		if(line >= 0)
		{
			::SendMessage(m_hScintilla, SCI_GOTOLINE, line - 1, 0);
		}
	}
}

HTREEITEM JsonTree::search(string& strSearchKey, HTREEITEM htiCurrent)
{
	return doSearch(strSearchKey, htiCurrent, true);
}

HTREEITEM JsonTree::doSearch(string& strSearchKey, HTREEITEM htiCurrent, bool bSkipCurrent)
{
	if(bSkipCurrent)
		htiCurrent = nextItem(htiCurrent);

	TCHAR buf[1024] = {0};
	TVITEM tvi = {0};
	while(htiCurrent != NULL)
	{
		if(getTVItem(htiCurrent, buf, 1024, &tvi))
		{
			string strTreeText = tstrtostr(tvi.pszText);
			string strKey, strValue;
			splitText(strTreeText, strKey, strValue);

			if(strValue == "[Object]" || strValue == "[Array]")
			{
				// Just search key
				if(ci_strfind(strKey, strSearchKey) >= 0)
				{
					return htiCurrent; // found
				}
			}
			else
			{
				if(ci_strfind(strTreeText, strSearchKey) >= 0)
				{
					return htiCurrent; // found
				}
			}
		}

		htiCurrent = nextItem(htiCurrent);
	}

	return NULL;
}

void JsonTree::splitText(string& strText, 
				string& strKey, 
				string& strValue)
{
	string::size_type beginPos = 0;
	string::size_type splitPos = 0;
	while(1)
	{
		string::size_type pos = strText.find(string(" : "), beginPos);
		if(pos == string::npos)
			return; // NOT found

		char cTest = strText[pos + 3];
		if(cTest == '\"' || cTest == '[')
		{
			splitPos = pos + 1;
			break;
		}

		beginPos = pos + 1;
	}

	strKey = strText.substr(0, splitPos);
	strKey = strtrim(strKey);
	strValue = strText.substr(splitPos + 1, strText.size() - splitPos);
	strValue = strtrim(strValue);
}
