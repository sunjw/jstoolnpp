#ifndef _JSFORMAT_GENERIC_IO_H_
#define _JSFORMAT_GENERIC_IO_H_

#include <string>
#include "jsformatter.h"
#include "realjsformatter.h"

using namespace std;

class JSFormatGenericIO: public RealJSFormatter
{
public:
	JSFormatGenericIO(void *ioContext,
						ReadCharFunc readCharFunc, 
						WriteCharFunc writeCharFunc,
						const FormatterOption& option):
		RealJSFormatter(option),
		_ioContext(ioContext),
		_readCharFunc(readCharFunc), _writeCharFunc(writeCharFunc)
	{}

private:
	void *_ioContext;
	ReadCharFunc _readCharFunc;
	WriteCharFunc _writeCharFunc;

	virtual int GetChar();
	virtual void PutChar(int ch);
};

#endif
