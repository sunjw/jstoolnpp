#ifndef _JSP_STREAM_H_
#define _JSP_STREAM_H_

#include <iostream>

#include "jsparser.h"

class JSParserStream: public JSParser
{
public:
	JSParserStream(std::istream& input)
		:JSParser(), in(input)
	{}

private:
	std::istream& in;

	virtual int GetChar();
	virtual void PutChar(int ch)
	{}
};

#endif
