//this file a source file of JSMinNpp
//Copyright (C)2007 Don HO <donho@altern.org>
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

#include "PluginInterface.h"
#include "jsMinNpp.h"
#include "jsminCharArray.h"


const TCHAR PLUGIN_NAME[] = TEXT("JSMin");
const int nbFunc = 3;

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
			funcItem[0]._pFunc = jsMin;

			funcItem[1]._pFunc = NULL;
			funcItem[2]._pFunc = about;

			lstrcpy(funcItem[0]._itemName, TEXT("JSMin"));
			
			lstrcpy(funcItem[1]._itemName, TEXT("-SEPARATOR-"));

			lstrcpy(funcItem[2]._itemName, TEXT("About"));

			funcItem[0]._init2Check = false;
			funcItem[1]._init2Check = false;
			funcItem[2]._init2Check = false;

			// If you don't need the shortcut, you have to make it NULL
			funcItem[0]._pShKey = NULL;
			funcItem[1]._pShKey = NULL;
			funcItem[2]._pShKey = NULL;
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

HWND getCurrentScintillaHandle() {
    int currentEdit;
    ::SendMessage(nppData._nppHandle, NPPM_GETCURRENTSCINTILLA, 0, (LPARAM)&currentEdit);
	return (currentEdit == 0)?nppData._scintillaMainHandle:nppData._scintillaSecondHandle;
};

void fillZero(char* buffer, size_t length)
{
	for(size_t i = 0; i < length; ++i)
		buffer[i] = '\0';
}

void trim(char* source)
{
	size_t realStart = 0;
	size_t len = strlen(source);
	for(; realStart < len; ++realStart)
	{
		if(source[realStart] != ' ' &&
			source[realStart] != '\t' &&
			source[realStart] != '\r' &&
			source[realStart] != '\n')
			break;
	}

	strcpy(source, source + realStart);
}

int getChar(const char* source, size_t i)
{
	return source[i];
}

void put(char* dest, size_t i,int _Ch)
{
	dest[i] = _Ch;
}

void jsMin()
{
	HWND hCurrScintilla = getCurrentScintillaHandle();

 //   size_t start = 0; //::SendMessage(hCurrScintilla, SCI_GETSELECTIONSTART, 0, 0);
	//size_t textLength = ::SendMessage(hCurrScintilla, SCI_GETTEXTLENGTH, 0, 0);
	//if (end < start)
	//{
	//	size_t tmp = start;
	//	start = end;
	//	end = tmp;
	//}

	size_t jsLen = ::SendMessage(hCurrScintilla, SCI_GETTEXTLENGTH, 0, 0);;
    if (jsLen == 0) 
		return;

	::SendMessage(hCurrScintilla, SCI_SETSEL, 0, jsLen);

    char * pJS = new char[jsLen+1];
    
    ::SendMessage(hCurrScintilla, SCI_GETSELTEXT, 0, (LPARAM)pJS);

	size_t jsMinLen = jsLen;
	char * pJSMin = new char[jsMinLen+1];

	fillZero(pJSMin, jsMinLen+1);

	try
	{
		JSMinCharArray jsmin(pJS, pJSMin);
		jsmin.go();

		trim(pJSMin);

		::SendMessage(hCurrScintilla, SCI_SETTEXT, 0, (LPARAM)pJSMin);
		//::SendMessage(hCurrScintilla, SCI_SETSEL, start, start+strlen(pJSMin));
	}
	catch(std::runtime_error ex)
	{
		::MessageBox(nppData._nppHandle, TEXT("ERROR"), TEXT("JSMin"), MB_OK);
		//cout << "Error: " << ex.what() << endl;
	}

	/*strcpy(pJSMin, pJS);
	::SendMessage(hCurrScintilla, SCI_REPLACESEL, 0, (LPARAM)pJSMin);
	::SendMessage(hCurrScintilla, SCI_SETSEL, start, start+strlen(pJSMin));*/

	//asciiToBase64(pBase64Text, pAsciiText, asciiTextLen);
	
	//char *pBase64Text2Display = pBase64Text;
	//size_t nbEOL = b64Len/64; //nb 0x0A
	//pBase64Text2Display = new char[b64Len+nbEOL+1];

	//size_t m = 0, n = 0;
	//for ( ; m < b64Len ; m++)
	//{
	//	pBase64Text2Display[n++] = pBase64Text[m];

	//	if ((m+1)%64 == 0)
	//		pBase64Text2Display[n++] = 0x0A;
	//}
	//pBase64Text2Display[n] = '\0';

	delete [] pJS;
	delete [] pJSMin;

	//delete [] pBase64Text2Display;
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
