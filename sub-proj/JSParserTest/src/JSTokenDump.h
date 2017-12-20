#include <iostream>
#include "jsparser.h"

using namespace std;

class JSTokenDump: public JSParser
{
public:
	explicit JSTokenDump(istream& i, ostream& o):
	in(i), out(o)
	{}

	void Go();

private:
	virtual int GetChar();
	virtual void PutChar(int ch);

	istream& in;
	ostream& out;
};
