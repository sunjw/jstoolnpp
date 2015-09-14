#include <cstdlib>
#include <cstdio>
#include <iostream>

#include "jsfGenericIO.h"

using namespace std;

int JSFormatGenericIO::GetChar()
{
	return _readCharFunc(_ioContext);
}

void JSFormatGenericIO::PutChar(int ch)
{
	_writeCharFunc(_ioContext, ch);
}
