#include "jsformatString.h"

int JSFormatString::GetChar()
{
	if(getPos <= in.length())
		return in[getPos++];
	else
		return EOF;
}

void JSFormatString::PutChar(int ch)
{ 
	out->append(1, ch);
}
