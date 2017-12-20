#include <cstdlib>
#include <cstdio>
#include "JSTokenDump.h"

using namespace std;

void JSTokenDump::Go()
{
	while (GetToken())
	{
		for (size_t i = 0; i < m_tokenA.code.length(); ++i)
			PutChar(m_tokenA.code[i]);
		PutChar('\n');
	}
}

int JSTokenDump::GetChar()
{
	int ret = in.get();
	if (ret == EOF)
		return 0;
	return ret;
}

void JSTokenDump::PutChar(int ch)
{
	out << static_cast<char>(ch);
}
