#include "resource.h"
#include "comDef.h"
#include "aboutDlg.h"

void projectSite()
{
	ShellExecute(NULL, L"open", TEXT(PROJECT_SITE), NULL, NULL, SW_SHOW);
}

BOOL CALLBACK dlgProcAbout(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam) 
{
	switch (message) 
	{
		case WM_COMMAND:
			switch (LOWORD(wParam))
            {
                case IDCLOSE:
				case IDCANCEL:
			    {
					::EndDialog(hwnd, 0);
					return  TRUE;
				}
				case IDC_PROPAGE:
					projectSite();
					break;
			}
			return FALSE;
	}
	return FALSE;
}
