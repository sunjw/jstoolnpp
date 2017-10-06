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
#include <time.h>
#include <stdexcept>
#include <string>

//#define _CRTDBG_MAP_ALLOC
//#include <stdlib.h>
//#include <crtdbg.h>

#include <windows.h>
#include <process.h>
#include <Wininet.h>

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
#include "jsonStringProc.h"

static const int s_nbFunc = 13;

static FuncItem s_funcItem[s_nbFunc];
static HMENU s_ownMenu = NULL;
static HBITMAP s_hJsonViewBitmap = NULL;

static JSONDialog s_jsonDialog;

static BOOL s_updateThreadRunning = FALSE;
static time_t s_lastUpdateCheckTime = 0;
static BOOL s_foundNewVersion = FALSE;


BOOL APIENTRY DllMain( HANDLE hModule, 
                       DWORD  reasonForCall, 
                       LPVOID lpReserved )
{
	switch (reasonForCall)
	{
		case DLL_PROCESS_ATTACH:
		{
			/*_CrtSetDbgFlag ( _CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF );*/

			g_hInst = (HINSTANCE)hModule;
			s_jsonDialog.init((HINSTANCE)g_hInst, g_nppData._nppHandle);

			ShortcutKey *pShKey;
			for(int i = 0; i < s_nbFunc; ++i)
			{
				s_funcItem[i]._init2Check = false;
				// If you don't need the shortcut, you have to make it NULL
				s_funcItem[i]._pShKey = NULL;
			}

			s_funcItem[0]._pFunc = jsMinCurrent;
			s_funcItem[1]._pFunc = jsMinNew;
			s_funcItem[2]._pFunc = NULL;

			s_funcItem[3]._pFunc = jsFormat;
			s_funcItem[4]._pFunc = NULL;

			s_funcItem[5]._pFunc = jsonTree;
			s_funcItem[6]._pFunc = NULL;

			s_funcItem[7]._pFunc = options;
			s_funcItem[8]._pFunc = NULL;

			s_funcItem[9]._pFunc = openProjectSite;
			s_funcItem[10]._pFunc = openGitHub;
			s_funcItem[11]._pFunc = checkUpdate;
			s_funcItem[12]._pFunc = about;

			lstrcpy(s_funcItem[0]._itemName, TEXT(STRING_JSMIN));
			lstrcpy(s_funcItem[1]._itemName, TEXT(STRING_JSMIN_NEW_FILE));
			lstrcpy(s_funcItem[2]._itemName, TEXT("-SEPARATOR-"));

			lstrcpy(s_funcItem[3]._itemName, TEXT(STRING_JSFORMAT));
			pShKey = new ShortcutKey; // Ctrl+Alt+M
			pShKey->_isAlt = true;
			pShKey->_isCtrl = true;
			pShKey->_isShift = false;
			pShKey->_key = 'M';
			s_funcItem[3]._pShKey = pShKey;
			lstrcpy(s_funcItem[4]._itemName, TEXT("-SEPARATOR-"));

			lstrcpy(s_funcItem[5]._itemName, TEXT(STRING_JSON_VIEWER));
			pShKey = new ShortcutKey; // Ctrl+Alt+J
			pShKey->_isAlt = true;
			pShKey->_isCtrl = true;
			pShKey->_isShift = false;
			pShKey->_key = 'J';
			s_funcItem[5]._pShKey = pShKey;
			lstrcpy(s_funcItem[6]._itemName, TEXT("-SEPARATOR-"));

			lstrcpy(s_funcItem[7]._itemName, TEXT(STRING_OPTIONS));
			lstrcpy(s_funcItem[8]._itemName, TEXT("-SEPARATOR-"));

			lstrcpy(s_funcItem[9]._itemName, TEXT(STRING_PROJECT_SITE));
			lstrcpy(s_funcItem[10]._itemName, TEXT(STRING_SOURCE_CODE_GITHUB));
			lstrcpy(s_funcItem[11]._itemName, TEXT(STRING_CHECK_UPDATE));
			lstrcpy(s_funcItem[12]._itemName, TEXT(STRING_ABOUT));

			s_hJsonViewBitmap = (HBITMAP)::LoadImage(g_hInst, MAKEINTRESOURCE(IDB_BITMAP_JSONVIEW), IMAGE_BITMAP,
				0, 0, (LR_DEFAULTSIZE | LR_LOADMAP3DCOLORS));
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
	g_nppData = notpadPlusData;
	// 载入设置
	LoadOption(g_nppData._nppHandle, g_struOptions);
}

extern "C" __declspec(dllexport) const TCHAR *getName()
{
	return TEXT(PLUGIN_NAME);
}

extern "C" __declspec(dllexport) FuncItem *getFuncsArray(int *nbF)
{
	*nbF = s_nbFunc;

	// After npp get our menu, we check update.
	doInternetCheckUpdate();

	return s_funcItem;
}

extern "C" __declspec(dllexport) void beNotified(SCNotification *notifyCode)
{
	if (notifyCode->nmhdr.hwndFrom == g_nppData._nppHandle)
	{
		switch (notifyCode->nmhdr.code)
		{
		case NPPN_TBMODIFICATION:
			{
				toolbarIcons tbiJS;
				tbiJS.hToolbarBmp = s_hJsonViewBitmap;
				tbiJS.hToolbarIcon = NULL;
				SendMessage(g_nppData._nppHandle, NPPM_ADDTOOLBARICON, (WPARAM)s_funcItem[5]._cmdID, (LPARAM)&tbiJS);
			}
			break;
		}
	}
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

static HWND getCurrentScintillaHandle()
{
    int currentEdit;
    ::SendMessage(g_nppData._nppHandle, NPPM_GETCURRENTSCINTILLA, 0, (LPARAM)&currentEdit);
	return (currentEdit == 0) ? g_nppData._scintillaMainHandle : g_nppData._scintillaSecondHandle;
};

static void trim(char *source)
{
	size_t realStart = 0;
	size_t len = strlen(source);
	for (; realStart < len; ++realStart)
	{
		if (source[realStart] != ' ' &&
			source[realStart] != '\t' &&
			source[realStart] != '\r' &&
			source[realStart] != '\n')
			break;
	}

	size_t copyLen = len + 1;
#if defined (WIN32)
	strcpy_s(source, copyLen, source + realStart);
#else
	strncpy(source, source + realStart, copyLen);
#endif
}

static bool getScintillaEolCR(HWND hScintilla)
{
	int eolMode = (int)::SendMessage(hScintilla, SCI_GETEOLMODE, 0, 0);
	switch (eolMode)
	{
	case SC_EOL_CRLF:
		return true;
	case SC_EOL_CR:
	case SC_EOL_LF:
		return false;
	}

	return true;
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
	doInternetCheckUpdate();

	HWND hCurrScintilla = getCurrentScintillaHandle();

	size_t jsLen = ::SendMessage(hCurrScintilla, SCI_GETTEXTLENGTH, 0, 0);;
    if (jsLen == 0) 
		return;

	//::SendMessage(hCurrScintilla, SCI_SETSEL, 0, jsLen);

    unsigned char *pJS = new unsigned char[jsLen+1];
    
    ::SendMessage(hCurrScintilla, SCI_GETTEXT, jsLen + 1, (LPARAM)pJS);

	size_t jsMinLen = jsLen + 10; // seem to be something wrong, so add some empty places
	unsigned char *pJSMin = new unsigned char[jsMinLen];
	memset(pJSMin, 0, jsMinLen);

	try
	{
		bool _bPutCR = true;
		int _nPutCR = g_struOptions.nPutCR;
		switch (_nPutCR)
		{
		case EOL_AUTO:
			if (getScintillaEolCR(hCurrScintilla))
				_bPutCR = true;
			else
				_bPutCR = false;
			break;
		case EOL_CRLF:
			_bPutCR = true;
			break;
		case EOL_LF:
			_bPutCR = false;
			break;
		}

		JSMinCharArray jsmin(pJS, pJSMin, _bPutCR, g_struOptions.bKeepTopComt);
		jsmin.go();

		trim((char *)pJSMin);

		if(bNewFile)
		{
			// Open a new document
			::SendMessage(g_nppData._nppHandle, NPPM_MENUCOMMAND, 0, IDM_FILE_NEW);

			// ReGet the current scintilla
			hCurrScintilla = getCurrentScintillaHandle();

			::SendMessage(hCurrScintilla, SCI_SETTEXT, 0, (LPARAM)pJSMin);

			// Set file's language 
			::SendMessage(g_nppData._nppHandle, NPPM_MENUCOMMAND, 0, IDM_LANG_JS);
		}
		else
		{
			::SendMessage(hCurrScintilla, SCI_SETTEXT, 0, (LPARAM)pJSMin);
		}
		
	}
	catch(std::runtime_error ex)
	{
		::MessageBox(g_nppData._nppHandle, TEXT("ERROR"), TEXT("JSMin"), MB_OK);
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
	doInternetCheckUpdate();

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
			testChar = (char)::SendMessage(hCurrScintilla, SCI_GETCHARAT, selStart - 1, 0);
			if(testChar == '\r' || testChar == '\n')
				break;

			--selStart;
		}
		// 找行尾
		while(selEnd < jsLen)
		{
			testChar = (char)::SendMessage(hCurrScintilla, SCI_GETCHARAT, selEnd, 0);
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
		int _nChPerInd = g_struOptions.nChPerInd;
		if(g_struOptions.chIndent == '\t')
			_nChPerInd = 1;

		CR_PUT _eCRPut = PUT_CR;
		int _nPutCR = g_struOptions.nPutCR;
		switch (_nPutCR)
		{
		case EOL_AUTO:
			if (getScintillaEolCR(hCurrScintilla))
				_eCRPut = PUT_CR;
			else
				_eCRPut = NOT_PUT_CR;
			break;
		case EOL_CRLF:
			_eCRPut = PUT_CR;
			break;
		case EOL_LF:
			_eCRPut = NOT_PUT_CR;
			break;
		}

		FormatterOption formatterOption;
		formatterOption.chIndent = g_struOptions.chIndent;
		formatterOption.nChPerInd = _nChPerInd;
		formatterOption.eCRPut = _eCRPut;
		formatterOption.eBracNL = g_struOptions.bNLBracket ? 
									NEWLINE_BRAC : NO_NEWLINE_BRAC;
		formatterOption.eEmpytIndent = g_struOptions.bIndentInEmpty ? 
										INDENT_IN_EMPTYLINE : NO_INDENT_IN_EMPTYLINE;

		JSFormatString jsformat(pJS, &strJSFormat, formatterOption);
		if(bFormatSel)
			jsformat.SetInitIndent(initIndent);
		jsformat.Go();

		if(!bFormatSel)
		{
			::SendMessage(hCurrScintilla, SCI_SETTEXT, 0, (LPARAM)(strJSFormat.c_str()));
			::SendMessage(g_nppData._nppHandle, NPPM_MENUCOMMAND, 0, IDM_LANG_JS);

			// line starts from 0, lineFixed starts from 1
			size_t lineJSF = line + 1;
			// formattedLine starts from 0, formattedLineJSF starts from 1
			size_t formattedLineJSF = jsformat.GetFormattedLine(lineJSF);
			size_t formattedLine = formattedLineJSF - 1;

			const size_t bigLineJump = 10;
			::SendMessage(hCurrScintilla, SCI_GOTOLINE, formattedLine + bigLineJump, 0);
			::SendMessage(hCurrScintilla, SCI_GOTOLINE, formattedLine, 0);
		}
		else
		{
			// 清理多出来的换行
			if((strJSFormat.length() >= 2) && strJSFormat[strJSFormat.length() - 2] == '\r')
				strJSFormat = strJSFormat.substr(0, strJSFormat.length() - 2);
			else
				strJSFormat = strJSFormat.substr(0, strJSFormat.length() - 1);
			
			::SendMessage(hCurrScintilla, SCI_REPLACESEL, 0, (LPARAM)strJSFormat.c_str());
			::SendMessage(hCurrScintilla, SCI_SETCURRENTPOS, selStart, 0);
		}
	}
	catch(std::exception ex)
	{
		::MessageBox(g_nppData._nppHandle, TEXT("ERROR"), TEXT("JSFormat"), MB_OK);
	}

	delete[] pJS;
}

void jsonTree()
{
	doInternetCheckUpdate();

	s_jsonDialog.setParent(g_nppData._nppHandle);
	tTbData	data = {0};

	BOOL bForceDisplay = FALSE;

	if (!s_jsonDialog.isCreated())
	{
		s_jsonDialog.create(&data);

		// define the default docking behaviour
		data.uMask = DWS_DF_CONT_LEFT;

		data.pszModuleName = s_jsonDialog.getPluginFileName();
		data.pszName = TEXT("JSToolNpp JSON Viewer");

		// the dlgDlg should be the index of funcItem where the current function pointer is
		data.dlgID = 0;
		::SendMessage(g_nppData._nppHandle, NPPM_DMMREGASDCKDLG, 0, (LPARAM)&data);

		bForceDisplay = TRUE; // bug after created
	}

	if (bForceDisplay || !s_jsonDialog.isVisible())
	{
		s_jsonDialog.display(true);
		HWND hCurrScintilla = getCurrentScintillaHandle();
		s_jsonDialog.refreshTree(hCurrScintilla);
	}
	else
	{
		s_jsonDialog.display(false);
	}
}

void onToggleJsonTree(BOOL bVisible)
{
	::SendMessage(g_nppData._nppHandle, NPPM_SETMENUITEMCHECK, (WPARAM)s_funcItem[5]._cmdID, (LPARAM)bVisible);
}

void options()
{
	INT_PTR nRet = ::DialogBox(g_hInst, 
							MAKEINTRESOURCE(IDD_OPTIONSBOX),
							g_nppData._nppHandle, 
							(DLGPROC)dlgProcOptions);
}

/* This code was shamefully robbed from NppExec & PythonScript*/
HMENU getOwnMenu()
{
	if (s_funcItem && s_ownMenu == NULL)
	{
		HMENU hPluginMenu = (HMENU)::SendMessage(g_nppData._nppHandle, NPPM_GETMENUHANDLE, 0, 0);

		int iMenuItems = GetMenuItemCount(hPluginMenu);
		for (int i = 0; i < iMenuItems; ++i)
		{
			HMENU hSubMenu = ::GetSubMenu(hPluginMenu, i);
			TCHAR pszMenuString[256] = {0};
			::GetMenuString(hSubMenu, 0, pszMenuString, 255, MF_BYPOSITION);
			tstring tstrMenuString(pszMenuString);
			if (tstrMenuString == TEXT(STRING_JSMIN))
			{
				// this is our sub-menu
				s_ownMenu = hSubMenu;
				break;
			}
		}
	}

	return s_ownMenu;
}

static void changeUpdateMenuString(LPTSTR pszString)
{
	HMENU hMenuOwn = getOwnMenu();
	if (hMenuOwn != NULL)
	{
		MENUITEMINFO mii = { sizeof(MENUITEMINFO) };
		mii.cbSize = sizeof(MENUITEMINFO);
		mii.fMask = MIIM_STRING;
		mii.fType = MFT_STRING;
		mii.dwTypeData = pszString;
		::SetMenuItemInfo(hMenuOwn, 11, TRUE, &mii);
	}
}

static int readInternetString(LPCTSTR pszUrl, tstring *tstrResp)
{
	if (pszUrl == NULL || tstrResp == NULL)
		return -1;

	HINTERNET hInternet = NULL;
	hInternet = ::InternetOpen(TEXT("JSToolNpp"), NULL, NULL, NULL, NULL);
	if (hInternet == NULL)
		return -1;

	HINTERNET hConnect = NULL;
	hConnect = ::InternetOpenUrl(hInternet, pszUrl, NULL, 0, INTERNET_FLAG_DONT_CACHE, 0);
	if (hConnect == NULL)
	{
		::InternetCloseHandle(hInternet);
		return -1;
	}

	char buffer[1024] = {0};
	DWORD dwSizeOut = 0;

	do
	{
		if (!::InternetReadFile(hConnect, buffer, 1024, &dwSizeOut))
			break;

		if (dwSizeOut == 0)
			break;

		tstring tstrTmp = strtotstr(string(buffer));
		tstrResp->append(tstrTmp);
	} // do
	while (TRUE);

	::InternetCloseHandle(hConnect);
	::InternetCloseHandle(hInternet);

	return 0;
}

static void splitVersionToArray(const string& strVersion, int *versionArray)
{
	if (versionArray == NULL)
		return;

	size_t startIdx = 0;
	for (int i = 0; i < 4; ++i)
	{
		size_t findIdx = strVersion.find(".", startIdx);
		size_t substrLen = 0;
		if (findIdx != string::npos)
		{
			substrLen = findIdx - startIdx;
		}
		else
		{
			substrLen = strVersion.length() - startIdx;
		}
		
		string strSubver = strVersion.substr(startIdx, substrLen);
		versionArray[i] = atoi(strSubver.c_str());

		if (findIdx == string::npos)
			break;

		startIdx = findIdx + 1;
	}
}

static time_t getCurrentTimeSecond()
{
	time_t seconds;
	seconds = ::time(NULL);
	return seconds;
}

static int checkUpdateThread(void *param)
{
	s_updateThreadRunning = TRUE;

	tstring tstrJson;
	readInternetString(TEXT(UPDATE_FILE_URL), &tstrJson);

	s_foundNewVersion = FALSE;

	if (tstrJson != TEXT(""))
	{
		// We read something.
		string strJson = tstrtostr(tstrJson);

		JsonStringProc jsonProc(strJson);
		JsonValue jsonVal;
		jsonProc.Go(jsonVal);
		
		if (jsonVal.HasKey("CurrentVersion"))
		{
			string strCurVersion = jsonVal["CurrentVersion"].GetStrValue();
			int curVersionArray[4] = {0};
			splitVersionToArray(strCurVersion, curVersionArray);

			int localVersionArray[4] = {0};
			splitVersionToArray(string(VERSION_VALUE), localVersionArray);

			for (int i = 0; i < 4; ++i)
			{
				if (curVersionArray[i] < localVersionArray[i])
				{
					break;
				}
				if (curVersionArray[i] > localVersionArray[i])
				{
					s_foundNewVersion = TRUE;
					break;
				}
			}

			if (s_foundNewVersion)
			{
				changeUpdateMenuString(TEXT(STRING_NEW_VERSION));
			}
			else
			{
				changeUpdateMenuString(TEXT(STRING_CHECK_UPDATE));
			}

		}
	}

	s_lastUpdateCheckTime = getCurrentTimeSecond();

	s_updateThreadRunning = FALSE;

	return 0;
}

void doInternetCheckUpdate()
{
	if (g_struOptions.bDisableVersionCheck)
	{
		// User disable this.
		return;
	}

	time_t curTime = getCurrentTimeSecond();
	if (s_updateThreadRunning ||
		(!s_foundNewVersion &&
		(curTime - s_lastUpdateCheckTime) < 300) ||
		(s_foundNewVersion &&
		(curTime - s_lastUpdateCheckTime) < 3600))
	{
		// Do not check.
		return;
	}

	DWORD dwThreadID;
	HANDLE hThread = (HANDLE)_beginthreadex(NULL, 0, 
		(unsigned int (WINAPI *)(void *))checkUpdateThread, NULL, 
		0, (unsigned int *)&dwThreadID);

	if ((uintptr_t)hThread != -1)
	{
		::CloseHandle(hThread);
	}
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

void openProjectSite()
{
	ShellExecute(NULL, TEXT("open"), TEXT(PROJECT_SITE), NULL, NULL, SW_SHOW);
}

void openGitHub()
{
	ShellExecute(NULL, TEXT("open"), TEXT(GITHUB_PAGE), NULL, NULL, SW_SHOW);
}

void about()
{
	INT_PTR nRet = ::DialogBox(g_hInst, 
							MAKEINTRESOURCE(IDD_ABOUTBOX),
							g_nppData._nppHandle, 
							(DLGPROC)dlgProcAbout);
}
