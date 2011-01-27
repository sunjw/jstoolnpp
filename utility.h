#ifndef _UTILITY_H_
#define _UTILITY_H_

#include <string>

using namespace std;

#if defined(UNICODE) || defined(_UNICODE)
typedef wstring tstring;
#else
typedef string tstring;
#endif

const string keyPutCR("Put CR");
const string keyChIndent("Indent char");
const string keyChPerInd("Chars per indent");

tstring GetConfigFilePath(HWND nppHandle);

void loadOption(HWND nppHandle, bool &bPutCR, char &chIndent, int &nChPerInd);
void loadDefaultOption(bool &bPutCR, char &chIndent, int &nChPerInd);

void saveOption(HWND nppHandle, bool bPutCR, char chIndent, int nChPerInd);

#endif
