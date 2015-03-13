#include <cstdlib>
#include <cstdio>
#include <iostream>

#include "jsfStream.h"

using namespace std;

int JSFormatterStream::GetChar()
{
	int ret = in.get();
	if(ret == EOF)
		return 0;
	return ret;
}

void JSFormatterStream::PutChar(int ch)
{
	out << static_cast<char>(ch);
}
