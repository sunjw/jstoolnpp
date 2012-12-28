#include "resource.h"
#include "comDef.h"
#include "aboutDlg.h"

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
					return TRUE;
				}
				case IDC_PROPAGE:
					projectSite();
					break;
			}
			return FALSE;
	}
	return FALSE;
}

void projectSite()
{
	ShellExecute(NULL, TEXT("open"), TEXT(PROJECT_SITE), NULL, NULL, SW_SHOW);
}
