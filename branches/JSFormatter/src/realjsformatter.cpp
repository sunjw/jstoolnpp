/* realjsformatter.cpp
   2010-12-16

Copyright (c) 2010 SUN Junwen

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
#include <cstdlib>
#include <string>
#include <cstring>

#include "realjsformatter.h"

using namespace std;

bool RealJSFormatter::IsNormalChar(int ch)
{
	// 一般字符
	return ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') ||
		(ch >= 'A' && ch <= 'Z') || ch == '_' || ch == '$' || ch > 126);
}

bool RealJSFormatter::IsBlankChar(int ch)
{
	// 空白字符
	return (ch == ' ' || ch == '\t' || ch == '\r');
}

bool RealJSFormatter::IsSingleOper(int ch)
{
	// 单字符符号
	return (ch == '.' || ch == '(' || ch == ')' ||
		ch == '[' || ch == ']' || ch == '{' || ch == '}' || 
		ch == ':' || ch == ',' || ch == ';' || ch == '\n');
}

bool RealJSFormatter::IsQuote(int ch)
{
	// 引号
	return (ch == '\'' || ch == '\"');
}

bool RealJSFormatter::IsComment()
{
	// 注释
	return (charA == '/' && (charB == '/' || charB == '*'));
}

bool RealJSFormatter::IsType(const string& str)
{
	// 字符串是不是类型声明
	return (!str.compare("var") || !str.compare("int") || !str.compare("float") || 
		!str.compare("long") || !str.compare("char") || !str.compare("double") || 
		!str.compare("unsigned"));
}

void RealJSFormatter::GetToken(bool init)
{
	if(init)
	{
		charB = GetChar();
	}

	// normal procedure	
	tokenBType = STRING_TYPE;
	tokenB = "";
	if(bRegular)
	{
		tokenBType = REGULAR_TYPE;
		tokenB.push_back('/'); // 正则补一个 /
	}

	bool bQuote = false;
	bool bComment = false;
	char chQuote; // 记录引号类型 ' 或 "
	char chComment; // 注释类型 / 或 *

	while(1)
	{
		charA = charB;
		if(charA == EOF)
			return;
		charB = GetChar();

		/* 
		 * 参考 charB 来处理 charA
		 * 输出或不输出 charA
		 * 下一次循环时自动会用 charB 覆盖 charA
		 */

		// 正则需要在 token 级别判断
		if(bRegular)
		{
			// 正则状态全部输出，直到 /
			tokenB.push_back(charA);

			if(charA == '/') // 引号结束
			{
				bRegular = false;
				return;
			}

			continue;
		}

		if(bQuote)
		{
			// 引号状态，全部输出，直到引号结束
			tokenB.push_back(charA);
			
			if(charA == '\\' && charB == chQuote) // 转义字符
			{
				tokenB.push_back(charB);
				charB = GetChar();
			}

			if(charA == chQuote) // 引号结束
				return;

			continue;
		}

		if(bComment)
		{
			// 注释状态，全部输出
			if(tokenBType == COMMENT_TYPE_2 && charA == '\t')
				continue;
			tokenB.push_back(charA);

			if(chComment == '*')
			{
				// 直到 */
				tokenBType = COMMENT_TYPE_2;
				if(charA == '*' && charB == '/')
				{
					tokenB.push_back(charB);
					charB = GetChar();
					return;
				}
			}
			else
			{
				// 直到换行
				tokenBType = COMMENT_TYPE_1;
				if(charA == '\n')
					return;
			}

			continue;
		}
		
		if(IsNormalChar(charA))
		{
			tokenBType = STRING_TYPE;
			tokenB.push_back(charA);
			if(!IsNormalChar(charB)) // loop until charB is not normal char
				return;
		}
		else
		{
			if(IsBlankChar(charA))
				continue; // 忽略空白字符

			if(IsQuote(charA))
			{
				// 引号
				bQuote= true;
				chQuote = charA;

				tokenBType = STRING_TYPE;
				tokenB.push_back(charA);
				continue;
			}

			if(IsComment())
			{
				// 注释
				bComment = true;
				chComment = charB;

				//tokenBType = COMMENT_TYPE;
				tokenB.push_back(charA);
				continue;
			}

			if( IsSingleOper(charA) ||
				IsNormalChar(charB) || IsBlankChar(charB) || IsQuote(charB))
			{
				tokenBType = OPER_TYPE;
				tokenB = charA; // 单字符符号
				return;
			}

			// 双字符符号
			if(charB == '=' || charB == charA)
			{
				// 的确是双字符符号
				tokenBType = OPER_TYPE;
				tokenB.push_back(charA);
				tokenB.push_back(charB);
				charB = GetChar();
				if(tokenB.compare("==") == 0 && charB == '=')
				{
					tokenB.push_back(charB);
					charB = GetChar();
				}
				return;
			}
			else
			{
				// 还是单字符的
				tokenBType = OPER_TYPE;
				tokenB = charA; // 单字符符号
				return;
			}

			// What? How could we come here?
			charA = EOF;
			return;
		}
	}
}

void RealJSFormatter::PutToken(const string& token, 
		const string& leftStyle, 
		const string& rightStyle)
{
	// debug
	/*size_t length = token.size();
	for(size_t i = 0; i < length; ++i)
		PutChar(token[i]);
	PutChar('\n');*/
	// debug
	PutString(leftStyle);
	PutString(token);
	PutString(rightStyle);
}

void RealJSFormatter::PutString(const string& str)
{
	size_t length = str.size();
	for(size_t i = 0; i < length; ++i)
	{
		if(bNewLine && 
			str[i] != '{' && str[i] != ',' && str[i] != ';')
		{
			PutChar('\n');
			bNewLine = false;
			for(int c = 0; c < nIndents; ++c)
				PutChar('\t');
		}

		if(bNewLine && 
			(str[i] == '{' || str[i] == ',' || str[i] == ';'))
			bNewLine = false;

		if(str[i] == '\n')
			bNewLine = true;
		else
			PutChar(str[i]);
	}
}

void RealJSFormatter::Go()
{
	blockStack.push(' ');
	GetToken(true);

	while(charA != EOF)
	{
		// 先处理一下正则
		size_t last = tokenA.size() > 0 ? tokenA.size() - 1 : 0;
		char tokenALast = tokenA[last];
		if(tokenAType != STRING_TYPE && tokenB.compare("/") == 0 && 
			(tokenALast == '(' || tokenALast == ',' || tokenALast == '=' ||
				tokenALast == ':' || tokenALast == '[' || tokenALast == '!' ||
                tokenALast == '&' || tokenALast == '|' || tokenALast == '?' ||
                tokenALast == '{' || tokenALast == '}' || tokenALast == ';' ||
                tokenALast == '\n'))
		{
			bRegular = true;
			GetToken(); // 把正则内容加到 TokenB
		}

		tokenA = tokenB;
		tokenAType = tokenBType;
		GetToken();

		bool bHaveNewLine = false;
		char tokenAFirst = tokenA[0];
		char tokenBFirst = tokenB[0];
		if(tokenBFirst == '\r')
			tokenBFirst = '\n';
		if(tokenBFirst == '\n' || tokenBType == COMMENT_TYPE_1)
			bHaveNewLine = true;

		/* 
		 * 参考 tokenB 来处理 tokenA
		 * 输出或不输出 tokenA
		 * 下一次循环时自动会用 tokenB 覆盖 tokenA
		 */
		//PutToken(tokenA);
		switch(tokenAType)
		{
		case REGULAR_TYPE:
			PutToken(tokenA);
			break;
		case COMMENT_TYPE_1:
		case COMMENT_TYPE_2:
			if(tokenA[2] == '*')
			{
				// 多行注释
				if(!bHaveNewLine)
					PutToken(tokenA, string(""), string(" \n"));
				else
					PutToken(tokenA);
			}
			else
			{
				// 单行注释
				PutToken(tokenA); // 肯定会换行的
			}
			break;
		case OPER_TYPE:
			if(tokenA.compare("(") == 0 || tokenA.compare(")") == 0 || 
				tokenA.compare("[") == 0 || tokenA.compare("]") == 0 ||
				tokenA.compare("!") == 0 || tokenA.compare(".") == 0)
			{
				if((tokenA.compare(")") == 0 && blockStack.top() == '(') ||
					(tokenA.compare("]") == 0 && blockStack.top() == '['))
				{
					blockStack.pop();
					--nIndents;
				}

				if(tokenA.compare(")") == 0 && (bIfLikeBlock || bSwitchBlock) && !bBracket &&
					(blockStack.top() == 'i' || blockStack.top() == 's')) // 正在等待 )
				{
					if(!bHaveNewLine)
						PutToken(tokenA, string(""), string(" \n"));
					else
						PutToken(tokenA, string(""), string(" "));
					bBracket = true;
					++nIndents;
				}
				else if(tokenA.compare(")") == 0 && tokenB.compare("{") == 0)
					PutToken(tokenA, string(""), string(" "));
				else
					PutToken(tokenA);

				if(tokenA.compare("(") == 0 || tokenA.compare("[") == 0)
				{
					blockStack.push(tokenAFirst);
					++nIndents;
				}

				continue;
			}
			
			if(tokenA.compare(";") == 0)
			{
				if(bIfLikeBlock || bDoLikeBlock)
				{
					if(blockStack.top() == 'i')
					{
						bIfLikeBlock = false;
						blockStack.pop();
						--nIndents;
					}
					else if(blockStack.top() == 'd')
					{
						bDoLikeBlock = false;
						blockStack.pop();
						--nIndents;
					}
				}

				if(blockStack.top() == 't')
					blockStack.pop();

				if(blockStack.top() != '(' && !bHaveNewLine)
					PutToken(tokenA, string(""), string(" \n"));
				else
					PutToken(tokenA, string(""), string(" "));

				continue;
			}

			if(tokenA.compare(",") == 0)
			{
				if(blockStack.top() == '{' && !bHaveNewLine)
					PutToken(tokenA, string(""), string(" \n"));
				else
					PutToken(tokenA, string(""), string(" "));

				continue;
			}
			
			if(tokenA.compare("{") == 0)
			{
				if(bIfLikeBlock || bDoLikeBlock || bSwitchBlock)
				{
					if(blockStack.top() == 'i')
						bIfLikeBlock = false;
					else if(blockStack.top() == 'd')
						bDoLikeBlock = false;
					else if(blockStack.top() == 's')
						bSwitchBlock = false;
					blockStack.pop();
					--nIndents;
				}

				blockStack.push(tokenAFirst);
				++nIndents;

				if(!bHaveNewLine)
					PutToken(tokenA, string(""), string(" \n"));
				else
					PutToken(tokenA, string(""), string(" "));

				continue;
			}

			if(tokenA.compare("}") == 0)
			{
				if(blockStack.top() == '{')
				{
					blockStack.pop();
					--nIndents;
				}

				if((!bHaveNewLine && tokenBFirst != ';' && tokenBFirst != ',' && tokenBFirst != ')')
					&& tokenB.compare("while") != 0 && tokenB.compare("else") != 0)
					PutToken(tokenA, string(""), string(" \n"));
				else if(tokenBType == STRING_TYPE)
					PutToken(tokenA, string(""), string(" "));
				else
					PutToken(tokenA);

				continue;
			}

			if(tokenA.compare("++") == 0 || tokenA.compare("--") == 0 || 
				tokenA.compare("\n") == 0 || tokenA.compare("\r\n") == 0)
			{
				PutToken(tokenA);
				continue;
			}

			PutToken(tokenA, string(" "), string(" "));
			break;
		case STRING_TYPE:
			if(tokenBType == STRING_TYPE)
			{
				if(tokenA.compare("case") == 0 && bNewLine)
				{
					--nIndents;
					PutToken(tokenA, string(""), string(" "));
					++nIndents;
				}
				else
					PutToken(tokenA, string(""), string(" "));

				if(blockStack.top() != 't' && IsType(tokenA))
				{
					blockStack.push('t'); // 声明变量
				}
			}
			else
			{
				// 条件和循环在这里
				if(tokenA.compare("case") == 0 && bNewLine)
				{
					--nIndents;
					PutToken(tokenA, string(""), string(" "));
					++nIndents;
				}
				else
					PutToken(tokenA);

				if(tokenA.compare("if") == 0 || tokenA.compare("for") == 0 || tokenA.compare("while") == 0)
				{
					bIfLikeBlock = true;
					bBracket = false;
					blockStack.push('i');
				}

				if(tokenA.compare("do") == 0 || tokenA.compare("else") == 0)
				{
					bDoLikeBlock = true;
					blockStack.push('d');
					++nIndents;

					if(tokenB.compare("if") != 0)
						PutString(string(" "));
				}

				if(tokenA.compare("switch") == 0)
				{
					bSwitchBlock = true;
					bBracket = false;
					blockStack.push('s');
				}
			}
			break;
		}
	}
}

