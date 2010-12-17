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

			if(charA == '\\' && (charB == '/' || charB == '\\')) // 转义字符
			{
				tokenB.push_back(charB);
				charB = GetChar();
			}

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
			
			if(charA == '\\' && (charB == chQuote || charB == '\\')) // 转义字符
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
				if((!tokenB.compare("==") || !tokenB.compare("!=")) && charB == '=')
				{
					// 三字符 ===, !==
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
			// 换行后面不是紧跟着 {,; 才真正换
			PutChar('\n');
			bNewLine = false;
			for(int c = 0; c < nIndents; ++c)
				PutChar('\t');
		}

		if(bNewLine && 
			(str[i] == ',' || str[i] == ';'))
			bNewLine = false;
		if(bNewLine && str[i] == '{')
		{
			bNewLine = false;
			PutChar(' '); // 后面是 { 加一个空格
		}

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
		if(tokenBType != COMMENT_TYPE_1 && tokenBType != COMMENT_TYPE_2 && 
			(tokenAType != STRING_TYPE && tokenB[0] == '/' && 
			(tokenALast == '(' || tokenALast == ',' || tokenALast == '=' ||
				tokenALast == ':' || tokenALast == '[' || tokenALast == '!' ||
                tokenALast == '&' || tokenALast == '|' || tokenALast == '?' ||
                tokenALast == '+' || tokenALast == '{' || tokenALast == '}' || 
				tokenALast == ';' || tokenALast == '\n')) || 
				(!tokenA.compare("return") && !tokenB.compare("/")))
		{
			bRegular = true;
			GetToken(); // 把正则内容加到 TokenB
		}

		tokenA = tokenB;
		tokenAType = tokenBType;
		GetToken();
		//if(nIfLikeBlock || nDoLikeBlock)
		if(((blockStack.top() == 'i' || blockStack.top() == 'd') && !tokenA.compare(";")) ||
			((nIfLikeBlock || nDoLikeBlock) && blockStack.top() == '{' && !tokenA.compare("}")))
		{
			while(!tokenB.compare("\n") || !tokenB.compare("\r\n"))
				GetToken(); // 在循环或条件块中忽略读入的换行
		}

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
			PutToken(tokenA); // 正则表达式直接输出，前后没有任何样式
			break;
		case COMMENT_TYPE_1:
		case COMMENT_TYPE_2:
			if(tokenA[2] == '*')
			{
				// 多行注释
				if(!bHaveNewLine)
					PutToken(tokenA, string(""), string(" \n")); // 需要换行
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
				// ()[]!. 都是前后没有样式的运算符
				if((tokenA.compare(")") == 0 && blockStack.top() == '(') ||
					(tokenA.compare("]") == 0 && blockStack.top() == '['))
				{
					// )] 需要弹栈，减少缩进
					blockStack.pop();
					--nIndents;
				}

				if(tokenA.compare(")") == 0 && (nIfLikeBlock || nSwitchBlock) && !bBracket &&
					(blockStack.top() == 'i' || blockStack.top() == 'f' || blockStack.top() == 'w' ||
					blockStack.top() == 's')) 
				{
					// if, switch 正在等待 )，之后换行增加缩进
					// ) { 之间的空格在输出换行时会处理
					if(!bHaveNewLine)
						PutToken(tokenA, string(""), string("\n"));
					else
						PutToken(tokenA);
					bBracket = true;
					++nIndents;
				}
				else
					PutToken(tokenA); // 正常输出

				if(tokenA.compare("(") == 0 || tokenA.compare("[") == 0)
				{
					// ([ 入栈，增加缩进
					blockStack.push(tokenAFirst);
					++nIndents;
				}

				continue;
			}
			
			if(tokenA.compare(";") == 0)
			{
				if(nIfLikeBlock || nDoLikeBlock)
				{
					// ; 结束 if, do, while, for
					char topStack = blockStack.top();
					if(topStack == 'i' || topStack == 'f' || topStack == 'w')
					{
						--nIfLikeBlock;
						blockStack.pop();
						--nIndents;
					}
					if(topStack == 'd' || topStack == 'e')
					{
						--nDoLikeBlock;
						blockStack.pop();
						--nIndents;
					}
					
					if(!((topStack == 'i' && !tokenB.compare("else")) || 
						(topStack == 'd' && !tokenB.compare("while"))))
					{
						topStack = blockStack.top();
						// ; 还可能可能结束多个 if, do, while, for
						while(topStack == 'i' || topStack == 'f' || topStack == 'w' || 
							topStack == 'd' || topStack == 'e')
						{
							if(topStack == 'i' || topStack == 'f' || topStack == 'w')
							{
								--nIfLikeBlock;
								blockStack.pop();
								--nIndents;
							}
							else if(topStack == 'd' || topStack == 'e')
							{
								--nDoLikeBlock;
								blockStack.pop();
								--nIndents;
							}
							if(topStack == 'i' && !tokenB.compare("else"))
								break;
							topStack = blockStack.top();
						}
					}
				}

				if(blockStack.top() == 't')
					blockStack.pop(); // ; 也结束变量声明

				if(blockStack.top() != '(' && !bHaveNewLine)
					PutToken(tokenA, string(""), string(" \n")); // 如果不是 () 里的;就换行
				else
					PutToken(tokenA, string(""), string(" "));

				continue;
			}

			if(tokenA.compare(",") == 0)
			{
				if(blockStack.top() == '{' && !bHaveNewLine)
					PutToken(tokenA, string(""), string(" \n")); // 如果是 {} 里的,而且不是在变量声明就换行
				else
					PutToken(tokenA, string(""), string(" "));

				continue;
			}
			
			if(tokenA.compare("{") == 0)
			{
				if((nIfLikeBlock || nDoLikeBlock || nSwitchBlock) && 
					(blockStack.top() == 'i' || blockStack.top() == 'f' || 
					blockStack.top() == 'w' || blockStack.top() == 'd' || 
					blockStack.top() == 'e' || blockStack.top() == 's'))
				{
					// { 替代原来的 if 之类的
					/*if(blockStack.top() == 'i' || blockStack.top() == 'f' || blockStack.top() == 'w')
						bIfLikeBlock = false;
					else if(blockStack.top() == 'd' || blockStack.top() == 'e')
						bDoLikeBlock = false;
					else if(blockStack.top() == 's')
						bSwitchBlock = false;*/
					//blockStack.pop(); // 不把那个弹出来，遇到 } 时一起弹
					--nIndents;
				}

				blockStack.push(tokenAFirst); // 入栈，增加缩进
				++nIndents;

				if(!bHaveNewLine) // 需要换行
					PutToken(tokenA, string(""), string(" \n"));
				else
					PutToken(tokenA, string(""), string(" "));

				continue;
			}

			if(tokenA.compare("}") == 0)
			{
				char topStack = blockStack.top();
				if(blockStack.top() == '{')
				{
					// 弹栈，减小缩进
					blockStack.pop();
					--nIndents;
					topStack = blockStack.top();
					if(topStack == 'i' || topStack == 'f' || topStack == 'w')
					{
						--nIfLikeBlock;
						blockStack.pop();
					}
					else if(topStack == 'd' || topStack == 'e')
					{
						--nDoLikeBlock;
						blockStack.pop();
						
					}
					else if(topStack == 's')
					{
						--nSwitchBlock;
						blockStack.pop();
					}
					//topStack = blockStack.top();
				}

				if((!bHaveNewLine && tokenBFirst != ';' && tokenBFirst != ',' && tokenBFirst != ')')
					&& !(topStack == 'd' && !tokenB.compare("while")) && 
					!(topStack == 'i' && !tokenB.compare("else")))
					PutToken(tokenA, string(""), string(" \n")); // 一些情况换行
				else if(tokenBType == STRING_TYPE)
					PutToken(tokenA, string(""), string(" ")); // 为 else 准备的空格
				else
					PutToken(tokenA); // }, }; })

				if(!((topStack == 'i' && !tokenB.compare("else")) || 
						(topStack == 'd' && !tokenB.compare("while"))))
				{
					topStack = blockStack.top();
					// ; 还可能可能结束多个 if, do, while, for
					while(topStack == 'i' || topStack == 'f' || topStack == 'w' || 
						topStack == 'd' || topStack == 'e')
					{
						if(topStack == 'i' || topStack == 'f' || topStack == 'w')
						{
							--nIfLikeBlock;
							blockStack.pop();
							--nIndents;
						}
						else if(topStack == 'd' || topStack == 'e')
						{
							--nDoLikeBlock;
							blockStack.pop();
							--nIndents;
						}
						if(topStack == 'i' && !tokenB.compare("else"))
							break;
						topStack = blockStack.top();
					}
				}

				continue;
			}

			if(!tokenA.compare("++") || !tokenA.compare("--") || 
				!tokenA.compare("\n") || !tokenA.compare("\r\n"))
			{
				PutToken(tokenA);
				continue;
			}

			if(!tokenA.compare(":") && blockStack.top() == 'c')
			{
				// case, default
				if(!bHaveNewLine)
					PutToken(tokenA, string(""), string("\n"));
				else
					PutToken(tokenA);
				blockStack.pop();
				continue;
			}

			PutToken(tokenA, string(" "), string(" ")); // 剩余的操作符都是 空格oper空格
			break;
		case STRING_TYPE:
			if((tokenA.compare("case") == 0 || tokenA.compare("default") == 0) && bNewLine)
			{
				// case, default 往里面缩一格
				--nIndents;
				PutToken(tokenA, string(""), string(" "));
				++nIndents;
				blockStack.push('c');
				continue;
			}
			
			if((tokenA.compare("do") == 0 || tokenA.compare("else") == 0) && tokenB.compare("if"))
			{
				PutToken(tokenA);

				++nDoLikeBlock;
				blockStack.push(tokenA[0]);
				++nIndents; // 无需 ()，直接缩进
				
				if(tokenBType == STRING_TYPE)
				{
					PutString(string(" \n"));
				}
				else
				{
					if(!tokenB.compare("{"))
						PutString(string(" "));
				}
				continue;
			}

			if(tokenBType == STRING_TYPE)
			{
				PutToken(tokenA, string(""), string(" "));

				//if(blockStack.top() != 't' && IsType(tokenA))
					//blockStack.push('t'); // 声明变量
			}
			else
			{
				PutToken(tokenA);

				if(tokenA.compare("if") == 0 || tokenA.compare("for") == 0 || tokenA.compare("while") == 0)
				{
					++nIfLikeBlock;
					bBracket = false; // 等待 ()，() 到来后才能加缩进
					blockStack.push(tokenA[0]);
				}

				if(tokenA.compare("switch") == 0)
				{
					++nSwitchBlock;
					bBracket = false;
					blockStack.push('s');
				}
			}
			break;
		}
	}
}

