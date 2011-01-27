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
		if(bPutCR)
		{
			CheckRadioButton(hwnd, IDC_WINRADIO, IDC_UNIXRADIO, IDC_WINRADIO);
		}
		else
		{
			CheckRadioButton(hwnd, IDC_WINRADIO, IDC_UNIXRADIO, IDC_UNIXRADIO);
		}

		setIndent(hwnd, (chIndent == ' ' ? TRUE : FALSE));

		return TRUE;
	case WM_COMMAND:
		switch (LOWORD(wParam))
		{
        case IDCLOSE:
		case IDCANCEL:
			::EndDialog(hwnd, 0);
			return TRUE;
		case IDOK:
			// 保存设置
			bPutCR = IsDlgButtonChecked(hwnd, IDC_WINRADIO) ? true : false;
			chIndent = IsDlgButtonChecked(hwnd, IDC_SPACECHECK) ? ' ' : '\t';
			TCHAR buffer[256];
			GetWindowText(GetDlgItem(hwnd, IDC_COUNTEDIT), buffer, 255);
			#if defined(UNICODE) || defined(_UNICODE)
			nChPerInd = _wtoi(buffer);
			#else
			nChPerInd = _atoi(buffer);
			#endif

			saveOption(nppData._nppHandle, bPutCR, chIndent, nChPerInd);

			// 重新读取配置
			loadOption(nppData._nppHandle, bPutCR, chIndent, nChPerInd);

			::EndDialog(hwnd, 0);
			return TRUE;
		case IDC_SPACECHECK:
			setIndent(hwnd, IsDlgButtonChecked(hwnd, IDC_SPACECHECK));
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
	_itow(nChPerInd, strCount, 10);
	#else
	_itoa(nChPerInd, strCount, 10);
	#endif

	CheckDlgButton(hwnd, IDC_SPACECHECK, bSpace);
	SetWindowText(GetDlgItem(hwnd, IDC_COUNTEDIT), strCount);
	EnableWindow(GetDlgItem(hwnd, IDC_COUNTEDIT), bSpace);
}

