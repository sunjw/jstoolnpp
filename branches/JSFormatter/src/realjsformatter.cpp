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
		ch == ':' || ch == ',' || ch == ';' || ch == '^' ||
		ch == '\n');
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
	if(!bRegular)
	{
		tokenBType = STRING_TYPE;
		tokenB = "";
	}
	else
	{
		tokenBType = REGULAR_TYPE; // 正则
		//tokenB.push_back('/');
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
		
		if(IsNormalChar(charA) || 
			((charA == '-' || charA == '+') && IsNormalChar(charB)))
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
			PutChar(' '); // 后面是 { 加一个空格，,; 直接不换行就行了
		}

		if(str[i] == '\n')
			bNewLine = true;
		else
			PutChar(str[i]);
	}
}

void RealJSFormatter::PrepareRegular()
{
	/* 
	 * 先处理一下正则
	 * tokenB[0] == /，且 tokenB 不是注释
	 * tokenA 不是 STRING (除了 tokenA == return)
	 * 而且 tokenA 的最后一个字符是下面这些
	*/
	size_t last = tokenA.size() > 0 ? tokenA.size() - 1 : 0;
	char tokenALast = tokenA[last];
	char tokenBFirst = tokenB[0];
	if(tokenBType != COMMENT_TYPE_1 && tokenBType != COMMENT_TYPE_2 && 
		(tokenAType != STRING_TYPE && tokenBFirst == '/' && 
		(tokenALast == '(' || tokenALast == ',' || tokenALast == '=' ||
			tokenALast == ':' || tokenALast == '[' || tokenALast == '!' ||
               tokenALast == '&' || tokenALast == '|' || tokenALast == '?' ||
               tokenALast == '+' || tokenALast == '{' || tokenALast == '}' || 
			tokenALast == ';' || tokenALast == '\n')) || 
			(!tokenA.compare("return") && tokenBFirst == '/'))
	{
		bRegular = true;
		GetToken(); // 把正则内容加到 TokenB
	}
}

void RealJSFormatter::PrepareTokenB()
{
	char stackTop = blockStack.top();
	/*if(((stackTop == 'i' || stackTop == 'e' || stackTop == 'd' || 
		stackTop == 'f' || stackTop == 'w') && !tokenA.compare(";")) ||
		((nIfLikeBlock || nDoLikeBlock) && stackTop == '{' && !tokenA.compare("}")))
	{*/
		/*
		 * 栈顶是 if, do, else, for 且 tokenA == ; ，跳过换行，
		 * 否则难以判断后面的 else, while, catch
		 * 当前在 if 或 do 块中，栈顶是 { 且 tokenA == } ，也跳过换行
		 * 如果最后读到的不是 else 或 while，把去掉的换行再补上
		 */
	int c = 0;
	while(!tokenB.compare("\n") || !tokenB.compare("\r\n")) 
	{
		++c;
		GetToken();
	}
		
	if(tokenB.compare("else") && tokenB.compare("while") && tokenB.compare("catch")) //&& tokenB.compare("}"))
	{
		// 将去掉的换行压入队列，先处理
		TokenAndType temp;
		c = c > 2 ? 2 : c;
		for(; c > 0; --c)
		{
			temp.token = string("\n");
			temp.type = OPER_TYPE;
			tokenBQueue.push(temp);
		}
		temp.token = tokenB;
		temp.type = tokenBType;
		tokenBQueue.push(temp);
		temp = tokenBQueue.front();
		tokenBQueue.pop();
		tokenB = temp.token;
		tokenBType = temp.type;
	}
	//}
}

void RealJSFormatter::PopMultiBlock(char previousStackTop)
{
	if(!((previousStackTop == 'i' && !tokenB.compare("else")) || 
		(previousStackTop == 'd' && !tokenB.compare("while")) ||
		(previousStackTop == 'r' && !tokenB.compare("catch"))))
	{
		char topStack = blockStack.top();
		// ; 还可能可能结束多个 if, do, while, for, try, catch
		while(topStack == 'i' || topStack == 'f' || topStack == 'w' || 
			topStack == 'd' || topStack == 'e' || topStack == 'r' || topStack == 'h')
		{
			if(topStack == 'i' || topStack == 'f' || topStack == 'w' || topStack == 'h')
				--nIfLikeBlock;
			else if(topStack == 'd' || topStack == 'e' || topStack == 'r')
				--nDoLikeBlock;

			blockStack.pop();
			--nIndents;

			if((topStack == 'i' && !tokenB.compare("else")) ||
				(topStack == 'd' && !tokenB.compare("while")) ||
				(topStack == 'r' && !tokenB.compare("catch")))
				break; // 直到刚刚结束一个 if...else, do...while, try...catch
			topStack = blockStack.top();
		}
	}
}

void RealJSFormatter::Go()
{
	blockStack.push(' ');
	GetToken(true);

	while(charA != EOF)
	{
		PrepareRegular(); // 判断正则

		tokenA = tokenB;
		tokenAType = tokenBType;
		
		if(tokenBQueue.size() == 0)
		{
			GetToken();
			PrepareTokenB(); // 看看是不是要跳过换行
		}
		else
		{
			// 有排队的换行
			TokenAndType temp;
			temp = tokenBQueue.front();
			tokenBQueue.pop();
			tokenB = temp.token;
			tokenBType = temp.type;
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
			if(!tokenA.compare("(") || !tokenA.compare(")") || 
				!tokenA.compare("[") || !tokenA.compare("]") ||
				!tokenA.compare("!") || !tokenA.compare("."))
			{
				// ()[]!. 都是前后没有样式的运算符
				if((!tokenA.compare(")") && blockStack.top() == '(') ||
					(!tokenA.compare("]") && blockStack.top() == '['))
				{
					// )] 需要弹栈，减少缩进
					blockStack.pop();
					--nIndents;
				}

				if(!tokenA.compare(")") && (nIfLikeBlock || nSwitchBlock) && !bBracket &&
					(blockStack.top() == 'i' || blockStack.top() == 'f' || blockStack.top() == 'w' ||
					blockStack.top() == 's' || blockStack.top() == 'h')) 
				{
					// 栈顶的 if, switch, catch 正在等待 )，之后换行增加缩进
					// ) { 之间的空格在输出换行时会处理
					if(!bHaveNewLine)
						PutToken(tokenA, string(""), string("\n"));
					else
						PutToken(tokenA);
					bBracket = true;
					++nIndents;
				}
				else if(!tokenA.compare(")") && !tokenB.compare("{"))
					PutToken(tokenA, string(""), string(" "));
				else
					PutToken(tokenA); // 正常输出

				if(!tokenA.compare("(") || !tokenA.compare("["))
				{
					// ([ 入栈，增加缩进
					blockStack.push(tokenAFirst);
					++nIndents;
				}

				continue;
			}
			
			if(!tokenA.compare(";"))
			{
				if(nIfLikeBlock || nDoLikeBlock)
				{
					// ; 结束 if, else, do, while, for, try, catch
					char topStack = blockStack.top();
					if(topStack == 'i' || topStack == 'f' || 
						topStack == 'w' || topStack == 'h')
					{
						--nIfLikeBlock;
						blockStack.pop();
						--nIndents;
					}
					if(topStack == 'd' || topStack == 'e' || topStack == 'r')
					{
						--nDoLikeBlock;
						blockStack.pop();
						--nIndents;
					}
					
					// 下面的 } 有同样的处理
					PopMultiBlock(topStack);
				}

				//if(blockStack.top() == 't')
					//blockStack.pop(); // ; 也结束变量声明，暂时不压入 t

				if(blockStack.top() != '(' && !bHaveNewLine)
					PutToken(tokenA, string(""), string(" \n")); // 如果不是 () 里的;就换行
				else
					PutToken(tokenA, string(""), string(" "));

				continue;
			}

			if(!tokenA.compare(","))
			{
				if(blockStack.top() == '{' && !bHaveNewLine)
					PutToken(tokenA, string(""), string(" \n")); // 如果是 {} 里的
				else
					PutToken(tokenA, string(""), string(" "));

				continue;
			}
			
			if(!tokenA.compare("{"))
			{
				if((nIfLikeBlock || nDoLikeBlock || nSwitchBlock) && 
					(blockStack.top() == 'i' || blockStack.top() == 'f' || 
					blockStack.top() == 'w' || blockStack.top() == 'd' || 
					blockStack.top() == 'e' || blockStack.top() == 's' ||
					blockStack.top() == 'r' || blockStack.top() == 'h'))
				{
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

			if(!tokenA.compare("}"))
			{
				char topStack = blockStack.top();
				if(blockStack.top() == '{')
				{
					// 弹栈，减小缩进
					blockStack.pop();
					--nIndents;
					topStack = blockStack.top();
					if(topStack == 'i' || topStack == 'f' || 
						topStack == 'w' || topStack == 'h')
					{
						--nIfLikeBlock;
						blockStack.pop();
					}
					else if(topStack == 'd' || topStack == 'e' || topStack == 'r')
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

				string leftStyle("");
				if(!bNewLine)
					leftStyle = "\n";

				if((!bHaveNewLine && tokenBFirst != ';' && tokenBFirst != ',' && tokenBFirst != ')')
					&& !(topStack == 'd' && !tokenB.compare("while")) && 
					!(topStack == 'i' && !tokenB.compare("else")) &&
					!(topStack == 'r' && !tokenB.compare("catch")))
					PutToken(tokenA, leftStyle, string(" \n")); // 一些情况换行
				else if(tokenBType == STRING_TYPE)
					PutToken(tokenA, leftStyle, string(" ")); // 为 else 准备的空格
				else
					PutToken(tokenA, leftStyle); // }, }; })

				PopMultiBlock(topStack);

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
			if((!tokenA.compare("case") || !tokenA.compare("default")) && bNewLine)
			{
				// case, default 往里面缩一格
				--nIndents;
				PutToken(tokenA, string(""), string(" "));
				++nIndents;
				blockStack.push('c');
				continue;
			}
			
			if(!tokenA.compare("do") || 
				(!tokenA.compare("else") && tokenB.compare("if")) ||
				!tokenA.compare("try"))
			{
				// do, else (NOT else if), try
				PutToken(tokenA);

				++nDoLikeBlock;
				if(tokenA.compare("try"))
					blockStack.push(tokenA[0]);
				else
					blockStack.push('r');
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

				if(!tokenA.compare("if") || !tokenA.compare("for") || 
					!tokenA.compare("while") || !tokenA.compare("catch"))
				{
					++nIfLikeBlock;
					bBracket = false; // 等待 ()，() 到来后才能加缩进
					if(tokenA.compare("catch"))
						blockStack.push(tokenA[0]);
					else
						blockStack.push('h');
				}

				if(!tokenA.compare("switch"))
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

