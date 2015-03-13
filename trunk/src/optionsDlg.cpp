#include "resource.h"
#include "comDef.h"
#include "optionsDlg.h"
#include "utility.h"

BOOL CALLBACK dlgProcOptions(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam) 
{
	switch (message) 
	{
	case WM_INITDIALOG:
		// 初始化
		if(struOptions.bPutCR)
		{
			CheckRadioButton(hwnd, IDC_WINRADIO, IDC_UNIXRADIO, IDC_WINRADIO);
		}
		else
		{
			CheckRadioButton(hwnd, IDC_WINRADIO, IDC_UNIXRADIO, IDC_UNIXRADIO);
		}

		if(struOptions.bNLBracket)
			CheckDlgButton(hwnd, IDC_NEWLINECHECK, TRUE);
		else
			CheckDlgButton(hwnd, IDC_NEWLINECHECK, FALSE);

		if(struOptions.bKeepTopComt)
			CheckDlgButton(hwnd, IDC_KEEPCOMTCHECK, TRUE);
		else
			CheckDlgButton(hwnd, IDC_KEEPCOMTCHECK, FALSE);

		setIndent(hwnd, (struOptions.chIndent == ' ' ? TRUE : FALSE));

		if(struOptions.bIndentInEmpty)
			CheckDlgButton(hwnd, IDC_EMPTYINDENT, TRUE);
		else
			CheckDlgButton(hwnd, IDC_EMPTYINDENT, FALSE);

		return TRUE;
	case WM_COMMAND:
		switch (LOWORD(wParam))
		{
        case IDCLOSE:
		case IDCANCEL:
			// 重新读取配置
			loadOption(nppData._nppHandle, struOptions);
			::EndDialog(hwnd, 0);
			return TRUE;
		case IDOK:
			// 保存设置
			struOptions.bPutCR = IsDlgButtonChecked(hwnd, IDC_WINRADIO) ? true : false;
			struOptions.chIndent = IsDlgButtonChecked(hwnd, IDC_SPACECHECK) ? ' ' : '\t';
			struOptions.bKeepTopComt = IsDlgButtonChecked(hwnd, IDC_KEEPCOMTCHECK) ? true : false;
			struOptions.bIndentInEmpty = IsDlgButtonChecked(hwnd, IDC_EMPTYINDENT) ? true : false;
			TCHAR buffer[256];
			GetWindowText(GetDlgItem(hwnd, IDC_COUNTEDIT), buffer, 255);
			#if defined(UNICODE) || defined(_UNICODE)
			struOptions.nChPerInd = _wtoi(buffer);
			#else
			struOptions.nChPerInd = atoi(buffer);
			#endif

			saveOption(nppData._nppHandle, struOptions);

			// 重新读取配置
			loadOption(nppData._nppHandle, struOptions);

			::EndDialog(hwnd, 0);
			return TRUE;
		case IDC_STATIC_USE:
		case IDC_STATIC_SPACE:
			setIndent(hwnd, !IsDlgButtonChecked(hwnd, IDC_SPACECHECK));
			return TRUE;
		case IDC_SPACECHECK:
			setIndent(hwnd, IsDlgButtonChecked(hwnd, IDC_SPACECHECK));
			return TRUE;
		case IDC_NEWLINECHECK:
			struOptions.bNLBracket = (IsDlgButtonChecked(hwnd, IDC_NEWLINECHECK) == TRUE);
			return TRUE;
		}
		return FALSE;
	}
	return FALSE;
}

void setIndent(HWND hwnd, BOOL bSpace)
{
	TCHAR strCount[256];
	#if defined(UNICODE) || defined(_UNICODE)
	_itow(struOptions.nChPerInd, strCount, 10);
	#else
	_itoa(struOptions.nChPerInd, strCount, 10);
	#endif

	CheckDlgButton(hwnd, IDC_SPACECHECK, bSpace);
	SetWindowText(GetDlgItem(hwnd, IDC_COUNTEDIT), strCount);
	EnableWindow(GetDlgItem(hwnd, IDC_COUNTEDIT), bSpace);
}

