#ifndef _JSP_STREAM_H_
#define _JSP_STREAM_H_

#include <iostream>

#include "jsparser.h"

class JSParserStream: public JSParser
{
public:
	JSParserStream(std::istream& input, std::ostream& output)
		:JSParser(), in(input), out(output)
	{}

private:
	std::istream& in;
	std::ostream& out;

	virtual int GetChar();
	virtual void PutChar(int ch);
};

#endif
