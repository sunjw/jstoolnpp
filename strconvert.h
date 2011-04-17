#ifndef _STRCONVERT_H_
#define _STRCONVERT_H_
#include <string>

std::string wstrtostrutf8(const std::wstring &wstr);
std::wstring strtowstrutf8(const std::string &str);
std::string wstrtostr(const std::wstring &wstr);
std::wstring strtowstr(const std::string &str);

#endif
