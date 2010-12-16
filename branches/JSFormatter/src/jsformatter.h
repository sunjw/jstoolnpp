#ifndef _JSFORMATTER_H_
#define _JSFORMATTER_H_
#include <string>
#include <stack>

using namespace std;

typedef stack<char> CharStack;

class JSFormatter
{
public:
	JSFormatter():
		theLookahead(EOF), 
		bComment(false), 
		bReadyComment(false),
		bDoubleOper(false),
		bNewLine(false)
	{}
	void go();

private:
	int theA;
	int theB;
	int theLookahead;
	string theComment;
	bool bComment;
	bool bReadyComment;
	bool bDoubleOper;
	CharStack blockStack;
	bool bNewLine;
	
	int isAlphanum(int c);
	int get();
	void put(int _Ch, bool _bNoProcess = false);
	void putComment();
	void putNewLine();
	virtual int getChar() = 0;
	virtual void putChar(int _Ch) = 0;
	int peek();
	int next();
	void action(int d);
};

#endif


