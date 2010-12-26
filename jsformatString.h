#ifndef _JSFORMATSTRING_H_
#define _JSFORMATSTRING_H_

#include <string>

#include "realjsformatter.h"

using namespace std;

class JSFormatString: public RealJSFormatter
{
public:
	JSFormatString(const char* input, string* output)
		:in(), out(output), getPos(0), putPos(0)
	{
		in.append(input);
	}

private:
	string in;
	string* out;

	size_t getPos;
	size_t putPos;

	virtual int GetChar();
	virtual void PutChar(int ch);
};

#endif
