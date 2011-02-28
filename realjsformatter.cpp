/* realjsformatter.cpp
   2010-12-16

Copyright (c) 2010-2011 SUN Junwen

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

RealJSFormatter::RealJSFormatter():
	chIndent('\t'),
	nChPerInd(1),
	bSkipCR(false),
	bPutCR(false),
	bNLBracket(false)
{
	Init();
}

RealJSFormatter::RealJSFormatter(char chIndent, int nChPerInd):
	bSkipCR(false),
	bPutCR(false),
	bNLBracket(false)
{
	this->chIndent = chIndent;
	this->nChPerInd = nChPerInd;
	Init();
}

RealJSFormatter::RealJSFormatter(bool bSkipCR, bool bPutCR):
	chIndent('\t'),
	nChPerInd(1),
	bNLBracket(false)
{
	this->bSkipCR = bSkipCR;
	this->bPutCR = bPutCR;
	Init();
}

RealJSFormatter::RealJSFormatter(char chIndent, int nChPerInd, bool bSkipCR, bool bPutCR, bool bNLBracket)
{
	this->chIndent = chIndent;
	this->nChPerInd = nChPerInd;
	this->bSkipCR = bSkipCR;
	this->bPutCR = bPutCR;
	this->bNLBracket = bNLBracket;
	Init();
}

void RealJSFormatter::Init()
{
	bRegular = false;
	bPosNeg = false;
	nIndents = 0;
	bNewLine = false;
	nIfLikeBlock = 0;
	nDoLikeBlock = 0;
	nSwitchBlock = 0;
	bBlockStmt = true;
	bAssign = false;
	bEmptyBracket = false;
	bCommentPut = false;

	blockMap[string("if")] = IF;
	blockMap[string("else")] = ELSE;
	blockMap[string("for")] = FOR;
	blockMap[string("do")] = DO;
	blockMap[string("while")] = WHILE;
	blockMap[string("switch")] = SWITCH;
	blockMap[string("case")] = CASE;
	blockMap[string("default")] = CASE;
	blockMap[string("try")] = TRY;
	blockMap[string("catch")] = CATCH;
	blockMap[string("function")] = FUNCTION;
	blockMap[string("{")] = BLOCK;
	blockMap[string("(")] = BRACKET;
	blockMap[string("[")] = SQUARE;

	specKeywordSet.insert("if");
	specKeywordSet.insert("for");
	specKeywordSet.insert("while");
	specKeywordSet.insert("switch");
	specKeywordSet.insert("catch");
	specKeywordSet.insert("function");
	specKeywordSet.insert("with");
}

bool RealJSFormatter::IsNormalChar(int ch)
{
	// 一般字符
	return ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') ||
		(ch >= 'A' && ch <= 'Z') || ch == '_' || ch == '$' || ch > 126);
}

bool RealJSFormatter::IsNumChar(int ch)
{
	// 数字和.
	return ((ch >= '0' && ch <= '9') || ch == '.');
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
		ch == ':' || ch == ',' || ch == ';' || ch == '~' || 
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
	if(!bRegular && !bPosNeg)
	{
		tokenBType = STRING_TYPE;
		tokenB = "";
	}
	else if(bRegular)
	{
		tokenBType = REGULAR_TYPE; // 正则
		//tokenB.push_back('/');
	}
	else
	{
		tokenBType = STRING_TYPE; // 正负数
	}

	bool bQuote = false;
	bool bComment = false;
	bool bFirst = true;
	bool bNum = false; // 是不是数字
	char chQuote; // 记录引号类型 ' 或 "
	char chComment; // 注释类型 / 或 *

	while(1)
	{
		charA = charB;
		if(charA == EOF)
			return;
		do
		{
			charB = GetChar();
		} while(bSkipCR && charB == '\r');

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
			
			// 解决类似 82e-2 442e+6 的问题
			// 因为这是立即数，所以只能符合以下的表达形式
			bool bNumOld = bNum;
			if(bFirst || bNumOld) // 只有之前是数字才改变状态
			{
				bNum = IsNumChar(charA);
				bFirst = false;
			}
			if(bNumOld && !bNum && charA == 'e' && 
				(charB == '-' || charB == '+' || IsNumChar(charB)))
			{
				bNum = true;
				if(charB == '-' || charB == '+')
				{
					tokenB.push_back(charB);
					charB = GetChar();
				}
			}

			if(!IsNormalChar(charB)) // loop until charB is not normal char
			{
				bPosNeg = false;
				return;
			}
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

			// 多字符符号
			if(charB == '=' || charB == charA)
			{
				// 的确是多字符符号
				tokenBType = OPER_TYPE;
				tokenB.push_back(charA);
				tokenB.push_back(charB);
				charB = GetChar();
				if((!tokenB.compare("==") || !tokenB.compare("!=") ||
					!tokenB.compare("<<") || !tokenB.compare(">>")) && charB == '=')
				{
					// 三字符 ===, !==, <<=, >>=
					tokenB.push_back(charB);
					charB = GetChar();
				}
				else if(!tokenB.compare(">>") && charB == '>')
				{
					// >>>, >>>=
					tokenB.push_back(charB);
					charB = GetChar();
					if(charB == '=') // >>>=
					{
						tokenB.push_back(charB);
						charB = GetChar();
					}
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
	bCommentPut = false; // 这个一定会发生在注释之后的任何输出后面
}

void RealJSFormatter::PutString(const string& str)
{
	size_t length = str.size();
	for(size_t i = 0; i < length; ++i)
	{
		if(bNewLine && (bCommentPut || 
			((bNLBracket || str[i] != '{') && str[i] != ',' && str[i] != ';')))
		{
			// 换行后面不是紧跟着 {,; 才真正换
			if(bPutCR)
				PutChar('\r');
			PutChar('\n');
			bNewLine = false;
			int inds = nIndents;
			if(str[i] == '{' || str[i] == ',' || str[i] == ';') // 行结尾是注释，使得{,;不得不换行
				--inds;
			if(bAssign)
				++inds;
			for(int c = 0; c < inds; ++c)
				for(int c2 = 0; c2 < nChPerInd; ++c2)
					PutChar(chIndent);
		}

		if(bNewLine && !bCommentPut &&  
			((!bNLBracket && str[i] == '{') || str[i] == ',' || str[i] == ';'))
			bNewLine = false;
		//if(bNewLine && !bCommentPut && str[i] == '{')
		//{
		//	bNewLine = false;
		//	PutChar(' '); // 后面是 { 加一个空格，,; 直接不换行就行了
		//}

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

void RealJSFormatter::PreparePosNeg()
{
	/*
	 * 如果 tokenB 是 -,+ 号
	 * 而且 tokenA 不是字符串型也不是正则表达式
	 * 而且 tokenA 不是 ++, --, ], )
	 * 而且 charB 是一个 NormalChar
	 * 那么 tokenB 实际上是一个正负数
	 */
	if(tokenBType == OPER_TYPE && (!tokenB.compare("-") || !tokenB.compare("+")) && 
		tokenAType != STRING_TYPE && tokenAType != REGULAR_TYPE &&
		tokenA.compare("++") && tokenA.compare("--") && 
		tokenA.compare("]") && tokenA.compare(")") && 
		IsNormalChar(charB))
	{
		// tokenB 实际上是正负数
		bPosNeg = true;
		GetToken();
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
	 * 跳过 else, while, catch, ',', ';', ')', { 之前的换行
	 * 如果最后读到的不是上面那几个，再把去掉的换行补上
	 */
	int c = 0;
	while(!tokenB.compare("\n") || !tokenB.compare("\r\n")) 
	{
		++c;
		GetToken();
	}
		
	if(tokenB.compare("else") && tokenB.compare("while") && tokenB.compare("catch") && 
		tokenB.compare(",") && tokenB.compare(";") && tokenB.compare(")"))
	{
		// 将去掉的换行压入队列，先处理
		if(bNLBracket && !tokenB.compare("{"))
			return;

		if(!tokenA.compare("{") && !tokenB.compare("}"))
			return; // 空 {}

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
	if(!tokenB.compare(";")) // 如果 tokenB 是 ;，弹出多个块的任务留给它
		return;

	if(!((previousStackTop == IF && !tokenB.compare("else")) || 
		(previousStackTop == DO && !tokenB.compare("while")) ||
		(previousStackTop == TRY && !tokenB.compare("catch"))))
	{
		char topStack = blockStack.top();
		// ; 还可能可能结束多个 if, do, while, for, try, catch
		while(topStack == IF || topStack == FOR || topStack == WHILE || 
			topStack == DO || topStack == ELSE || topStack == TRY || topStack == CATCH)
		{
			if(topStack == IF || topStack == FOR || topStack == WHILE || topStack == CATCH)
			{
				--nIfLikeBlock;
				blockStack.pop();
				--nIndents;
			}
			else if(topStack == ELSE || topStack == TRY)
			{
				--nDoLikeBlock;
				blockStack.pop();
				--nIndents;
			}
			else if(topStack == DO)
			{
				--nIndents;
			}

			if((topStack == IF && !tokenB.compare("else")) ||
				(topStack == DO && !tokenB.compare("while")) ||
				(topStack == TRY && !tokenB.compare("catch")))
				break; // 直到刚刚结束一个 if...else, do...while, try...catch
			topStack = blockStack.top();
		}
	}
}

void RealJSFormatter::Go()
{
	blockStack.push(' ');
	brcNeedStack.push(true);
	GetToken(true);

	bool bHaveNewLine;
	char tokenAFirst;
	char tokenBFirst;

	while(charA != EOF)
	{
		PrepareRegular(); // 判断正则
		PreparePosNeg(); // 判断正负数

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

		bHaveNewLine = false;
		tokenAFirst = tokenA[0];
		tokenBFirst = tokenB[0];
		if(tokenBFirst == '\r')
			tokenBFirst = '\n';
		if(tokenBFirst == '\n' || tokenBType == COMMENT_TYPE_1)
			bHaveNewLine = true;

		if(!bBlockStmt && tokenA.compare("{") && tokenA.compare("\n") 
			&& tokenAType != COMMENT_TYPE_1 && tokenAType != COMMENT_TYPE_2)
			bBlockStmt = true;

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
					PutToken(tokenA, string(""), string("\n")); // 需要换行
				else
					PutToken(tokenA);
			}
			else
			{
				// 单行注释
				PutToken(tokenA); // 肯定会换行的
			}
			bCommentPut = true;
			break;
		case OPER_TYPE:
			ProcessOper(bHaveNewLine, tokenAFirst, tokenBFirst);

			break;
		case STRING_TYPE:
			ProcessString(bHaveNewLine, tokenAFirst, tokenBFirst);
			break;
		}
	}
}

void RealJSFormatter::ProcessOper(bool bHaveNewLine, char tokenAFirst, char tokenBFirst)
{
	string strRight = bNLBracket ? string() : string(" ");

	if(!tokenA.compare("(") || !tokenA.compare(")") || 
		!tokenA.compare("[") || !tokenA.compare("]") ||
		!tokenA.compare("!") || !tokenA.compare("!!") ||
		!tokenA.compare("~") || !tokenA.compare("^") ||
		!tokenA.compare("."))
	{
		// ()[]!. 都是前后没有样式的运算符
		if((!tokenA.compare(")") && blockStack.top() == BRACKET) ||
			(!tokenA.compare("]") && blockStack.top() == SQUARE))
		{
			bAssign = false;
			// )] 需要弹栈，减少缩进
			blockStack.pop();
			--nIndents;
		}

		if(!tokenA.compare(")") && (nIfLikeBlock || nSwitchBlock) && !brcNeedStack.top() &&
			(blockStack.top() == IF || blockStack.top() == FOR || blockStack.top() == WHILE ||
			blockStack.top() == SWITCH || blockStack.top() == CATCH)) 
		{
			// 栈顶的 if, for, while, switch, catch 正在等待 )，之后换行增加缩进
			// ) { 之间的空格在输出换行时会处理
			// 这里的空格和下面的空格是留给 { 的，bNLBracket 为 true 则不需要空格了
			string rightDeco = tokenB.compare(";") ? strRight : string();
			if(!bHaveNewLine)
				rightDeco.append("\n"); 
			PutToken(tokenA, string(""), rightDeco);
			//bBracket = true;
			brcNeedStack.pop();
			bBlockStmt = false; // 等待 statment
			if(blockStack.top() == WHILE)
			{
				blockStack.pop();
				if(blockStack.top() == DO)
				{
					// 结束 do...while
					--nIfLikeBlock;
					--nDoLikeBlock;
					blockStack.pop();

					PopMultiBlock(WHILE);
				}
				else
				{
					blockStack.push(WHILE);
					++nIndents;
				}
			}
			else
				++nIndents;
		}
		else if(!tokenA.compare(")") && (!tokenB.compare("{") || bHaveNewLine))
			PutToken(tokenA, string(""), strRight); // 这里的空格也是留给 { 的
		else
			PutToken(tokenA); // 正常输出

		if(!tokenA.compare("(") || !tokenA.compare("["))
		{
			// ([ 入栈，增加缩进
			blockStack.push(blockMap[tokenA]);
			++nIndents;
		}

		return;
	}
			
	if(!tokenA.compare(";"))
	{
		bAssign = false;
		char topStack = blockStack.top();
		if(nIfLikeBlock || nDoLikeBlock)
		{
			// ; 结束 if, else, while, for, try, catch
			if(topStack == IF || topStack == FOR || 
				topStack == WHILE || topStack == CATCH)
			{
				--nIfLikeBlock;
				blockStack.pop();
				--nIndents;
			}
			if(topStack == ELSE || topStack == TRY)
			{
				--nDoLikeBlock;
				blockStack.pop();
				--nIndents;
			}
			if(topStack == DO)
				--nIndents;
			// do 在读取到 while 后才修改计数
			// 对于 do{} 也一样

			// 下面的 } 有同样的处理
			PopMultiBlock(topStack);
		}

		//if(blockStack.top() == 't')
			//blockStack.pop(); // ; 也结束变量声明，暂时不压入 t

		topStack = blockStack.top();
		if(topStack != BRACKET && !bHaveNewLine)
			PutToken(tokenA, string(""), string("\n")); // 如果不是 () 里的 ; 就换行
		else if(topStack == BRACKET || tokenBType == COMMENT_TYPE_1)
			PutToken(tokenA, string(""), string(" ")); // (; ) 空格
		else
			PutToken(tokenA);

		return;
	}

	if(!tokenA.compare(","))
	{
		bAssign = false;
		if(blockStack.top() == BLOCK && !bHaveNewLine)
			PutToken(tokenA, string(""), string("\n")); // 如果是 {} 里的
		else
			PutToken(tokenA, string(""), string(" "));

		return;
	}
			
	if(!tokenA.compare("{"))
	{
		bAssign = false;
		char topStack = blockStack.top();
		if((nIfLikeBlock || nDoLikeBlock || nSwitchBlock) && 
			(topStack == IF || topStack == FOR || 
			topStack == WHILE || topStack == DO || 
			topStack == ELSE || topStack == SWITCH ||
			topStack == TRY || topStack == CATCH))
		{
			if(!bBlockStmt)
			{
				//blockStack.pop(); // 不把那个弹出来，遇到 } 时一起弹
				--nIndents;
				bBlockStmt = true;
			}
			else
			{
				blockStack.push(HELPER); // 压入一个 HELPER 帮助判断
			}
		}	

		blockStack.push(blockMap[tokenA]); // 入栈，增加缩进
		++nIndents;

		if(!tokenB.compare("}"))
		{
			// 空 {}
			bEmptyBracket = true;
			if(bNewLine == false && bNLBracket && 
				(topStack == IF || topStack == FOR || 
				topStack == WHILE || topStack == SWITCH ||
				topStack == CATCH || topStack == FUNCTION))
			{
				PutToken(tokenA, string(" "));
			}
			else
			{
				PutToken(tokenA);
			}
		}
		else
		{
			string strLeft = (bNLBracket && !bNewLine) ? string("\n") : string("");
			if(!bHaveNewLine) // 需要换行
				PutToken(tokenA, strLeft, string("\n"));
			else if(tokenBType == COMMENT_TYPE_1)
				PutToken(tokenA, strLeft, string(" "));
			else
				PutToken(tokenA, strLeft);
		}

		return;
	}

	if(!tokenA.compare("}"))
	{
		bAssign = false;
		char topStack = blockStack.top();

		// 激进的策略，} 一直弹到 {
		// 这样做至少可以使得 {} 之后是正确的
		while(1)
		{
			if(topStack == BLOCK)
				break;

			blockStack.pop();

			switch(topStack)
			{
			case IF:
			case FOR:
			case WHILE:
			case CATCH:
				--nIfLikeBlock;
				--nIndents;
				break;
			case DO:
			case ELSE:
			case TRY:
				--nDoLikeBlock;
				--nIndents;
				break;
			case SWITCH:
				--nSwitchBlock;
				--nIndents;
				break;
			}

			topStack = blockStack.top();
		}

		if(topStack == BLOCK)
		{
			// 弹栈，减小缩进
			blockStack.pop();
			--nIndents;
			topStack = blockStack.top();

			switch(topStack)
			{
			case IF:
			case FOR:
			case WHILE:
			case CATCH:
				--nIfLikeBlock;
				blockStack.pop();
				break;
			case ELSE:
			case TRY:
				--nDoLikeBlock;
				blockStack.pop();
				break;
			case DO:
				// 缩进已经处理，do 留给 while
				break;
			case SWITCH:
				--nSwitchBlock;
				blockStack.pop();
				break;
			case FUNCTION:
			case HELPER:
				blockStack.pop();
				break;
			}
			//topStack = blockStack.top();
		}

		string leftStyle("");
		if(!bNewLine)
			leftStyle = "\n";
		if(bEmptyBracket)
		{
			leftStyle = "";
			strRight = "\n";
			bEmptyBracket = false;
		}

		if((!bHaveNewLine && tokenBFirst != ';' && tokenBFirst != ',')
			&& !(!bNLBracket && topStack == DO && !tokenB.compare("while")) && 
			!(!bNLBracket && topStack == IF && !tokenB.compare("else")) &&
			!(!bNLBracket && topStack == TRY && !tokenB.compare("catch")) &&
			!(!bNLBracket && !tokenB.compare(")")))
			PutToken(tokenA, leftStyle, string("\n")); // 一些情况换行
		else if(tokenBType == STRING_TYPE || tokenBType == COMMENT_TYPE_1)
			PutToken(tokenA, leftStyle, strRight); // 为 else 准备的空格
		else
			PutToken(tokenA, leftStyle); // }, }; })
		// 注意 ) 不要在输出时仿照 ,; 取消前面的换行

		PopMultiBlock(topStack);

		return;
	}

	if(!tokenA.compare("++") || !tokenA.compare("--") || 
		!tokenA.compare("\n") || !tokenA.compare("\r\n"))
	{
		PutToken(tokenA);
		return;
	}

	if(!tokenA.compare(":") && blockStack.top() == CASE)
	{
		// case, default
		if(!bHaveNewLine)
			PutToken(tokenA, string(""), string(" \n"));
		else
			PutToken(tokenA, string(""), string(" "));
		blockStack.pop();
		return;
	}

	if(!tokenA.compare("="))
		bAssign = true;

	PutToken(tokenA, string(" "), string(" ")); // 剩余的操作符都是 空格oper空格
}

void RealJSFormatter::ProcessString(bool bHaveNewLine, char tokenAFirst, char tokenBFirst)
{
	if((!tokenA.compare("case") || !tokenA.compare("default")) && bNewLine)
	{
		// case, default 往里面缩一格
		--nIndents;
		string rightDeco = tokenA.compare("default") ? string(" ") : string();
		PutToken(tokenA, string(""), rightDeco);
		++nIndents;
		blockStack.push(blockMap[tokenA]);
		return;
	}
			
	if(!tokenA.compare("do") || 
		(!tokenA.compare("else") && tokenB.compare("if")) ||
		!tokenA.compare("try"))
	{
		// do, else (NOT else if), try
		PutToken(tokenA);

		++nDoLikeBlock;
		blockStack.push(blockMap[tokenA]);
		++nIndents; // 无需 ()，直接缩进
		bBlockStmt = false; // 等待 block 内部的 statment
				
		if((tokenBType == STRING_TYPE || bNLBracket) && !bHaveNewLine)
		{
			PutString(string("\n"));
		}
		else
		{
			PutString(string(" "));
		}
		return;
	}

	if(!tokenA.compare("function"))
	{
		bAssign = false;
		blockStack.push(blockMap[tokenA]); // 把 function 也压入栈，遇到 } 弹掉
	}

	if(tokenBType == STRING_TYPE)
	{
		PutToken(tokenA, string(""), string(" "));

		//if(blockStack.top() != 't' && IsType(tokenA))
			//blockStack.push('t'); // 声明变量
	}
	else
	{
		if(specKeywordSet.find(tokenA) != specKeywordSet.end() &&
			!tokenB.compare("("))
			PutToken(tokenA, string(""), string(" "));
		else
			PutToken(tokenA);

		if(!tokenA.compare("if") || !tokenA.compare("for") || 
			!tokenA.compare("while") || !tokenA.compare("catch"))
		{
			++nIfLikeBlock;
			//bBracket = false; // 等待 ()，() 到来后才能加缩进
			brcNeedStack.push(false);
			//if(tokenA.compare("catch"))
			//	blockStack.push(tokenA[0]);
			//else
			//	blockStack.push('h');
			blockStack.push(blockMap[tokenA]);

		}

		if(!tokenA.compare("switch"))
		{
			++nSwitchBlock;
			//bBracket = false;
			brcNeedStack.push(false);
			blockStack.push(blockMap[tokenA]);
		}
	}
}

