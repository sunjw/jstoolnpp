#ifndef _JSMINCHARARRAY_H_
#define _JSMINCHARARRAY_H_

#include <iostream>

#include "jsmin.h"

class JSMinCharArray: public JSMin
{
public:
	JSMinCharArray(const unsigned char* input, unsigned char* output)
		:in(input), out(output), getPos(0), putPos(0)
	{}

private:
	const unsigned char* in;
	unsigned char* out;

	size_t getPos;
	size_t putPos;

	virtual int getChar();
	virtual void put(int _Ch);
};

#endif
