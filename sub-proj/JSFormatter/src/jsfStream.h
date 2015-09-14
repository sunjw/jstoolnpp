#ifndef _JSMINSTREAM_H_
#define _JSMINSTREAM_H_

#include <iostream>

#include "realjsformatter.h"

class JSFormatterStream: public RealJSFormatter
{
public:
	JSFormatterStream(std::istream& input, std::ostream& output):
		RealJSFormatter(FormatterOption(
						'\t', 
						1, 
						SKIP_READ_CR, 
						NOT_PUT_CR, 
						NO_NEWLINE_BRAC, 
						NO_INDENT_IN_EMPTYLINE)), 
		in(input), out(output)
	{}
	
	JSFormatterStream(std::istream& input, std::ostream& output,
						const FormatterOption& option):
		RealJSFormatter(FormatterOption(
						option.chIndent, 
						option.nChPerInd, 
						SKIP_READ_CR, 
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
