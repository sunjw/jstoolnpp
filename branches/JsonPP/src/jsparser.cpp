/* JSParser.cpp
   2012-3-11

Copyright (c) 2010-2012 SUN Junwen

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

#include "strhelper.h"
#include "jsparser.h"

using namespace std;
using namespace sunjwbase;

template<class T>
bool GetStackTop(stack<T> stk, T& ret)
{
	if(stk.size() == 0)
		return false;
	ret = stk.top();
	return true;
}

template<class T>
bool StackTopEq(stack<T> stk, T eq)
{
	if(stk.size() == 0)
		return false;
	return (eq == stk.top());
}

JSParser::JSParser()
{
	Init();
}

void JSParser::Init()
{
	m_debugOutput = false;
	m_tokenCount = 0;

	m_strBeforeReg = "(,=:[!&|?+{};\n";

	m_bRegular = false;
	m_bPosNeg = false;

	m_bNewLine = false;
	m_lineBuffer = "";

	m_nRecuLevel = 0;

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

bool JSParser::IsNormalChar(int ch)
{
	// 一般字符
	return ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') ||
		(ch >= 'A' && ch <= 'Z') || ch == '_' || ch == '$' ||
		ch > 126 || ch < 0);
}

bool JSParser::IsNumChar(int ch)
{
	// 数字和.
	return ((ch >= '0' && ch <= '9') || ch == '.');
}

bool JSParser::IsBlankChar(int ch)
{
	// 空白字符
	return (ch == ' ' || ch == '\t' || ch == '\r');
}

bool JSParser::IsSingleOper(int ch)
{
	// 单字符符号
	return (ch == '.' || ch == '(' || ch == ')' ||
		ch == '[' || ch == ']' || ch == '{' || ch == '}' ||
		ch == ',' || ch == ';' || ch == '~' ||
		ch == '\n');
}

bool JSParser::IsQuote(int ch)
{
	// 引号
	return (ch == '\'' || ch == '\"');
}

bool JSParser::IsComment()
{
	// 注释
	return (m_charA == '/' && (m_charB == '/' || m_charB == '*'));
}

void JSParser::GetToken(bool init)
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
	bool bRegularFlags = false;
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
		} while(m_charB == '\r');

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

			if(m_charA == '/') // 正则可能结束
			{
				if(!bRegularFlags && IsNormalChar(m_charB))
				{
					// 正则的 flags 部分
					bRegularFlags = true;
				}
				else
				{
					// 正则结束
					m_bRegular = false;
					return;
				}
			}

			if(bRegularFlags && !IsNormalChar(m_charB))
			{
				// 正则结束
				bRegularFlags = false;
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
			if((m_charB == '=' || m_charB == m_charA) || 
				(m_charA == '-' && m_charB == '>'))
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

void JSParser::PutString(const string& str)
{
	size_t length = str.size();
	//char topStack = m_blockStack.top();
	for(size_t i = 0; i < length; ++i)
	{
		if(m_bNewLine)
		{
			// 换行后面不是紧跟着 {,; 才真正换
			PutLineBuffer(); // 输出行缓冲
		}

		if(str[i] == '\n')
			m_bNewLine = true;
		else
			m_lineBuffer += str[i];
	}
}

void JSParser::PutLineBuffer()
{
	string line;
	line.append(strtrim_right(m_lineBuffer, string(" \t")));
	line.append("\n"); //PutChar('\n');

	for(size_t i = 0; i < line.length(); ++i)
		PutChar(line[i]);

	m_lineBuffer = "";
	m_bNewLine = false;
}

void JSParser::FlushLineBuffer()
{
	m_lineBuffer = strtrim(m_lineBuffer);
	if(m_lineBuffer.length())
		PutLineBuffer();
}

void JSParser::PrepareRegular()
{
	/*
	 * 先处理一下正则
	 * m_tokenB[0] == /，且 m_tokenB 不是注释
	 * m_tokenA 不是 STRING (除了 m_tokenA == return)
	 * 而且 m_tokenA 的最后一个字符是下面这些
	*/
	//size_t last = m_tokenA.size() > 0 ? m_tokenA.size() - 1 : 0;
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

void JSParser::PreparePosNeg()
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

void JSParser::PrepareTokenB()
{
	//char stackTop = m_blockStack.top();

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

void JSParser::RecursiveProc()
{
	if(m_nRecuLevel == 0)
	{
		GetToken(true);
		m_startClock = clock();
	}

	++m_nRecuLevel;

	string field("");
	bool bGetKey = false;
	bool bGetSplitor = false;
	bool bGetValue = false;

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

		// JsonParser 忽略换行, 其它的解析器可能不要忽略
		if(m_tokenA == "\r\n" || m_tokenA == "\n")
		{
			continue;
		}

		/*
		 * 至此，读取完成 m_tokenA 和 m_tokenB
		 * 已经合并多个换行
		 * 已经识别负数
		 * 已经识别正则表达式
		 */
		if(m_tokenA == "{")
		{
			for(int r = 0; r < m_nRecuLevel - 1; ++r)
				PutString("\t");
			PutString(field);
			PutString("\n");
			field = string("");

			bGetKey = false;
			bGetSplitor = false;
			bGetValue = false;

			for(int r = 0; r < m_nRecuLevel - 1; ++r)
				PutString("\t");
			PutString(m_tokenA);
			PutString("\n");

			RecursiveProc();

			continue;
		}

		if(m_tokenA == "}")
		{
			for(int r = 0; r < m_nRecuLevel - 1; ++r)
				PutString("\t");
			PutString(field);
			PutString("\n");
			field = string("");

			bGetKey = false;
			bGetSplitor = false;
			bGetValue = false;

			--m_nRecuLevel;

			for(int r = 0; r < m_nRecuLevel - 1; ++r)
				PutString("\t");
			PutString(m_tokenA);
			PutString("\n");

			return;
		}

		if(!bGetKey && m_tokenA != ",")
		{
			field.append(m_tokenA);
			bGetKey = true;
			continue;
		}

		if(bGetKey && !bGetSplitor && m_tokenA == ":")
		{
			field.append("=");
			bGetSplitor = true;
			continue;
		}

		if(bGetKey && bGetSplitor && !bGetValue)
		{
			field.append(m_tokenA);
			bGetValue = true;
			continue;
		}

		if(bGetKey && bGetSplitor && bGetValue)
		{
			for(int r = 0; r < m_nRecuLevel - 1; ++r)
				PutString("\t");
			PutString(field);
			PutString("\n");
			field = string("");

			bGetKey = false;
			bGetSplitor = false;
			bGetValue = false;
		}
	}

	if(m_nRecuLevel == 1)
	{
		FlushLineBuffer();

		m_endClock = clock();
		m_duration = (double)(m_endClock - m_startClock) / CLOCKS_PER_SEC;
		if(m_debugOutput)
		{
			cout << "Processed tokens: " << m_tokenCount << endl;
			cout << "Time used: " << m_duration << "s" << endl;
			cout << m_tokenCount/ m_duration << " tokens/second" << endl;
		}
	}
}
