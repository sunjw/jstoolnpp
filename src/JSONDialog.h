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

#ifndef _JSON_DIALOG_H_
#define _JSON_DIALOG_H_

#include "resource.h"
#include "DockingDlgInterface.h"
#include "PluginInterface.h"

#include "jsonpp.h"

class JSONDialog: public DockingDlgInterface
{
public :
	JSONDialog(): 
	   DockingDlgInterface(IDD_TREE), hCurrScintilla(NULL)
	{};

    virtual void display(bool toShow = true) const {
        DockingDlgInterface::display(toShow);
    };

	void setParent(HWND parent2set){
		_hParent = parent2set;
	};

	void refreshTree(HWND hCurrScintilla);
	void drawTree(const JsonValue& jsonValue);

protected :
	virtual BOOL CALLBACK run_dlgProc(UINT message, WPARAM wParam, LPARAM lParam);

private:
	HWND hCurrScintilla;
	HANDLE hTree;


	HTREEITEM initTree(HWND hWndDlg);
	HTREEITEM insertTree(LPCTSTR text, LPARAM lparam, HTREEITEM parentNode);

	void insertJsonValue(const JsonValue& jsonValue, HTREEITEM node);
	void insertJsonValue(const std::string& key, const JsonValue& jsonValue, HTREEITEM node);
};

#endif //JSONDIALOG_H
