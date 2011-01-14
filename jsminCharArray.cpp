#include "jsminCharArray.h"

int JSMinCharArray::getChar()
{
	if(getPos <= strlen(reinterpret_cast<const char*>(in)))
		return in[getPos++];
	else
		return EOF;
}

void JSMinCharArray::put(int _Ch)
{
	if(_Ch == '\n')
		out[putPos++] = '\r';
	out[putPos++] = _Ch;
}
