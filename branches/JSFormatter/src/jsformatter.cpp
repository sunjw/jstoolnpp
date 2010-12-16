/* jsformatter.cpp
   2010-12-11

Copyright (c) 2002 Douglas Crockford  (www.crockford.com)
Copyright (c) 2010 SUN Junwen

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

The Software shall be used for Good, not Evil.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
#include <stdexcept> 

#include "jsformatter.h"

using namespace std;

/* isAlphanum -- return true if the character is a letter, digit, underscore,
        dollar sign, or non-ASCII character.
*/

int JSFormatter::isAlphanum(int c)
{
    return ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') ||
        (c >= 'A' && c <= 'Z') || c == '_' || c == '$' || c == '\\' ||
        c > 126);
}


/* get -- return the next character from stdin. Watch out for lookahead. If
        the character is a control character, translate it to a space or
        linefeed.
*/

int JSFormatter::get()
{
    int c = theLookahead;
    theLookahead = EOF;
    if (c == EOF) 
	{
        c = getChar();
    }
    if (c >= ' ' || c == '\n' || c == EOF) 
	{
        return c;
    }
    if (c == '\r') 
	{
        return '\n';
    }
    return ' ';
}

void JSFormatter::put(int _Ch, bool _bNoProcess)
{
	if(!_bNoProcess)
	{
		switch(_Ch)
		{
		case ':':
		case '?':
			put(' ', true);
			put(_Ch, true);
			put(' ', true);
			break;
		case '+': // ++, +=
		case '-': // --, -=
		case '*': // *=
		case '/': // /=
		case '<': // <=
		case '>': // >=
		case '=': // ==
		case '&': // &&, &=
		case '|': // ||, |=
			if(theB == theA || theB == '=')
			{
				put(' ', true);
				put(_Ch, true);
				bDoubleOper = true;
			}
			else if(bDoubleOper)
			{
				put(_Ch, true);
				put(' ', true);
				bDoubleOper = false;
			}
			else
			{
				put(' ', true);
				put(_Ch, true);
				put(' ', true);
			}
			break;
		case '{':
			blockStack.push('{');
			put(' ', true);
			put(_Ch, true);
			put('\n');
			break;
		case '}':
			if(blockStack.top() == '{')
			{
				blockStack.pop();
				//putChar('\');
			}
			//putChar('\n');
			put(_Ch, true);
			put('\n');
			break;
		case ',':
			if(bNewLine)
			{
				bNewLine = false;
				put(_Ch, true);
				put(' ', true);
				put('\n');
			}
			else
			{
				put(_Ch, true);
				put(' ', true);
			}
			break;
		case ';':
			if(bNewLine)
				bNewLine = false;
			put(_Ch, true);
			if(blockStack.size() == 0 || blockStack.top() == '{')
				put('\n');
			break;
		case '(':
			blockStack.push('(');
			put(_Ch, true);
			break;
		case ')':
			if(blockStack.top() == '(')
				blockStack.pop();
			put(_Ch, true);
			break;
		case '[':
			blockStack.push('[');
			put(_Ch, true);
			break;
		case ']':
			if(blockStack.top() == ']')
				blockStack.pop();
			put(_Ch, true);
			break;
		case '\n':
			putNewLine();
			break;
		default:
			put(_Ch, true);
		}
	}
	else
	{
		switch(_Ch)
		{
		case '\n':
			putNewLine();
			break;
		default:
			if(bNewLine)
			{
				putChar('\n');
				size_t i = 0;
				size_t blocks = blockStack.size();
				for(; i < blocks; ++i)
					putChar('\t');
				bNewLine = false;
			}
			putChar(_Ch); // here, really put char out.
		}
	}
}

void JSFormatter::putComment()
{
	if(bComment && bReadyComment)
	{
		size_t i = 0;
		size_t length = theComment.length();
		for(; i != length; i++)
			put(theComment[i], true);
		bComment = false;
		bReadyComment = false;
	}
}

void JSFormatter::putNewLine()
{
	bNewLine = true; // Really do it later
	/*putChar('\n');
	size_t i = 0;
	size_t blocks = blockStack.size();
	for(; i < blocks; ++i)
		putChar('\t');*/
}

/* peek -- get the next character without getting it.
*/

int JSFormatter::peek()
{
    theLookahead = get();
    return theLookahead;
}


/* next -- get the next character, excluding comments. peek() is used to see
        if a '/' is followed by a '/' or '*'.
*/

int JSFormatter::next()
{
    int c = get();
    if  (c == '/') 
	{
        switch (peek()) 
		{
        case '/': // //×¢ÊÍ
			theComment = string("");
			bComment = true;
			theComment += '/';
            for (;;) 
			{
                c = get();
				theComment += c;
                if (c <= '\n') 
				{
                    return c;
                }
            }
        case '*': // /*×¢ÊÍ
			theComment = string("");
			bComment = true;
			theComment += '/';
			theComment += '*';
            c = get();
            for (;;) 
			{
				c = get();
                switch (c) 
				{
                case '*':
                    if (peek() == '/') 
					{
                        get();
						theComment += '*';
						theComment += '/';
						theComment += '\n';
                        return ' ';
                    }
					theComment += c;
                    break;
                case EOF:
					throw runtime_error("Error: JSFormatter Unterminated comment.");
                    /*fprintf(stderr, "Error: JSFormatter Unterminated comment.\n");
                    exit(1);*/
					break;
				default:
					theComment += c;
                }
            }
        default:
            return c;
        }
    }
    return c;
}


/* action -- do something! What you do is determined by the argument:
        1   Output A. Copy B to A. Get the next B.
        2   Copy B to A. Get the next B. (Delete A).
        3   Get the next B. (Delete B).
   action treats a string as a single character. Wow!
   action recognizes a regular expression if it is preceded by ( or , or =.
*/

void JSFormatter::action(int d)
{
    switch (d) 
	{
    case 1:
        put(theA);
		putComment();
    case 2:
        theA = theB;
		bReadyComment = true;
        if (theA == '\'' || theA == '"') 
		{
            for (;;) 
			{
                put(theA, true);
                theA = get();
                if (theA == theB) 
				{
                    break;
                }
                if (theA == '\\') 
				{
                    put(theA, true);
                    theA = get();
                }
                if (theA == EOF) 
				{
					throw runtime_error("Error: JSFormatter Unterminated comment.");
                    /*fprintf(stderr, "Error: JSFormatter unterminated string literal.");
                    exit(1);*/
                }
            }
        }
		if(theA == '/')
		{
			int a = 0;
		}
    case 3:
		//putComment();
        theB = next();
        if (theB == '/' && (theA == '(' || theA == ',' || theA == '=' ||
                            theA == ':' || theA == '[' || theA == '!' ||
                            theA == '&' || theA == '|' || theA == '?' ||
                            theA == '{' || theA == '}' || theA == ';' ||
                            theA == '\n')) 
		{
			// ÕýÔò
            put(theA);
            put(theB);
            for (;;) 
			{
                theA = get();
                if (theA == '/') 
				{
                    break;
                }
                if (theA =='\\') 
				{
                    put(theA);
                    theA = get();
                }
                if (theA == EOF) 
				{
					throw runtime_error("Error: JSFormatter Unterminated comment.");
                    /*fprintf(stderr, "Error: JSFormatter unterminated Regular Expression literal.\n");
                    exit(1);*/
                }
                put(theA);
            }
            theB = next();
        }
    }
}


/* go -- Copy the input to the output, deleting the characters which are
        insignificant to JavaScript. Comments will be removed. Tabs will be
        replaced with spaces. Carriage returns will be replaced with linefeeds.
        Most spaces and linefeeds will be removed.
*/

void JSFormatter::go()
{
    theA = '\n';
    action(3);
    while (theA != EOF) 
	{
        switch (theA) 
		{
        case ' ':
            if (isAlphanum(theB)) 
			{
                action(1);
            } else 
			{
                action(2);
            }
            break;
        case '\n':
            switch (theB) 
			{
            case '{':
            case '[':
            case '(':
            case '+':
            case '-':
                action(1);
                break;
            case ' ':
                action(3);
                break;
            default:
                if (isAlphanum(theB)) 
				{
                    action(1);
                } else 
				{
                    action(2);
                }
            }
            break;
        default:
            switch (theB) 
			{
            case ' ':
                if (isAlphanum(theA)) 
				{
                    action(1);
                    break;
                }
                action(3);
                break;
            case '\n':
                switch (theA) 
				{
                case '}':
                case ']':
                case ')':
                case '+':
                case '-':
                case '"':
                case '\'':
                    action(1);
                    break;
                default:
                    if (isAlphanum(theA)) 
					{
                        action(1);
                    } else 
					{
                        action(3);
                    }
                }
                break;
            default:
                action(1);
                break;
            }
        }
    }
}


/* main -- Output any command line arguments as comments
        and then minify the input.
*/
//extern int
//main(int argc, char* argv[])
//{
//    int i;
//    for (i = 1; i < argc; i += 1) {
//        fprintf(stdout, "// %s\n", argv[i]);
//    }
//    jsmin();
//    return 0;
//}
