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
#include "JsonTree.h"
#include "EditControlEx.h"

using namespace std;
using namespace sunjwbase;

extern NppData g_nppData;


BOOL CALLBACK JSONDialog::run_dlgProc(UINT message, WPARAM wParam, LPARAM lParam)
{
	HWND hWnd = getHSelf();
	switch (message) 
	{
	case WM_INITDIALOG:
		{
			m_hDlg = hWnd;

			// Save ourself in GWL_USERDATA.
			::SetWindowLongPtr(m_hDlg, GWL_USERDATA, (LONG_PTR)this);

			m_hTree = GetDlgItem(hWnd, IDC_TREE_JSON); // tree control
			::SendMessage(hWnd, DM_SETDEFID, 
                        (WPARAM) IDC_BTN_SEARCH, 
                        (LPARAM) 0);

			HWND hJsonPathEdit = GetDlgItem(hWnd, IDC_JSONPATH);
			
			m_editExJsonPath = new EditControlEx(hWnd, IDC_JSONPATH);
			
			//m_oldJsonPathEditControlProc = ::GetWindowLongPtr(hJsonPathEdit, GWLP_WNDPROC);
			//::SetWindowLongPtr(hJsonPathEdit, GWLP_WNDPROC,
			//	(LONG_PTR)JSONDialog::JsonPathEditControlProc);
		}
		return TRUE;
	case WM_CLOSE:
		{
			if (m_editExJsonPath != NULL)
				delete m_editExJsonPath;
			if (m_jsonTree != NULL)
				delete m_jsonTree;
		}
		return TRUE;
	case WM_SIZE:
		{
			int iDlgWidth,iDlgHeight;
			iDlgWidth = LOWORD(lParam);
			iDlgHeight = HIWORD(lParam);

			int iJsonTreeWidth = iDlgWidth, iJsonTreeHeight = iDlgHeight - 55;
			SetWindowPos(GetDlgItem(hWnd, IDC_TREE_JSON), 
				HWND_TOP, 0, 30, iJsonTreeWidth, iJsonTreeHeight, 
				SWP_SHOWWINDOW);

			if(iDlgWidth < 215) // 170 + 45
				iDlgWidth = 215;

			int iSearchEditWidth = iDlgWidth - 170;
			SetWindowPos(GetDlgItem(hWnd, IDC_BTN_SEARCH), 
				HWND_TOP, 92 + iSearchEditWidth, 0, 74, 22, 
				SWP_SHOWWINDOW);

			SetWindowPos(GetDlgItem(hWnd, IDC_SEARCHEDIT), 
				HWND_TOP, 88, 2, iSearchEditWidth, 18, 
				SWP_SHOWWINDOW);

			int iJsonPathEditWidth = iDlgWidth - 4;
			SetWindowPos(GetDlgItem(hWnd, IDC_JSONPATH), 
				HWND_TOP, 1, iJsonTreeHeight + 33, iJsonPathEditWidth, 18, 
				SWP_SHOWWINDOW);
		}
		return TRUE;
	case WM_COMMAND:
		{
			switch (LOWORD(wParam))
            {
				case IDC_BTN_REFRESH:
					refreshTree(m_hCurrScintilla);
					break;
				case IDC_BTN_SEARCH:
					search();
					break;
			}
		}
		return TRUE;
	case WM_NOTIFY:
		{
			clickJsonTree(lParam);
		}
		return TRUE;
	default:
		return DockingDlgInterface::run_dlgProc(message, wParam, lParam);
	}

	return FALSE;
}

/*LRESULT CALLBACK JSONDialog::JsonPathEditControlProc(HWND hDlg, 
													 UINT message, 
													 UINT wParam, 
													 LONG lParam)
{
	//JSONDialog *pJsonDlg = (JSONDialog *)(::GetWindowLongPtr(hDlg, GWL_USERDATA));
	//return CallWindowProc((WNDPROC)pJsonDlg->m_oldJsonPathEditControlProc, 
	//	hDlg, message, wParam, lParam);
}*/

tstring JSONDialog::convertJsonStrToDialogTstr(const string& str)
{
	if(m_bUTF8Json)
		return strtotstrutf8(str);
	else
		return strtotstr(str);
}

void JSONDialog::disableControls()
{
	EnableWindow(GetDlgItem(m_hDlg, IDC_BTN_REFRESH), FALSE);
	EnableWindow(GetDlgItem(m_hDlg, IDC_SEARCHEDIT), FALSE);
	EnableWindow(GetDlgItem(m_hDlg, IDC_BTN_SEARCH), FALSE);
	EnableWindow(GetDlgItem(m_hDlg, IDC_TREE_JSON), FALSE);
}

void JSONDialog::enableControls()
{
	EnableWindow(GetDlgItem(m_hDlg, IDC_BTN_REFRESH), TRUE);
	EnableWindow(GetDlgItem(m_hDlg, IDC_SEARCHEDIT), TRUE);
	EnableWindow(GetDlgItem(m_hDlg, IDC_BTN_SEARCH), TRUE);
	EnableWindow(GetDlgItem(m_hDlg, IDC_TREE_JSON), TRUE);
}

void JSONDialog::focusOnControl(int nId)
{
	::PostMessage(m_hDlg, 
		WM_NEXTDLGCTL, 
		(WPARAM) GetDlgItem(m_hDlg, nId), 
		TRUE);
}

/*
Delete all items from the tree and creates the root node
*/
HTREEITEM JSONDialog::initTree()
{
	int TreeCount = TreeView_GetCount(GetDlgItem(m_hDlg, IDC_TREE_JSON));
	if(TreeCount>0)
		TreeView_DeleteAllItems(GetDlgItem(m_hDlg, IDC_TREE_JSON));

	HTREEITEM root = insertTree(TEXT("ROOT"), -1, TVI_ROOT);
	
	return root;		
}

HTREEITEM JSONDialog::insertTree(LPCTSTR text, LPARAM lparam, HTREEITEM parentNode)
{
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
		m_hDlg, IDC_TREE_JSON, TVM_INSERTITEM, 0, (LPARAM)&tvinsert);

	return item;
}

void JSONDialog::refreshTree(HWND hCurrScintilla)
{
	disableControls();

	// Scintilla handle will change.
	m_hCurrScintilla = hCurrScintilla;
	// Rebuild JsonTree.
	if (m_jsonTree != NULL)
		delete m_jsonTree;
	m_jsonTree = new JsonTree(m_hCurrScintilla, m_hDlg, m_hTree);

	size_t jsLen, jsLenSel;
	jsLen = ::SendMessage(m_hCurrScintilla, SCI_GETTEXTLENGTH, 0, 0);
    if (jsLen == 0) 
		return;

	size_t selStart = ::SendMessage(m_hCurrScintilla, SCI_GETSELECTIONSTART, 0, 0);
	size_t selEnd = ::SendMessage(m_hCurrScintilla, SCI_GETSELECTIONEND, 0, 0);
	bool bFormatSel = !(selStart == selEnd);

	char *pJS;

	if(!bFormatSel)
	{
		pJS = new char[jsLen+1];
		::SendMessage(m_hCurrScintilla, SCI_GETTEXT, jsLen + 1, (LPARAM)pJS);
		m_iSelStartLine = 0;
	}
	else
	{
		jsLenSel = ::SendMessage(m_hCurrScintilla, SCI_GETSELTEXT, 0, 0);
		pJS = new char[jsLenSel];
		::SendMessage(m_hCurrScintilla, SCI_GETSELTEXT, jsLen, (LPARAM)pJS);

		m_iSelStartLine = ::SendMessage(m_hCurrScintilla, SCI_LINEFROMPOSITION, selStart, 0);
	}

	std::string strJSCode(pJS);
	m_bUTF8Json = false;

	int codePage = ::SendMessage(m_hCurrScintilla, SCI_GETCODEPAGE, 0, 0);
	if(codePage == 65001)
	{
		// UTF-8
		m_bUTF8Json = true;
	}

	JsonStringProc jsonProc(strJSCode);

	JsonValue jsonVal;
	jsonProc.Go(jsonVal);

	drawTree(jsonVal);

	delete[] pJS;

	SetDlgItemText(m_hDlg, IDC_JSONPATH, TEXT(""));

	enableControls();

	focusOnControl(IDC_SEARCHEDIT);
}

void JSONDialog::drawTree(const JsonValue& jsonValue)
{
	HTREEITEM rootNode;

	rootNode = initTree();

	const JsonValue::VALUE_TYPE& valType = jsonValue.GetValueType();
	if(valType == JsonValue::UNKNOWN_VALUE)
	{
		::MessageBox(g_nppData._nppHandle, TEXT("Cannot parse json..."), TEXT("JsonViewer"), MB_OK);
		return;
	}

	insertJsonValue(jsonValue, rootNode);

	TreeView_Expand(GetDlgItem(m_hDlg, IDC_TREE_JSON), rootNode, TVE_EXPAND);
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
	tstring tstr(convertJsonStrToDialogTstr(key));

	JsonValue::VALUE_TYPE valType = jsonValue.GetValueType();

	if(valType == JsonValue::UNKNOWN_VALUE ||
		valType == JsonValue::NUMBER_VALUE ||
		valType == JsonValue::BOOL_VALUE ||
		valType == JsonValue::REGULAR_VALUE)
	{
		tstr.append(TEXT(" : "));
		tstr.append(convertJsonStrToDialogTstr(jsonValue.GetStrValue()));
		insertTree(tstr.c_str(), jsonValue.line, node);
	}
	else if(valType == JsonValue::STRING_VALUE)
	{
		tstr.append(TEXT(" : "));
		tstr.append(TEXT("\""));
		tstr.append(convertJsonStrToDialogTstr(jsonValue.GetStrValue()));
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

void JSONDialog::clickJsonTree(LPARAM lParam)
{
	LPNMHDR lpnmh = (LPNMHDR)lParam;
	if (lpnmh->idFrom != IDC_TREE_JSON)
		return; // Not click inside JsonTree

	switch (lpnmh->code)
	{
	case NM_CLICK:
	case NM_RCLICK:
		{
			BOOL bRightClick = FALSE;
			if (lpnmh->code == NM_RCLICK)
				bRightClick = TRUE;

			DWORD dwPos = GetMessagePos();
			POINT ptScreen, ptClient;
			ptScreen.x = LOWORD(dwPos);
			ptScreen.y = HIWORD(dwPos);

			ptClient = ptScreen;
			m_jsonTree->screenToTreeView(&ptClient);

			TVHITTESTINFO ht = {0};
			ht.pt = ptClient;
			HTREEITEM hItem = m_jsonTree->hitTest(&ht);
			if (hItem == NULL)
				return; // No hit

			if (!bRightClick && (ht.flags & TVHT_ONITEMLABEL))
			{
				// Left click
				clickJsonTreeItem(hItem, &ptScreen);
			}
			else if (bRightClick && (ht.flags & (TVHT_ONITEM | TVHT_ONITEMBUTTON)))
			{
				// Right click
				clickJsonTreeItem(hItem, &ptScreen);
				clickJsonTreeItemRight(hItem, &ptScreen);
			}
		}
		break;
	case TVN_SELCHANGED:
		{
			NMTREEVIEW *pnmtv = (LPNMTREEVIEW)lParam;
			HTREEITEM hItem = pnmtv->itemNew.hItem;
			if (hItem && pnmtv->action == TVC_BYKEYBOARD)
			{
				clickJsonTreeItem(hItem, NULL);
			}
		}
		break;
	}
}

void JSONDialog::clickJsonTreeItem(HTREEITEM htiNode, LPPOINT lppScreen)
{
	tstring tstrJsonPath = m_jsonTree->getJsonNodePath(htiNode);
	SetDlgItemText(m_hDlg, IDC_JSONPATH, tstrJsonPath.c_str());
	m_jsonTree->jumpToSciLine(htiNode, m_iSelStartLine);
}

void JSONDialog::clickJsonTreeItemRight(HTREEITEM htiNode, LPPOINT lppScreen)
{
	// Select it
	m_jsonTree->selectItem(htiNode);

	// Show menu
	if (lppScreen != NULL)
	{
		HMENU hMenuPopup = CreatePopupMenu();

		AppendMenu(hMenuPopup, MF_STRING, 
			IDM_JSON_COPYNAME, TEXT("Copy name"));
		AppendMenu(hMenuPopup, MF_STRING | MF_DISABLED, 
			IDM_JSON_COPYVALUE, TEXT("Copy value"));

		AppendMenu(hMenuPopup, MF_SEPARATOR, 0, NULL);

		TrackPopupMenu(hMenuPopup, TPM_LEFTALIGN | TPM_RIGHTBUTTON,
			lppScreen->x, lppScreen->y, 0, m_hDlg, NULL);

		DestroyMenu(hMenuPopup);
	}
}

void JSONDialog::search()
{
	disableControls();

	TCHAR buffer[256];
	GetWindowText(GetDlgItem(m_hDlg, IDC_SEARCHEDIT), buffer, 255);
	
	tstring tstrSearchKey(buffer);

	HTREEITEM htiSelected = m_jsonTree->getSelection();
	if (htiSelected == NULL)
	{
		// Nothing, so we do search from ROOT
		htiSelected = m_jsonTree->getRoot();
	}

	if (htiSelected == NULL)
		return; // Still NULL, return.

	/*
	 * Now, we have a valid "selectedItem".
	 * We do search.
	 */
	HTREEITEM htiFound = NULL;
	
	htiFound = m_jsonTree->search(tstrSearchKey, htiSelected);

	if (htiFound != NULL)
	{
		// We found in search.
		m_jsonTree->selectItem(htiFound);
		clickJsonTreeItem(htiFound, NULL);
	}
	else
	{
		MessageBox(m_hDlg, TEXT("No results found."), TEXT("Search in Json"), MB_ICONINFORMATION | MB_OK);
	}

	enableControls();
}

