#ifndef _JSFORMAT_STRING_WRITE_ONCE_H_
#define _JSFORMAT_STRING_WRITE_ONCE_H_

#include <string.h>
#include <string>

#include "jsformatter.h"
#include "realjsformatter.h"

class JSFormatStringWriteOnce: public RealJSFormatter
{
public:
	JSFormatStringWriteOnce(void *ioContext,
						const char *inputString, 
						WriteStringOnceFunc writeStringFunc,
						const FormatterOption& option):
		RealJSFormatter(option), _ioContext(ioContext), 
		_inputString(inputString), _inputLen(0), _inputIdx(0),
		_writeStringFunc(writeStringFunc)
	{ _inputLen = strlen(_inputString); }

	virtual ~JSFormatStringWriteOnce()
	{}

	virtual void Go();

private:
	void *_ioContext;

	const char *_inputString;
	size_t _inputLen;
	size_t _inputIdx;

	std::string _outputString;
	WriteStringOnceFunc _writeStringFunc;

	virtual int GetChar();
	virtual void PutChar(int ch);
};

#endif
