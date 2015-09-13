#ifndef _JSMINSTREAM_H_
#define _JSMINSTREAM_H_

#include <iostream>

#include "realjsformatter.h"

class JSFormatterStream: public RealJSFormatter
{
public:
	JSFormatterStream(std::istream& input, std::ostream& output):
		RealJSFormatter(RealJSFormatter::FormatterOption(
						'\t', 1, 
						RealJSFormatter::SKIP_READ_CR, 
						RealJSFormatter::NOT_PUT_CR, 
						RealJSFormatter::NO_NEWLINE_BRAC, 
						RealJSFormatter::NO_INDENT_IN_EMPTYLINE)), 
		in(input), out(output)
	{}
	
	JSFormatterStream(std::istream& input, std::ostream& output,
						const RealJSFormatter::FormatterOption& option):
		RealJSFormatter(RealJSFormatter::FormatterOption(
						option.chIndent, 
						option.nChPerInd, 
						RealJSFormatter::SKIP_READ_CR, 
						option.eCRPut, 
						option.eBracNL, 
						option.eEmpytIndent)), 
		in(input), out(output)
	{}

private:
	std::istream& in;
	std::ostream& out;

	virtual int GetChar();
	virtual void PutChar(int ch);
};

#endif
