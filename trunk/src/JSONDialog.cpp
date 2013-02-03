/*
This file is part of JSONViewer Plugin for Notepad++
Copyright (C)2011 Kapil Ratnani <kapil.ratnani@iiitb.net>

This file is also part of JSMinNpp Plugin for Notepad++ now :)
Copyright (C)2012 SUN Junwen <sunjw8888@gmail.com>

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
#include "JSONDialog.h"

#include "jsonpp.h"
#include "jsonStringProc.h"

using namespace std;
using namespace sunjwbase;

extern NppData nppData;


BOOL CALLBACK JSONDialog::run_dlgProc(UINT message, WPARAM wParam, LPARAM lParam)
{
	HWND hWnd = getHSelf();
	switch (message) 
	{
	case WM_INITDIALOG:
		{
			hTree=GetDlgItem(hWnd, IDC_TREE_JSON);// tree control
		}
		return FALSE;
	case WM_SIZE:
		{
			int width,height;
			width = LOWORD(lParam);
			height = HIWORD(lParam) - 30;
			SetWindowPos(GetDlgItem(hWnd, IDC_TREE_JSON), 
				HWND_TOP, 0, 30, width, height, 
				SWP_SHOWWINDOW);
		}
		return FALSE;
	case WM_COMMAND:
		{
			switch (LOWORD(wParam))
            {
				case IDC_BTN_REFRESH:
					refreshTree(hCurrScintilla);
					break;
			}
		}
		return FALSE;
	case WM_NOTIFY:
		{
			LPNMHDR lpnmh = (LPNMHDR)lParam;
            if(lpnmh->code == NM_CLICK && lpnmh-> idFrom == IDC_TREE_JSON)  
            {  
				HWND hWnd = getHSelf();
                DWORD dwPos = GetMessagePos();
                POINT pt;
                pt.x = LOWORD(dwPos);
                pt.y = HIWORD(dwPos);
                ScreenToClient(lpnmh->hwndFrom, &pt);
                TVHITTESTINFO ht = {0};
                ht.pt = pt;
                //ht.flags = TVHT_ONITEMLABEL;
                HTREEITEM hItem = TreeView_HitTest(lpnmh->hwndFrom, &ht);
				if(ht.flags & TVHT_ONITEMLABEL)
				{
					TVITEM ti = {0};
					ti.mask = TVIF_HANDLE | TVIF_TEXT | TVIF_PARAM;
					TCHAR buf[1024] = {0};
					ti.cchTextMax = 1024;
					ti.pszText = buf;
					ti.hItem = hItem;
					ti.lParam = -1;
					
					TreeView_GetItem(lpnmh->hwndFrom, &ti);
					long line = ti.lParam;
					if(line >= 0)
					{
						::SendMessage(hCurrScintilla, SCI_GOTOLINE, line - 1, 0);
					}
				}
            }  
		}
		return FALSE;
	default:
		return DockingDlgInterface::run_dlgProc(message, wParam, lParam);
	}

	return FALSE;
}

/*
Delete all items from the tree and creates the root node
*/
HTREEITEM JSONDialog::initTree(HWND hWndDlg)
{
	int TreeCount = TreeView_GetCount(GetDlgItem(this->getHSelf(), IDC_TREE_JSON));
	if(TreeCount>0)
		TreeView_DeleteAllItems(GetDlgItem(this->getHSelf(), IDC_TREE_JSON));

	HTREEITEM root = insertTree(TEXT("ROOT"), -1, TVI_ROOT);
	
	return root;		
}

HTREEITEM JSONDialog::insertTree(LPCTSTR text, LPARAM lparam, HTREEITEM parentNode)
{
	HWND hWnd = getHSelf();

	TV_INSERTSTRUCT tvinsert;

	if(parentNode == TVI_ROOT)
	{
		tvinsert.hParent = NULL;   
		tvinsert.hInsertAfter = TVI_ROOT;
	}
	else
	{
		tvinsert.hParent = parentNode;   
		tvinsert.hInsertAfter = TVI_LAST;
	}
	tvinsert.item.mask = TVIF_HANDLE | TVIF_TEXT | TVIF_PARAM;
	tvinsert.item.pszText = (LPTSTR)text;
	tvinsert.item.lParam = lparam;

	HTREEITEM item = (HTREEITEM)SendDlgItemMessage(
		hWnd, IDC_TREE_JSON, TVM_INSERTITEM, 0, (LPARAM)&tvinsert);

	return item;
}

void JSONDialog::refreshTree(HWND hCurrScintilla)
{
	this->hCurrScintilla = hCurrScintilla;

	size_t jsLen, jsLenSel;
	jsLen = ::SendMessage(hCurrScintilla, SCI_GETTEXTLENGTH, 0, 0);
    if (jsLen == 0) 
		return;

	size_t selStart = ::SendMessage(hCurrScintilla, SCI_GETSELECTIONSTART, 0, 0);
	size_t selEnd = ::SendMessage(hCurrScintilla, SCI_GETSELECTIONEND, 0, 0);
	bool bFormatSel = !(selStart == selEnd);

	char *pJS;

	if(!bFormatSel)
	{
		pJS = new char[jsLen+1];
		::SendMessage(hCurrScintilla, SCI_GETTEXT, jsLen + 1, (LPARAM)pJS);
	}
	else
	{
		jsLenSel = ::SendMessage(hCurrScintilla, SCI_GETSELTEXT, 0, 0);
		pJS = new char[jsLenSel];
		::SendMessage(hCurrScintilla, SCI_GETSELTEXT, jsLen, (LPARAM)pJS);
	}

	std::string strJSCode(pJS);

	JsonStringProc jsonProc(strJSCode);

	JsonValue jsonVal;
	jsonProc.Go(jsonVal);

	drawTree(jsonVal);

	delete[] pJS;
}

void JSONDialog::drawTree(const JsonValue& jsonValue)
{
	HWND hWnd = getHSelf();
	HTREEITEM rootNode;

	rootNode = initTree(hWnd);

	const JsonValue::VALUE_TYPE& valType = jsonValue.GetValueType();
	if(valType == JsonValue::UNKNOWN_VALUE)
	{
		::MessageBox(nppData._nppHandle, TEXT("Cannot parse json..."), TEXT("JsonViewer"), MB_OK);
		return;
	}

	insertJsonValue(jsonValue, rootNode);

	TreeView_Expand(GetDlgItem(hWnd, IDC_TREE_JSON), rootNode, TVE_EXPAND);
}

void JSONDialog::insertJsonValue(const JsonValue& jsonValue, HTREEITEM node)
{
	JsonValue::VALUE_TYPE valType = jsonValue.GetValueType();
	
	if(valType == JsonValue::MAP_VALUE)
	{
		const JsonUnsortedMap& mapValue = jsonValue.GetMapValue();

		JsonUnsortedMap::const_iterator itr = mapValue.begin();
		for(; itr != mapValue.end(); ++itr)
		{
			const string& key = itr->first;
			const JsonValue& value = itr->second;

			insertJsonValue(key, value, node);
		}
	}
	else if(valType == JsonValue::ARRAY_VALUE)
	{
		const JsonVec& arrayValue = jsonValue.GetArrayValue();

		char buffer[1024];

		JsonVec::const_iterator itr = arrayValue.begin();
		JsonVec::size_type count = 0;
		for(; itr != arrayValue.end(); ++itr, ++count)
		{
			const JsonValue& value = *itr;
			
			itoa(count, buffer, 10);
			string key(buffer);
			key = "[" + key + "]";

			insertJsonValue(key, value, node);
		}
	}
}

void JSONDialog::insertJsonValue(const string& key, const JsonValue& jsonValue, HTREEITEM node)
{
	tstring tstr(strtotstr(key));
	JsonValue::VALUE_TYPE valType = jsonValue.GetValueType();

	if(valType == JsonValue::UNKNOWN_VALUE ||
		valType == JsonValue::NUMBER_VALUE ||
		valType == JsonValue::BOOL_VALUE ||
		valType == JsonValue::REGULAR_VALUE)
	{
		tstr.append(TEXT(" : "));
		tstr.append(strtotstr(jsonValue.GetStrValue()));
		insertTree(tstr.c_str(), jsonValue.line, node);
	}
	else if(valType == JsonValue::STRING_VALUE)
	{
		tstr.append(TEXT(" : "));
		tstr.append(TEXT("\""));
		tstr.append(strtotstr(jsonValue.GetStrValue()));
		tstr.append(TEXT("\""));
		insertTree(tstr.c_str(), jsonValue.line, node);
	}
	if(valType == JsonValue::MAP_VALUE ||
		valType == JsonValue::ARRAY_VALUE)
	{
		if(valType == JsonValue::MAP_VALUE)
			tstr.append(TEXT(" : [Object]"));
		if(valType == JsonValue::ARRAY_VALUE)
			tstr.append(TEXT(" : [Array]"));

		HTREEITEM newNode = insertTree(tstr.c_str(), jsonValue.line, node);
		insertJsonValue(jsonValue, newNode);
	}
}

