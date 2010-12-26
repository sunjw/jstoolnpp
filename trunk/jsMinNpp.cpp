//this file a source file of JSMinNpp
//Copyright (C)2007 Don HO <donho@altern.org>
//Copyright (C)2010 Sun Junwen
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

#include "PluginInterface.h"
#include "menuCmdID.h"
#include "jsMinNpp.h"
#include "jsminCharArray.h"
#include "jsformatString.h"

const TCHAR PLUGIN_NAME[] = TEXT("JSMin");
const int nbFunc = 6;

HINSTANCE _hInst;
NppData nppData;
FuncItem funcItem[nbFunc];

BOOL APIENTRY DllMain( HANDLE hModule, 
                       DWORD  reasonForCall, 
                       LPVOID lpReserved )
{
	switch (reasonForCall)
	{
		case DLL_PROCESS_ATTACH:
		{
			_hInst = (HINSTANCE)hModule;
			funcItem[0]._pFunc = jsMinCurrent;
			funcItem[1]._pFunc = jsMinNew;
			funcItem[2]._pFunc = NULL;

			funcItem[3]._pFunc = jsFormat;
			funcItem[4]._pFunc = NULL;

			funcItem[5]._pFunc = about;

			lstrcpy(funcItem[0]._itemName, TEXT("JSMin"));
			lstrcpy(funcItem[1]._itemName, TEXT("JSMin (In new file)"));
			lstrcpy(funcItem[2]._itemName, TEXT("-SEPARATOR-"));

			lstrcpy(funcItem[3]._itemName, TEXT("JSFormat"));
			lstrcpy(funcItem[4]._itemName, TEXT("-SEPARATOR-"));

			lstrcpy(funcItem[5]._itemName, TEXT("About..."));

			for(int i = 0; i < nbFunc; ++i)
			{
				funcItem[i]._init2Check = false;
				// If you don't need the shortcut, you have to make it NULL
				funcItem[i]._pShKey = NULL;
			}

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
}

extern "C" __declspec(dllexport) const TCHAR * getName()
{
	return PLUGIN_NAME;
}

extern "C" __declspec(dllexport) FuncItem * getFuncsArray(int *nbF)
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

BOOL CALLBACK dlgProc(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam) 
{
	switch (message) 
	{
		case WM_COMMAND:
			switch (LOWORD(wParam))
            {
                case IDCLOSE :
			    {
					::EndDialog(hwnd, 0);
					return  TRUE;
				}
			}
			return FALSE;
	}
	return FALSE;
}

HWND getCurrentScintillaHandle() {
    int currentEdit;
    ::SendMessage(nppData._nppHandle, NPPM_GETCURRENTSCINTILLA, 0, (LPARAM)&currentEdit);
	return (currentEdit == 0)?nppData._scintillaMainHandle:nppData._scintillaSecondHandle;
};

void fillZero(unsigned char* buffer, size_t length)
{
	for(size_t i = 0; i < length; ++i)
		buffer[i] = '\0';
}

void trim(unsigned char* source)
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

    unsigned char * pJS = new unsigned char[jsLen+1];
    
    ::SendMessage(hCurrScintilla, SCI_GETTEXT, jsLen + 1, (LPARAM)pJS);

	size_t jsMinLen = jsLen + 1; // seem to be something wrong, so add 1
	unsigned char * pJSMin = new unsigned char[jsMinLen+1];

	fillZero(pJSMin, jsMinLen + 1);

	try
	{
		JSMinCharArray jsmin(pJS, pJSMin);
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

	size_t jsLen = ::SendMessage(hCurrScintilla, SCI_GETTEXTLENGTH, 0, 0);;
    if (jsLen == 0) 
		return;

    char * pJS = new char[jsLen+1];
    
    ::SendMessage(hCurrScintilla, SCI_GETTEXT, jsLen + 1, (LPARAM)pJS);

	size_t jsMinLen = jsLen + 1; // seem to be something wrong, so add 1
	std::string strJSFormat;

	int currentPos = ::SendMessage(hCurrScintilla, SCI_GETCURRENTPOS, 0, 0);
	int line = ::SendMessage(hCurrScintilla, SCI_LINEFROMPOSITION, currentPos, 0);

	//fillZero(pJSMin, jsMinLen + 1);

	try
	{
		JSFormatString jsformat(pJS, &strJSFormat);
		jsformat.Go();

		//trim(pJSMin);

		::SendMessage(hCurrScintilla, SCI_SETTEXT, 0, (LPARAM)(strJSFormat.c_str()));
		::SendMessage(nppData._nppHandle, NPPM_MENUCOMMAND, 0, IDM_LANG_JS);

		::SendMessage(hCurrScintilla, SCI_GOTOLINE, line, 0);
	}
	catch(std::runtime_error ex)
	{
		::MessageBox(nppData._nppHandle, TEXT("ERROR"), TEXT("JSFormat"), MB_OK);
		//cout << "Error: " << ex.what() << endl;
	}

	/*strcpy(pJSMin, pJS);
	::SendMessage(hCurrScintilla, SCI_REPLACESEL, 0, (LPARAM)pJSMin);
	::SendMessage(hCurrScintilla, SCI_SETSEL, start, start+strlen(pJSMin));*/

	delete [] pJS;
}

void about()
{
	HWND hSelf = ::CreateDialogParam(_hInst, MAKEINTRESOURCE(IDD_ABOUTBOX), nppData._nppHandle, (DLGPROC)dlgProc, (LPARAM)NULL);
		    
	// Go to center
	RECT rc;
	::GetClientRect(nppData._nppHandle, &rc);
	POINT center;
	int w = rc.right - rc.left;
	int h = rc.bottom - rc.top;
	center.x = rc.left + w/2;
	center.y = rc.top + h/2;
	::ClientToScreen(nppData._nppHandle, &center);

	RECT dlgRect;
	::GetClientRect(hSelf, &dlgRect);
	int x = center.x - (dlgRect.right - dlgRect.left)/2;
	int y = center.y - (dlgRect.bottom - dlgRect.top)/2;

	::SetWindowPos(hSelf, HWND_TOP, x, y, (dlgRect.right - dlgRect.left), (dlgRect.bottom - dlgRect.top), SWP_SHOWWINDOW);
}
