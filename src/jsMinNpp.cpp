//this file a source file of JSMinNpp
//Copyright (C) 2007 Don HO <donho@altern.org>
//Copyright (C) 2010-2010 Sun Junwen
//
//This program is free software; you can redistribute it and/or
//modify it under the terms of the GNU General Public License
//as published by the Free Software Foundation; either
//version 2 of the License, or (at your option) any later version.
//
//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//GNU General Public License for more details.
//
//You should have received a copy of the GNU General Public License
//along with this program; if not, write to the Free Software
//Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
#include <stdexcept>
#include <string>

#include "comDef.h"
#include "PluginInterface.h"
#include "menuCmdID.h"
#include "jsMinNpp.h"
#include "utility.h"
#include "version.h"
#include "optionsDlg.h"
#include "aboutDlg.h"

#include "jsminCharArray.h"
#include "jsformatString.h"

BOOL APIENTRY DllMain( HANDLE hModule, 
                       DWORD  reasonForCall, 
                       LPVOID lpReserved )
{
	switch (reasonForCall)
	{
		case DLL_PROCESS_ATTACH:
		{
			g_hMod = hModule;
			jsonDialog.init((HINSTANCE)g_hMod, nppData._nppHandle);

			ShortcutKey *pShKey;
			_hInst = (HINSTANCE)hModule;
			
			for(int i = 0; i < nbFunc; ++i)
			{
				funcItem[i]._init2Check = false;
				// If you don't need the shortcut, you have to make it NULL
				funcItem[i]._pShKey = NULL;
			}

			funcItem[0]._pFunc = jsMinCurrent;
			funcItem[1]._pFunc = jsMinNew;
			funcItem[2]._pFunc = NULL;

			funcItem[3]._pFunc = jsFormat;
			funcItem[4]._pFunc = NULL;

			funcItem[5]._pFunc = jsonTree;
			funcItem[6]._pFunc = NULL;

			funcItem[7]._pFunc = options;
			funcItem[8]._pFunc = NULL;

			funcItem[9]._pFunc = checkUpdate;
			funcItem[10]._pFunc = donate;
			funcItem[11]._pFunc = about;

			lstrcpy(funcItem[0]._itemName, TEXT("JS&Min"));
			lstrcpy(funcItem[1]._itemName, TEXT("JSMin (&New file)"));
			lstrcpy(funcItem[2]._itemName, TEXT("-SEPARATOR-"));

			lstrcpy(funcItem[3]._itemName, TEXT("JS&Format"));
			pShKey = new ShortcutKey; // Ctrl+Alt+M
			pShKey->_isAlt = true;
			pShKey->_isCtrl = true;
			pShKey->_isShift = false;
			pShKey->_key = 'M';
			funcItem[3]._pShKey = pShKey;
			lstrcpy(funcItem[4]._itemName, TEXT("-SEPARATOR-"));

			lstrcpy(funcItem[5]._itemName, TEXT("Json &Viewer"));
			pShKey = new ShortcutKey; // Ctrl+Alt+J
			pShKey->_isAlt = true;
			pShKey->_isCtrl = true;
			pShKey->_isShift = false;
			pShKey->_key = 'J';
			funcItem[5]._pShKey = pShKey;
			lstrcpy(funcItem[6]._itemName, TEXT("-SEPARATOR-"));

			lstrcpy(funcItem[7]._itemName, TEXT("&Options..."));
			lstrcpy(funcItem[8]._itemName, TEXT("-SEPARATOR-"));

			lstrcpy(funcItem[9]._itemName, TEXT("&Check for update..."));
			lstrcpy(funcItem[10]._itemName, TEXT("&Donate"));
			lstrcpy(funcItem[11]._itemName, TEXT("&About"));
		}
		break;

		case DLL_PROCESS_DETACH:
		break;

		case DLL_THREAD_ATTACH:
		break;

		case DLL_THREAD_DETACH:
		break;
	}
	return TRUE;
}

extern "C" __declspec(dllexport) void setInfo(NppData notpadPlusData)
{
	nppData = notpadPlusData;
	// 载入设置
	loadOption(nppData._nppHandle, struOptions);
}

extern "C" __declspec(dllexport) const TCHAR *getName()
{
	return TEXT(PLUGIN_NAME);
}

extern "C" __declspec(dllexport) FuncItem *getFuncsArray(int *nbF)
{
	*nbF = nbFunc;
	return funcItem;
}

extern "C" __declspec(dllexport) void beNotified(SCNotification *notifyCode)
{	
}

#ifdef UNICODE
extern "C" __declspec(dllexport) BOOL isUnicode()
{
	return TRUE;
}
#endif //UNICODE

// Here you can process the Npp Messages 
// I will make the messages accessible little by little, according to the need of plugin development.
// Please let me know if you need to access to some messages :
// http://sourceforge.net/forum/forum.php?forum_id=482781
//
extern "C" __declspec(dllexport) LRESULT messageProc(UINT Message, WPARAM wParam, LPARAM lParam)
{
	return TRUE;
}

HWND getCurrentScintillaHandle() {
    int currentEdit;
    ::SendMessage(nppData._nppHandle, NPPM_GETCURRENTSCINTILLA, 0, (LPARAM)&currentEdit);
	return (currentEdit == 0)?nppData._scintillaMainHandle:nppData._scintillaSecondHandle;
};

void fillZero(unsigned char *buffer, size_t length)
{
	for(size_t i = 0; i < length; ++i)
		buffer[i] = '\0';
}

void trim(unsigned char *source)
{
	size_t realStart = 0;
	size_t len = strlen(reinterpret_cast<char*>(source));
	for(; realStart < len; ++realStart)
	{
		if(source[realStart] != ' ' &&
			source[realStart] != '\t' &&
			source[realStart] != '\r' &&
			source[realStart] != '\n')
			break;
	}

	strcpy(reinterpret_cast<char*>(source), reinterpret_cast<char*>(source + realStart));
}

void jsMinCurrent()
{
	jsMin(false);
}

void jsMinNew()
{
	jsMin(true);
}

void jsMin(bool bNewFile)
{
	HWND hCurrScintilla = getCurrentScintillaHandle();

	size_t jsLen = ::SendMessage(hCurrScintilla, SCI_GETTEXTLENGTH, 0, 0);;
    if (jsLen == 0) 
		return;

	//::SendMessage(hCurrScintilla, SCI_SETSEL, 0, jsLen);

    unsigned char *pJS = new unsigned char[jsLen+1];
    
    ::SendMessage(hCurrScintilla, SCI_GETTEXT, jsLen + 1, (LPARAM)pJS);

	size_t jsMinLen = jsLen + 10; // seem to be something wrong, so add some empty places
	unsigned char *pJSMin = new unsigned char[jsMinLen];

	fillZero(pJSMin, jsMinLen);

	try
	{
		JSMinCharArray jsmin(pJS, pJSMin, struOptions.bPutCR, struOptions.bKeepTopComt);
		jsmin.go();

		trim(pJSMin);

		if(bNewFile)
		{
			// Open a new document
			::SendMessage(nppData._nppHandle, NPPM_MENUCOMMAND, 0, IDM_FILE_NEW);

			// ReGet the current scintilla
			hCurrScintilla = getCurrentScintillaHandle();

			::SendMessage(hCurrScintilla, SCI_SETTEXT, 0, (LPARAM)pJSMin);

			// Set file's language 
			::SendMessage(nppData._nppHandle, NPPM_MENUCOMMAND, 0, IDM_LANG_JS);
		}
		else
		{
			::SendMessage(hCurrScintilla, SCI_SETTEXT, 0, (LPARAM)pJSMin);
		}
		
	}
	catch(std::runtime_error ex)
	{
		::MessageBox(nppData._nppHandle, TEXT("ERROR"), TEXT("JSMin"), MB_OK);
		//cout << "Error: " << ex.what() << endl;
	}

	/*strcpy(pJSMin, pJS);
	::SendMessage(hCurrScintilla, SCI_REPLACESEL, 0, (LPARAM)pJSMin);
	::SendMessage(hCurrScintilla, SCI_SETSEL, start, start+strlen(pJSMin));*/

	delete [] pJS;
	delete [] pJSMin;
}

void jsFormat()
{
	HWND hCurrScintilla = getCurrentScintillaHandle();

	size_t jsLen = ::SendMessage(hCurrScintilla, SCI_GETTEXTLENGTH, 0, 0);
    if (jsLen == 0) 
		return;

	size_t selStart = ::SendMessage(hCurrScintilla, SCI_GETSELECTIONSTART, 0, 0);
	size_t selEnd = ::SendMessage(hCurrScintilla, SCI_GETSELECTIONEND, 0, 0);
	bool bFormatSel = !(selStart == selEnd);

	size_t jsLenSel;
	char *pJS;
	std::string initIndent("");
	std::string strJSFormat;
	
	size_t currentPos;
	size_t line;

	if(!bFormatSel)
	{
		// 格式化全部
		pJS = new char[jsLen+1];
		::SendMessage(hCurrScintilla, SCI_GETTEXT, jsLen + 1, (LPARAM)pJS);

		currentPos = ::SendMessage(hCurrScintilla, SCI_GETCURRENTPOS, 0, 0);
		line = ::SendMessage(hCurrScintilla, SCI_LINEFROMPOSITION, currentPos, 0);
	}
	else
	{
		// 格式化选中部分
		char testChar;
		// 找行头
		while(selStart > 0)
		{
			testChar = ::SendMessage(hCurrScintilla, SCI_GETCHARAT, selStart - 1, 0);
			if(testChar == '\r' || testChar == '\n')
				break;

			--selStart;
		}
		// 找行尾
		while(selEnd < jsLen)
		{
			testChar = ::SendMessage(hCurrScintilla, SCI_GETCHARAT, selEnd, 0);
			if(testChar == '\r' || testChar == '\n')
				break;

			++selEnd;
		}

		// 重新选择整行
		::SendMessage(hCurrScintilla, SCI_SETSELECTIONSTART, selStart, 0);
		::SendMessage(hCurrScintilla, SCI_SETSELECTIONEND, selEnd, 0);

		// 获得 Sel
		jsLenSel = ::SendMessage(hCurrScintilla, SCI_GETSELTEXT, 0, 0);
		pJS = new char[jsLenSel];
		::SendMessage(hCurrScintilla, SCI_GETSELTEXT, jsLen, (LPARAM)pJS);

		// 得到 Initial Indent
		for(size_t i = 0; i < jsLenSel; ++i)
		{
			testChar = pJS[i];
			if(testChar != ' ' && testChar != '\t')
				break;
			initIndent += testChar;
		}
	}

	try
	{
		int _nChPerInd = struOptions.nChPerInd;
		if(struOptions.chIndent == '\t')
			_nChPerInd = 1;

		JSFormatString::FormatterOption formatterOption;
		formatterOption.chIndent = struOptions.chIndent;
		formatterOption.nChPerInd = _nChPerInd;
		formatterOption.eCRPut = struOptions.bPutCR ? 
			JSFormatString::PUT_CR : JSFormatString::NOT_PUT_CR;
		formatterOption.eBracNL = struOptions.bNLBracket ?
			JSFormatString::NEWLINE_BRAC : JSFormatString::NO_NEWLINE_BRAC;
		formatterOption.eEmpytIndent = struOptions.bIndentInEmpty ?
			JSFormatString::INDENT_IN_EMPTYLINE : JSFormatString::NO_INDENT_IN_EMPTYLINE;

		JSFormatString jsformat(pJS, &strJSFormat, formatterOption);
		if(bFormatSel)
			jsformat.SetInitIndent(initIndent);
		jsformat.Go();

		if(!bFormatSel)
		{
			::SendMessage(hCurrScintilla, SCI_SETTEXT, 0, (LPARAM)(strJSFormat.c_str()));
			::SendMessage(nppData._nppHandle, NPPM_MENUCOMMAND, 0, IDM_LANG_JS);

			::SendMessage(hCurrScintilla, SCI_GOTOLINE, line + 10, 0);
		}
		else
		{
			// 清理多出来的换行
			if(strJSFormat[strJSFormat.length() - 2] == '\r')
				strJSFormat = strJSFormat.substr(0, strJSFormat.length() - 2);
			else
				strJSFormat = strJSFormat.substr(0, strJSFormat.length() - 1);
			
			::SendMessage(hCurrScintilla, SCI_REPLACESEL, 0, (LPARAM)strJSFormat.c_str());
			::SendMessage(hCurrScintilla, SCI_SETCURRENTPOS, selStart, 0);
		}
	}
	catch(std::exception ex)
	{
		::MessageBox(nppData._nppHandle, TEXT("ERROR"), TEXT("JSFormat"), MB_OK);
	}

	delete[] pJS;
}

void jsonTree()
{
	//::MessageBox(nppData._nppHandle, TEXT("SUNViewer"), TEXT("JsonTree!!!"), MB_OK);
	jsonDialog.setParent(nppData._nppHandle);
	tTbData	data = {0};

	if (!jsonDialog.isCreated())
	{
		jsonDialog.create(&data);

		// define the default docking behaviour
		data.uMask = DWS_DF_CONT_LEFT;

		data.pszModuleName = jsonDialog.getPluginFileName();
		data.pszName = TEXT("JSToolNpp JSON Viewer");

		// the dlgDlg should be the index of funcItem where the current function pointer is
		data.dlgID = 0;
		::SendMessage(nppData._nppHandle, NPPM_DMMREGASDCKDLG, 0, (LPARAM)&data);
	}
	jsonDialog.display();

	HWND hCurrScintilla = getCurrentScintillaHandle();

	jsonDialog.refreshTree(hCurrScintilla);
}

void options()
{
	INT_PTR nRet = ::DialogBox(_hInst, 
							MAKEINTRESOURCE(IDD_OPTIONSBOX),
							nppData._nppHandle, 
							(DLGPROC)dlgProcOptions);
}

void checkUpdate()
{
	tstring url(TEXT(CHECK_UPDATE));
	tstring version(TEXT(VERSION_VALUE));
	url.append(TEXT("?ver="));
	url.append(version);

	ShellExecute(NULL, TEXT("open"), url.c_str(), NULL, NULL, SW_SHOW);
}

void donate()
{
	ShellExecute(NULL, TEXT("open"), TEXT(DONATION), NULL, NULL, SW_SHOW);
}

void about()
{
	INT_PTR nRet = ::DialogBox(_hInst, 
							MAKEINTRESOURCE(IDD_ABOUTBOX),
							nppData._nppHandle, 
							(DLGPROC)dlgProcAbout);
}
