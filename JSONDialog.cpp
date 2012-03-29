/*
This file is part of JSONViewer Plugin for Notepad++
Copyright (C)2011 Kapil Ratnani <kapil.ratnani@iiitb.net>

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

extern NppData nppData;

/*
Delete all items from the tree and creates the root node
*/
HTREEITEM JSONDialog::initTree(HWND hWndDlg)
{

	int TreeCount=TreeView_GetCount(GetDlgItem(this->getHSelf(),IDC_TREE_JSON));
	if(TreeCount>0)
		TreeView_DeleteAllItems(GetDlgItem(this->getHSelf(),IDC_TREE_JSON));

	HTREEITEM root = insertTree(TEXT("ROOT"), TVI_ROOT);
	
	return root;		
}

HTREEITEM JSONDialog::insertTree(LPTSTR text, HTREEITEM parentNode)
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
	tvinsert.item.mask = TVIF_TEXT;

	tvinsert.item.pszText = text;
	HTREEITEM item = (HTREEITEM)SendDlgItemMessage(
		hWnd, IDC_TREE_JSON, TVM_INSERTITEM, 0, (LPARAM)&tvinsert);

	return item;
}

/*
parses curJSON and draws the tree.
marks the error location in case of a parsing error
*/
void JSONDialog::drawTree()
{
	HWND hWnd = getHSelf();
	HTREEITEM tree_root;

	tree_root = initTree(hWnd);

	/*HTREEITEM node1 = insertTree(TEXT("JSON2"), tree_root);
	HTREEITEM node2 = insertTree(TEXT("JSON3"), node1);*/

	TreeView_Expand(GetDlgItem(hWnd, IDC_TREE_JSON), tree_root, TVE_EXPAND);
}

BOOL CALLBACK JSONDialog::run_dlgProc(UINT message, WPARAM wParam, LPARAM lParam)
{
	int width,height;
	switch (message) 
	{
	case WM_INITDIALOG:
		hTree=GetDlgItem(this->getHSelf(),IDC_TREE_JSON);// tree control
		return TRUE;

	case WM_SIZE:
		width=LOWORD(lParam);
		height=HIWORD(lParam) - 30;
		SetWindowPos(GetDlgItem(this->getHSelf(),IDC_TREE_JSON),HWND_TOP,0,30,width,height,SWP_SHOWWINDOW);
		return TRUE;

	default :
		return DockingDlgInterface::run_dlgProc(message, wParam, lParam);
	}
}

