#include "stdafx.h"

#include <cstdlib>
#include <cstdio>
#include <iostream>

#include "jsfStream.h"

using namespace std;

int JSFormatterStream::GetChar()
{
	return in.get();
}

void JSFormatterStream::PutChar(int ch)
{
	out << static_cast<char>(ch);
}
