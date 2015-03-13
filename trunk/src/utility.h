#ifndef _UTILITY_H_
#define _UTILITY_H_

#include <string>
#include "strhelper.h"

using namespace std;
using namespace sunjwbase;

struct StruOptions
{
	bool bPutCR; // 是否输出 \r\n
	char chIndent; // 缩进用的字符
	int nChPerInd; // 每个缩进使用几个字符
	bool bNLBracket; // { 之前是否换行
	bool bKeepTopComt; // 是否保留头部的注释
	bool bIndentInEmpty; // 是否保留空行中的缩进
};

const string keyPutCR("Put CR");
const string keyChIndent("Indent char");
const string keyChPerInd("Chars per indent");
const string keyNLBracket("New line before {");
const string keyKeepTopComt("Kepp top comment");
const string keyIndentInEmpty("Indent in empty");

tstring GetConfigFilePath(HWND nppHandle);

void loadOption(HWND nppHandle, StruOptions& struOptions);
void loadDefaultOption(StruOptions& struOptions);

void saveOption(HWND nppHandle, StruOptions struOptions);

#endif
