#ifndef _OPTIONS_DLG_H_
#define _OPTIONS_DLG_H_
#include "PluginInterface.h"
#include "menuCmdID.h"

extern bool bPutCR;
extern char chIndent;
extern int nChPerInd;
extern NppData nppData;

BOOL CALLBACK dlgProcOptions(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam);

void setIndent(HWND hwnd, BOOL bSpace);

#endif
