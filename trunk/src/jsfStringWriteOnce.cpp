#include "jsfStringWriteOnce.h"
#include <string>

using namespace std;

void JSFormatStringWriteOnce::Go()
{
	RealJSFormatter::Go();
	_writeStringFunc(_ioContext, _outputString.c_str());
}

int JSFormatStringWriteOnce::GetChar()
{
	if (_inputIdx <= _inputLen)
		return _inputString[_inputIdx++];
	else
		return 0;
}

void JSFormatStringWriteOnce::PutChar(int ch)
{
	_outputString.append(1, ch);
}
