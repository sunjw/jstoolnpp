#include "jsminCharArray.h"

int JSMinCharArray::getChar()
{
	if(getPos <= strlen(in))
		return in[getPos++];
	else
		return EOF;
}

void JSMinCharArray::put(int _Ch)
{
	out[putPos++] = _Ch;
}
