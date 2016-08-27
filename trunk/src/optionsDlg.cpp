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
		if(g_struOptions.bPutCR)
		{
			CheckRadioButton(hwnd, IDC_WINRADIO, IDC_UNIXRADIO, IDC_WINRADIO);
		}
		else
		{
			CheckRadioButton(hwnd, IDC_WINRADIO, IDC_UNIXRADIO, IDC_UNIXRADIO);
		}

		if(g_struOptions.bNLBracket)
			CheckDlgButton(hwnd, IDC_NEWLINECHECK, TRUE);
		else
			CheckDlgButton(hwnd, IDC_NEWLINECHECK, FALSE);

		if(g_struOptions.bKeepTopComt)
			CheckDlgButton(hwnd, IDC_KEEPCOMTCHECK, TRUE);
		else
			CheckDlgButton(hwnd, IDC_KEEPCOMTCHECK, FALSE);

		setIndent(hwnd, (g_struOptions.chIndent == ' ' ? TRUE : FALSE));

		if(g_struOptions.bIndentInEmpty)
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
			LoadOption(g_nppData._nppHandle, g_struOptions);
			::EndDialog(hwnd, 0);
			return TRUE;
		case IDOK:
			// 保存设置
			g_struOptions.bPutCR = IsDlgButtonChecked(hwnd, IDC_WINRADIO) ? true : false;
			g_struOptions.chIndent = IsDlgButtonChecked(hwnd, IDC_SPACECHECK) ? ' ' : '\t';
			g_struOptions.bKeepTopComt = IsDlgButtonChecked(hwnd, IDC_KEEPCOMTCHECK) ? true : false;
			g_struOptions.bIndentInEmpty = IsDlgButtonChecked(hwnd, IDC_EMPTYINDENT) ? true : false;
			TCHAR buffer[256];
			GetWindowText(GetDlgItem(hwnd, IDC_COUNTEDIT), buffer, 255);
			#if defined(UNICODE) || defined(_UNICODE)
			g_struOptions.nChPerInd = _wtoi(buffer);
			#else
			g_struOptions.nChPerInd = atoi(buffer);
			#endif

			SaveOption(g_nppData._nppHandle, g_struOptions);

			// 重新读取配置
			LoadOption(g_nppData._nppHandle, g_struOptions);

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
			g_struOptions.bNLBracket = (IsDlgButtonChecked(hwnd, IDC_NEWLINECHECK) == TRUE);
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
	_itow(g_struOptions.nChPerInd, strCount, 10);
	#else
	_itoa(g_struOptions.nChPerInd, strCount, 10);
	#endif

	CheckDlgButton(hwnd, IDC_SPACECHECK, bSpace);
	SetWindowText(GetDlgItem(hwnd, IDC_COUNTEDIT), strCount);
	EnableWindow(GetDlgItem(hwnd, IDC_COUNTEDIT), bSpace);
}

