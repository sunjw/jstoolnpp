#ifndef _JSMINSTREAM_H_
#define _JSMINSTREAM_H_

#include <iostream>

#include "realjsformatter.h"

class JSFormatterStream: public RealJSFormatter
{
public:
	JSFormatterStream(std::istream& input, std::ostream& output)
		:in(input), out(output)
	{}

private:
	std::istream& in;
	std::ostream& out;

	virtual int GetChar();
	virtual void PutChar(int ch);
};

#endif
