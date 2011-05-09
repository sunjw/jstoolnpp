/* realjsformatter.cpp
   2010-12-16

Copyright (c) 2010-2011 SUN Junwen

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/
#include <cstdlib>
#include <string>
#include <cstring>
#include <iostream>
#include <ctime>

#include "realjsformatter.h"

using namespace std;

RealJSFormatter::RealJSFormatter():
	m_chIndent('\t'),
	m_nChPerInd(1),
	m_bSkipCR(false),
	m_bPutCR(false),
	m_bNLBracket(false)
{
	Init();
}

RealJSFormatter::RealJSFormatter(char chIndent, int nChPerInd):
	m_chIndent(chIndent),
	m_nChPerInd(nChPerInd),
	m_bSkipCR(false),
	m_bPutCR(false),
	m_bNLBracket(false)
{
	Init();
}

RealJSFormatter::RealJSFormatter(bool bSkipCR, bool bPutCR):
	m_chIndent('\t'),
	m_nChPerInd(1),
	m_bSkipCR(bSkipCR),
	m_bPutCR(bPutCR),
	m_bNLBracket(false)
{
	Init();
}

RealJSFormatter::RealJSFormatter(char chIndent, int nChPerInd, bool bSkipCR, bool bPutCR, bool bNLBracket):
	m_chIndent(chIndent),
	m_nChPerInd(nChPerInd),
	m_bSkipCR(bSkipCR),
	m_bPutCR(bPutCR),
	m_bNLBracket(bNLBracket)
{
	Init();
}

string RealJSFormatter::Trim(string& str)
{
	std::string ret = str.erase(str.find_last_not_of(" \r\n\t") + 1);
	return ret.erase(0, ret.find_first_not_of(" \r\n\t"));
}

string RealJSFormatter::TrimSpace(string& str)
{
	std::string ret = str.erase(str.find_last_not_of(" \t") + 1);
	return ret.erase(0, ret.find_first_not_of(" \t"));
}

string RealJSFormatter::TrimRightSpace(string& str)
{
	return str.erase(str.find_last_not_of(" \t") + 1);
}

void RealJSFormatter::StringReplace(string &strBase, string strSrc, string strDes)
{
	string::size_type pos = 0;
	string::size_type srcLen = strSrc.size();
	string::size_type desLen = strDes.size();
	pos = strBase.find(strSrc, pos); 
	while((pos != string::npos))
	{
		strBase.replace(pos, srcLen, strDes);
		pos = strBase.find(strSrc, pos + desLen);
	}
}

void RealJSFormatter::Init()
{
	m_debugOutput = false;
	m_tokenCount = 0;

	m_strBeforeReg = "(,=:[!&|?+{};\n";
	m_lineBuffer = "";

	m_bRegular = false;
	m_bPosNeg = false;
	m_nIndents = 0;
	m_nLineIndents = 0;
	m_bNewLine = false;
	m_bBlockStmt = true;
	m_bAssign = false;
	m_bEmptyBracket = false;
	m_bCommentPut = false;

	m_blockMap[string("if")] = IF;
	m_blockMap[string("else")] = ELSE;
	m_blockMap[string("for")] = FOR;
	m_blockMap[string("do")] = DO;
	m_blockMap[string("while")] = WHILE;
	m_blockMap[string("switch")] = SWITCH;
	m_blockMap[string("case")] = CASE;
	m_blockMap[string("default")] = CASE;
	m_blockMap[string("try")] = TRY;
	m_blockMap[string("catch")] = CATCH;
	m_blockMap[string("=")] = ASSIGN;
	m_blockMap[string("function")] = FUNCTION;
	m_blockMap[string("{")] = BLOCK;
	m_blockMap[string("(")] = BRACKET;
	m_blockMap[string("[")] = SQUARE;

	m_specKeywordSet.insert("if");
	m_specKeywordSet.insert("for");
	m_specKeywordSet.insert("while");
	m_specKeywordSet.insert("switch");
	m_specKeywordSet.insert("catch");
	m_specKeywordSet.insert("function");
	m_specKeywordSet.insert("with");
	m_specKeywordSet.insert("return");
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
	return (m_charA == '/' && (m_charB == '/' || m_charB == '*'));
}

void RealJSFormatter::GetToken(bool init)
{
	if(init)
	{
		m_charB = GetChar();
	}

	// normal procedure	
	if(!m_bRegular && !m_bPosNeg)
	{
		m_tokenBType = STRING_TYPE;
		m_tokenB = "";
	}
	else if(m_bRegular)
	{
		m_tokenBType = REGULAR_TYPE; // 正则
		//m_tokenB.push_back('/');
	}
	else
	{
		m_tokenBType = STRING_TYPE; // 正负数
	}

	bool bQuote = false;
	bool bComment = false;
	bool bFirst = true;
	bool bNum = false; // 是不是数字
	bool bLineBegin = false;
	char chQuote; // 记录引号类型 ' 或 "
	char chComment; // 注释类型 / 或 *

	while(1)
	{
		m_charA = m_charB;
		if(m_charA == 0)
			return;
		do
		{
			m_charB = GetChar();
		} while(m_bSkipCR && m_charB == '\r');

		/* 
		 * 参考 m_charB 来处理 m_charA
		 * 输出或不输出 m_charA
		 * 下一次循环时自动会用 m_charB 覆盖 m_charA
		 */

		// 正则需要在 token 级别判断
		if(m_bRegular)
		{
			// 正则状态全部输出，直到 /
			m_tokenB.push_back(m_charA);

			if(m_charA == '\\' && (m_charB == '/' || m_charB == '\\')) // 转义字符
			{
				m_tokenB.push_back(m_charB);
				m_charB = GetChar();
			}

			if(m_charA == '/') // 正则结束
			{
				m_bRegular = false;
				return;
			}

			continue;
		}

		if(bQuote)
		{
			// 引号状态，全部输出，直到引号结束
			m_tokenB.push_back(m_charA);
			
			if(m_charA == '\\' && (m_charB == chQuote || m_charB == '\\')) // 转义字符
			{
				m_tokenB.push_back(m_charB);
				m_charB = GetChar();
			}

			if(m_charA == chQuote) // 引号结束
				return;

			continue;
		}

		if(bComment)
		{
			// 注释状态，全部输出
			if(m_tokenBType == COMMENT_TYPE_2)
			{
				// /*...*/每行前面的\t, ' '都要删掉
				if(bLineBegin && (m_charA == '\t' || m_charA == ' '))
					continue;
				else if(bLineBegin && m_charA == '*')
					m_tokenB.push_back(' ');

				bLineBegin = false;

				if(m_charA == '\n')
					bLineBegin = true;
			}
			m_tokenB.push_back(m_charA);

			if(chComment == '*')
			{
				// 直到 */
				m_tokenBType = COMMENT_TYPE_2;
				if(m_charA == '*' && m_charB == '/')
				{
					m_tokenB.push_back(m_charB);
					m_charB = GetChar();
					return;
				}
			}
			else
			{
				// 直到换行
				m_tokenBType = COMMENT_TYPE_1;
				if(m_charA == '\n')
					return;
			}

			continue;
		}
		
		if(IsNormalChar(m_charA))
		{
			m_tokenBType = STRING_TYPE;
			m_tokenB.push_back(m_charA);
			
			// 解决类似 82e-2, 442e+6, 555E-6 的问题
			// 因为这是立即数，所以只能符合以下的表达形式
			bool bNumOld = bNum;
			if(bFirst || bNumOld) // 只有之前是数字才改变状态
			{
				bNum = IsNumChar(m_charA);
				bFirst = false;
			}
			if(bNumOld && !bNum && (m_charA == 'e' || m_charA == 'E') && 
				(m_charB == '-' || m_charB == '+' || IsNumChar(m_charB)))
			{
				bNum = true;
				if(m_charB == '-' || m_charB == '+')
				{
					m_tokenB.push_back(m_charB);
					m_charB = GetChar();
				}
			}

			if(!IsNormalChar(m_charB)) // loop until m_charB is not normal char
			{
				m_bPosNeg = false;
				return;
			}
		}
		else
		{
			if(IsBlankChar(m_charA))
				continue; // 忽略空白字符

			if(IsQuote(m_charA))
			{
				// 引号
				bQuote= true;
				chQuote = m_charA;

				m_tokenBType = STRING_TYPE;
				m_tokenB.push_back(m_charA);
				continue;
			}

			if(IsComment())
			{
				// 注释
				bComment = true;
				chComment = m_charB;

				//m_tokenBType = COMMENT_TYPE;
				m_tokenB.push_back(m_charA);
				continue;
			}

			if( IsSingleOper(m_charA) ||
				IsNormalChar(m_charB) || IsBlankChar(m_charB) || IsQuote(m_charB))
			{
				m_tokenBType = OPER_TYPE;
				m_tokenB = m_charA; // 单字符符号
				return;
			}

			// 多字符符号
			if(m_charB == '=' || m_charB == m_charA)
			{
				// 的确是多字符符号
				m_tokenBType = OPER_TYPE;
				m_tokenB.push_back(m_charA);
				m_tokenB.push_back(m_charB);
				m_charB = GetChar();
				if((m_tokenB == "==" || m_tokenB == "!=" ||
					m_tokenB == "<<" || m_tokenB == ">>") && m_charB == '=')
				{
					// 三字符 ===, !==, <<=, >>=
					m_tokenB.push_back(m_charB);
					m_charB = GetChar();
				}
				else if(m_tokenB == ">>" && m_charB == '>')
				{
					// >>>, >>>=
					m_tokenB.push_back(m_charB);
					m_charB = GetChar();
					if(m_charB == '=') // >>>=
					{
						m_tokenB.push_back(m_charB);
						m_charB = GetChar();
					}
				}
				return;
			}
			else
			{
				// 还是单字符的
				m_tokenBType = OPER_TYPE;
				m_tokenB = m_charA; // 单字符符号
				return;
			}

			// What? How could we come here?
			m_charA = 0;
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
	m_bCommentPut = false; // 这个一定会发生在注释之后的任何输出后面
}

void RealJSFormatter::PutString(const string& str)
{
	size_t length = str.size();
	char topStack = m_blockStack.top();
	for(size_t i = 0; i < length; ++i)
	{
		if(m_bNewLine && (m_bCommentPut || 
			((m_bNLBracket || str[i] != '{') && str[i] != ',' && str[i] != ';')))
		{
			// 换行后面不是紧跟着 {,; 才真正换
			PutLineBuffer(); // 输出行缓冲

			m_lineBuffer = "";
			m_bNewLine = false;
			m_nIndents = m_nIndents < 0 ? 0 : m_nIndents; // 出错修正
			m_nLineIndents = m_nIndents;
			if(str[i] == '{' || str[i] == ',' || str[i] == ';') // 行结尾是注释，使得{,;不得不换行
				--m_nLineIndents;
		}

		if(m_bNewLine && !m_bCommentPut &&  
			((!m_bNLBracket && str[i] == '{') || str[i] == ',' || str[i] == ';'))
			m_bNewLine = false;

		if(str[i] == '\n')
			m_bNewLine = true;
		else
			m_lineBuffer += str[i];
	}
}

void RealJSFormatter::PutLineBuffer()
{
	string line;
	for(int c = 0; c < m_nLineIndents; ++c)
		for(int c2 = 0; c2 < m_nChPerInd; ++c2)
			PutChar(m_chIndent);
	
	line.append(TrimRightSpace(m_lineBuffer));
	if(m_bPutCR)
		line.append("\r"); //PutChar('\r');
	line.append("\n"); //PutChar('\n');

	for(size_t i = 0; i < line.length(); ++i)
		PutChar(line[i]);
}

void RealJSFormatter::PrepareRegular()
{
	/* 
	 * 先处理一下正则
	 * m_tokenB[0] == /，且 m_tokenB 不是注释
	 * m_tokenA 不是 STRING (除了 m_tokenA == return)
	 * 而且 m_tokenA 的最后一个字符是下面这些
	*/
	size_t last = m_tokenA.size() > 0 ? m_tokenA.size() - 1 : 0;
	char tokenALast = m_tokenA.size() > 0 ? m_tokenA[m_tokenA.size() - 1] : 0;
	char tokenBFirst = m_tokenB[0];
	if(tokenBFirst == '/' && m_tokenBType != COMMENT_TYPE_1 && 
		m_tokenBType != COMMENT_TYPE_2 && 
		((m_tokenAType != STRING_TYPE && m_strBeforeReg.find(tokenALast) != string::npos) || 
			m_tokenA == "return"))
	{
		m_bRegular = true;
		GetToken(); // 把正则内容加到 m_tokenB
	}
}

void RealJSFormatter::PreparePosNeg()
{
	/*
	 * 如果 m_tokenB 是 -,+ 号
	 * 而且 m_tokenA 不是字符串型也不是正则表达式
	 * 而且 m_tokenA 不是 ++, --, ], )
	 * 而且 m_charB 是一个 NormalChar
	 * 那么 m_tokenB 实际上是一个正负数
	 */
	if(m_tokenBType == OPER_TYPE && (m_tokenB == "-" || m_tokenB == "+") && 
		(m_tokenAType != STRING_TYPE || m_tokenA == "return") && m_tokenAType != REGULAR_TYPE &&
		m_tokenA != "++" && m_tokenA != "--" && 
		m_tokenA != "]" && m_tokenA != ")" && 
		IsNormalChar(m_charB))
	{
		// m_tokenB 实际上是正负数
		m_bPosNeg = true;
		GetToken();
	}
}

void RealJSFormatter::PrepareTokenB()
{
	char stackTop = m_blockStack.top();

	/*
	 * 跳过 else, while, catch, ',', ';', ')', { 之前的换行
	 * 如果最后读到的不是上面那几个，再把去掉的换行补上
	 */
	int c = 0;
	while(m_tokenB == "\n" || m_tokenB == "\r\n") 
	{
		++c;
		GetToken();
	}
		
	if(m_tokenB != "else" && m_tokenB != "while" && m_tokenB != "catch" && 
		m_tokenB != "," && m_tokenB != ";" && m_tokenB != ")")
	{
		// 将去掉的换行压入队列，先处理
		if(m_bNLBracket && m_tokenB == "{")
			return;

		if(m_tokenA == "{" && m_tokenB == "}")
			return; // 空 {}

		TokenAndType temp;
		c = c > 2 ? 2 : c;
		for(; c > 0; --c)
		{
			temp.token = string("\n");
			temp.type = OPER_TYPE;
			m_tokenBQueue.push(temp);
		}
		temp.token = m_tokenB;
		temp.type = m_tokenBType;
		m_tokenBQueue.push(temp);
		temp = m_tokenBQueue.front();
		m_tokenBQueue.pop();
		m_tokenB = temp.token;
		m_tokenBType = temp.type;
	}
}

void RealJSFormatter::PopMultiBlock(char previousStackTop)
{
	if(m_tokenB == ";") // 如果 m_tokenB 是 ;，弹出多个块的任务留给它
		return;

	if(!((previousStackTop == IF && m_tokenB == "else") || 
		(previousStackTop == DO && m_tokenB == "while") ||
		(previousStackTop == TRY && m_tokenB == "catch")))
	{
		char topStack = m_blockStack.top();
		// ; 还可能可能结束多个 if, do, while, for, try, catch
		while(topStack == IF || topStack == FOR || topStack == WHILE || 
			topStack == DO || topStack == ELSE || topStack == TRY || topStack == CATCH)
		{
			if(topStack == IF || topStack == FOR || 
				topStack == WHILE || topStack == CATCH ||
				topStack == ELSE || topStack == TRY)
			{
				m_blockStack.pop();
				--m_nIndents;
			}
			else if(topStack == DO)
			{
				--m_nIndents;
			}

			if((topStack == IF && m_tokenB == "else") ||
				(topStack == DO && m_tokenB == "while") ||
				(topStack == TRY && m_tokenB == "catch"))
				break; // 直到刚刚结束一个 if...else, do...while, try...catch
			topStack = m_blockStack.top();
		}
	}
}

void RealJSFormatter::Go()
{
	m_blockStack.push(' ');
	m_brcNeedStack.push(true);
	GetToken(true);

	bool bHaveNewLine;
	char tokenAFirst;
	char tokenBFirst;

	time(&m_startTime);

	while(m_charA != 0)
	{
		PrepareRegular(); // 判断正则
		PreparePosNeg(); // 判断正负数

		++m_tokenCount;
		m_tokenA = m_tokenB;
		m_tokenAType = m_tokenBType;
		
		if(m_tokenBQueue.size() == 0)
		{
			GetToken();
			PrepareTokenB(); // 看看是不是要跳过换行
		}
		else
		{
			// 有排队的换行
			TokenAndType temp;
			temp = m_tokenBQueue.front();
			m_tokenBQueue.pop();
			m_tokenB = temp.token;
			m_tokenBType = temp.type;
		}

		bHaveNewLine = false; // bHaveNewLine 表示后面将要换行，m_bNewLine 表示已经换行了
		tokenAFirst = m_tokenA[0];
		tokenBFirst = m_tokenB.size() ? m_tokenB[0] : 0;
		if(tokenBFirst == '\r')
			tokenBFirst = '\n';
		if(tokenBFirst == '\n' || m_tokenBType == COMMENT_TYPE_1)
			bHaveNewLine = true;

		if(!m_bBlockStmt && m_tokenA != "{" && m_tokenA != "\n" 
			&& m_tokenAType != COMMENT_TYPE_1 && m_tokenAType != COMMENT_TYPE_2)
			m_bBlockStmt = true;

		/* 
		 * 参考 m_tokenB 来处理 m_tokenA
		 * 输出或不输出 m_tokenA
		 * 下一次循环时自动会用 m_tokenB 覆盖 m_tokenA
		 */
		//PutToken(m_tokenA);
		switch(m_tokenAType)
		{
		case REGULAR_TYPE:
			PutToken(m_tokenA); // 正则表达式直接输出，前后没有任何样式
			break;
		case COMMENT_TYPE_1:
		case COMMENT_TYPE_2:
			if(m_tokenA[2] == '*')
			{
				// 多行注释
				if(!bHaveNewLine)
					PutToken(m_tokenA, string(""), string("\n")); // 需要换行
				else
					PutToken(m_tokenA);
			}
			else
			{
				// 单行注释
				PutToken(m_tokenA); // 肯定会换行的
			}
			m_bCommentPut = true;
			break;
		case OPER_TYPE:
			ProcessOper(bHaveNewLine, tokenAFirst, tokenBFirst);

			break;
		case STRING_TYPE:
			ProcessString(bHaveNewLine, tokenAFirst, tokenBFirst);
			break;
		}
	}

	m_lineBuffer = Trim(m_lineBuffer);
	if(m_lineBuffer.length())
		PutLineBuffer();

	time(&m_endTime);
	if(m_debugOutput)
	{
		cout << "Processed tokens: " << m_tokenCount << endl;
		cout << "Time used: " << m_endTime - m_startTime << "s" << endl;
	}
}

void RealJSFormatter::ProcessOper(bool bHaveNewLine, char tokenAFirst, char tokenBFirst)
{
	char topStack = m_blockStack.top();
	string strRight(" ");

	if(m_tokenA == "(" || m_tokenA == ")" || 
		m_tokenA == "[" || m_tokenA == "]" ||
		m_tokenA == "!" || m_tokenA == "!!" ||
		m_tokenA == "~" || m_tokenA == "^" ||
		m_tokenA == ".")
	{
		// ()[]!. 都是前后没有样式的运算符
		if((m_tokenA == ")" || m_tokenA == "]") &&
			(topStack == ASSIGN || topStack == HELPER))
		{
			if(topStack == ASSIGN)
				--m_nIndents;
			m_blockStack.pop();
		}
		if((m_tokenA == ")" && m_blockStack.top() == BRACKET) ||
			(m_tokenA == "]" && m_blockStack.top() == SQUARE))
		{
			// )] 需要弹栈，减少缩进
			m_blockStack.pop();
			--m_nIndents;
			topStack = m_blockStack.top();
			if(topStack == ASSIGN || topStack == HELPER)
				m_blockStack.pop();
		}

		if(m_tokenA == ")" && !m_brcNeedStack.top() &&
			(m_blockStack.top() == IF || m_blockStack.top() == FOR || m_blockStack.top() == WHILE ||
			m_blockStack.top() == SWITCH || m_blockStack.top() == CATCH)) 
		{
			// 栈顶的 if, for, while, switch, catch 正在等待 )，之后换行增加缩进
			// 这里的空格和下面的空格是留给 { 的，m_bNLBracket 为 true 则不需要空格了
			string rightDeco = m_tokenB != ";" ? strRight : "";
			if(!bHaveNewLine)
				rightDeco.append("\n"); 
			PutToken(m_tokenA, string(""), rightDeco);
			//bBracket = true;
			m_brcNeedStack.pop();
			m_bBlockStmt = false; // 等待 statment
			if(m_blockStack.top() == WHILE)
			{
				m_blockStack.pop();
				if(m_blockStack.top() == DO)
				{
					// 结束 do...while
					m_blockStack.pop();

					PopMultiBlock(WHILE);
				}
				else
				{
					m_blockStack.push(WHILE);
					++m_nIndents;
				}
			}
			else
				++m_nIndents;
		}
		else if(m_tokenA == ")" && (m_tokenB == "{" || bHaveNewLine))
			PutToken(m_tokenA, string(""), strRight); // { 或者换行之前留个空格
		else
			PutToken(m_tokenA); // 正常输出

		if(m_tokenA == "(" || m_tokenA == "[")
		{
			// ([ 入栈，增加缩进
			topStack = m_blockStack.top();
			if(topStack == ASSIGN)
			{
				if(!m_bAssign)
					--m_nIndents;
				else
					m_blockStack.push(HELPER);
			}
			m_blockStack.push(m_blockMap[m_tokenA]);
			++m_nIndents;
		}

		return;
	}
			
	if(m_tokenA == ";")
	{
		topStack = m_blockStack.top();
		if(topStack == ASSIGN)
		{
			--m_nIndents;
			m_blockStack.pop();
		}

		topStack = m_blockStack.top();

		// ; 结束 if, else, while, for, try, catch
		if(topStack == IF || topStack == FOR || 
			topStack == WHILE || topStack == CATCH)
		{
			m_blockStack.pop();
			--m_nIndents;
			// 下面的 } 有同样的处理
			PopMultiBlock(topStack);
		}
		if(topStack == ELSE || topStack == TRY)
		{
			m_blockStack.pop();
			--m_nIndents;
			PopMultiBlock(topStack);
		}
		if(topStack == DO)
		{
			--m_nIndents;
			PopMultiBlock(topStack);
		}
		// do 在读取到 while 后才修改计数
		// 对于 do{} 也一样

		//if(m_blockStack.top() == 't')
			//m_blockStack.pop(); // ; 也结束变量声明，暂时不压入 t

		topStack = m_blockStack.top();
		if(topStack != BRACKET && !bHaveNewLine)
			PutToken(m_tokenA, string(""), strRight.append("\n")); // 如果不是 () 里的 ; 就换行
		else if(topStack == BRACKET || m_tokenBType == COMMENT_TYPE_1)
			PutToken(m_tokenA, string(""), strRight); // (; ) 空格
		else
			PutToken(m_tokenA);

		return; // ;
	}

	if(m_tokenA == ",")
	{
		if(m_blockStack.top() == ASSIGN)
		{
			--m_nIndents;
			m_blockStack.pop();
		}
		if(m_blockStack.top() == BLOCK && !bHaveNewLine)
			PutToken(m_tokenA, string(""), strRight.append("\n")); // 如果是 {} 里的
		else
			PutToken(m_tokenA, string(""), strRight);

		return; // ,
	}
			
	if(m_tokenA == "{")
	{
		topStack = m_blockStack.top();
		if(topStack == IF || topStack == FOR || 
			topStack == WHILE || topStack == DO || 
			topStack == ELSE || topStack == SWITCH ||
			topStack == TRY || topStack == CATCH || 
			topStack == ASSIGN)
		{
			if(!m_bBlockStmt || (topStack == ASSIGN && !m_bAssign))
			{
				//m_blockStack.pop(); // 不把那个弹出来，遇到 } 时一起弹
				--m_nIndents;
				m_bBlockStmt = true;
			}
			else
			{
				m_blockStack.push(HELPER); // 压入一个 HELPER 统一状态
			}
		}	

		m_blockStack.push(m_blockMap[m_tokenA]); // 入栈，增加缩进
		++m_nIndents;

		/*
		 * { 之间的空格都是由之前的符号准备好的
		 * 这是为了解决 { 在新行时，前面会多一个空格的问题
		 * 因为算法只能向后，不能向前看
		 */
		if(m_tokenB == "}")
		{
			// 空 {}
			m_bEmptyBracket = true;
			if(m_bNewLine == false && m_bNLBracket && 
				(topStack == IF || topStack == FOR || 
				topStack == WHILE || topStack == SWITCH ||
				topStack == CATCH || topStack == FUNCTION))
			{
				PutToken(m_tokenA, string(" ")); // 这些情况下，前面补一个空格
			}
			else
			{
				PutToken(m_tokenA);
			}
		}
		else
		{
			string strLeft = (m_bNLBracket && !m_bNewLine) ? string("\n") : string("");
			if(!bHaveNewLine) // 需要换行
				PutToken(m_tokenA, strLeft, strRight.append("\n"));
			else
				PutToken(m_tokenA, strLeft, strRight);
		}

		return; // {
	}

	if(m_tokenA == "}")
	{
		topStack = m_blockStack.top();

		// 激进的策略，} 一直弹到 {
		// 这样做至少可以使得 {} 之后是正确的
		while(1)
		{
			if(topStack == BLOCK)
				break;

			m_blockStack.pop();

			switch(topStack)
			{
			case IF:
			case FOR:
			case WHILE:
			case CATCH:
			case DO:
			case ELSE:
			case TRY:
			case SWITCH:
			case ASSIGN:
			case FUNCTION:
			case HELPER:
				--m_nIndents;
				break;
			}

			topStack = m_blockStack.top();
		}

		if(topStack == BLOCK)
		{
			// 弹栈，减小缩进
			m_blockStack.pop();
			--m_nIndents;
			topStack = m_blockStack.top();

			switch(topStack)
			{
			case IF:
			case FOR:
			case WHILE:
			case CATCH:
			case ELSE:
			case TRY:
			case SWITCH:
			case ASSIGN:
			case FUNCTION:
			case HELPER:
				m_blockStack.pop();
				break;
			case DO:
				// 缩进已经处理，do 留给 while
				break;
			}
			//topStack = m_blockStack.top();
		}

		string leftStyle("");
		if(!m_bNewLine)
			leftStyle = "\n";
		if(m_bEmptyBracket)
		{
			leftStyle = "";
			strRight.append("\n");
			m_bEmptyBracket = false;
		}

		if((!bHaveNewLine && tokenBFirst != ';' && tokenBFirst != ',')
			&& (m_bNLBracket || !((topStack == DO && m_tokenB == "while") || 
			(topStack == IF && m_tokenB == "else") ||
			(topStack == TRY && m_tokenB == "catch") ||
			m_tokenB == ")")))
			PutToken(m_tokenA, leftStyle, strRight.append("\n")); // 一些情况换行
		else if(m_tokenBType == STRING_TYPE || m_tokenBType == COMMENT_TYPE_1)
			PutToken(m_tokenA, leftStyle, strRight); // 为 else 准备的空格
		else
			PutToken(m_tokenA, leftStyle); // }, }; })
		// 注意 ) 不要在输出时仿照 ,; 取消前面的换行

		PopMultiBlock(topStack);

		return; // }
	}

	if(m_tokenA == "++" || m_tokenA == "--" || 
		m_tokenA == "\n" || m_tokenA == "\r\n")
	{
		PutToken(m_tokenA);
		return;
	}

	if(m_tokenA == ":" && m_blockStack.top() == CASE)
	{
		// case, default
		if(!bHaveNewLine)
			PutToken(m_tokenA, string(""), strRight.append("\n"));
		else
			PutToken(m_tokenA, string(""), strRight);
		m_blockStack.pop();
		return;
	}

	if(m_blockStack.top() == ASSIGN)
		m_bAssign = true;

	if(m_tokenA == "=" && m_blockStack.top() != ASSIGN)
	{
		m_blockStack.push(m_blockMap[m_tokenA]);
		++m_nIndents;
		m_bAssign = false;
	}

	PutToken(m_tokenA, string(" "), string(" ")); // 剩余的操作符都是 空格oper空格
}

void RealJSFormatter::ProcessString(bool bHaveNewLine, char tokenAFirst, char tokenBFirst)
{
	if(m_tokenA == "case" || m_tokenA == "default")
	{
		// case, default 往里面缩一格
		--m_nIndents;
		string rightDeco = m_tokenA != "default" ? string(" ") : string();
		PutToken(m_tokenA, string(""), rightDeco);
		++m_nIndents;
		m_blockStack.push(m_blockMap[m_tokenA]);
		return;
	}
			
	if(m_tokenA == "do" || 
		(m_tokenA == "else" && m_tokenB != "if") ||
		m_tokenA == "try")
	{
		// do, else (NOT else if), try
		PutToken(m_tokenA);

		m_blockStack.push(m_blockMap[m_tokenA]);
		++m_nIndents; // 无需 ()，直接缩进
		m_bBlockStmt = false; // 等待 block 内部的 statment
			
		PutString(string(" "));
		if((m_tokenBType == STRING_TYPE || m_bNLBracket) && !bHaveNewLine)
			PutString(string("\n"));

		return;
	}

	if(m_tokenA == "function")
	{
		if(m_blockStack.top() == ASSIGN)
		{
			--m_nIndents;
			m_blockStack.pop();
		}
		m_blockStack.push(m_blockMap[m_tokenA]); // 把 function 也压入栈，遇到 } 弹掉
	}

	if(m_blockStack.top() == ASSIGN)
		m_bAssign = true;

	if(m_tokenBType == STRING_TYPE)
	{
		PutToken(m_tokenA, string(""), string(" "));

		//if(m_blockStack.top() != 't' && IsType(m_tokenA))
			//m_blockStack.push('t'); // 声明变量
		return;
	}

	if(m_specKeywordSet.find(m_tokenA) != m_specKeywordSet.end() && 
		m_tokenB != ";")
		PutToken(m_tokenA, string(""), string(" "));
	else
		PutToken(m_tokenA);

	if(m_tokenA == "if" || m_tokenA == "for" || 
		m_tokenA == "while" || m_tokenA == "catch")
	{
		// 等待 ()，() 到来后才能加缩进
		m_brcNeedStack.push(false);
		m_blockStack.push(m_blockMap[m_tokenA]);

	}

	if(m_tokenA == "switch")
	{
		//bBracket = false;
		m_brcNeedStack.push(false);
		m_blockStack.push(m_blockMap[m_tokenA]);
	}
}

