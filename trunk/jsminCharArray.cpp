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
	out[putPos++] = _Ch;
}
