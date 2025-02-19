/* jsparser.cpp
   2012-3-11
   Version: 0.9.8

Copyright (c) 2012- SUN Junwen

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
#include "jsparser.h"
#include <cstring>

using namespace std;

JSParser::JSParser()
{
	Init();
}

void JSParser::Init()
{
	m_debug = false;

	m_lineCount = 1; // �кŴ� 1 ��ʼ
	m_tokenCount = 0;

	m_strBeforeReg = "(,=:[!&|?+*{};>\n";

	m_bRegular = false;
	m_iRegBracket = 0;

	m_bPosNeg = false;

	m_bTempLite = false;

	m_bGetTokenInit = false;
}

void JSParser::PrintDebug()
{
	if (m_debug)
	{
		m_strDebugOutput = "";
		char buf[1024] = {0};
		SNPRINTF(buf, 1000, "Processed tokens: %ld\n", m_tokenCount);
		m_strDebugOutput.append(buf);
		SNPRINTF(buf, 1000, "Time used: %.3fs\n", m_duration);
		m_strDebugOutput.append(buf);
		SNPRINTF(buf, 1000, "%.3f tokens/second\n", m_tokenCount / m_duration);
		m_strDebugOutput.append(buf);

		PrintAdditionalDebug(m_strDebugOutput);

		printf("%s", m_strDebugOutput.c_str());
	}
}

bool JSParser::IsComment()
{
	// ע��
	return (m_charA == '/' && (m_charB == '/' || m_charB == '*'));
}

bool JSParser::IsInlineComment(const Token& token)
{
	if (token.type != COMMENT_TYPE_2)
	{
		return false;
	}

	return token.inlineComment;
}

bool JSParser::IsShebang()
{
	if (m_tokenCount == 0 && m_charA == '#' && m_charB == '!')
	{
		return true;
	}
	return false;
}

void JSParser::GetTokenRaw()
{
	if (!m_bGetTokenInit)
	{
		m_charB = GetChar();
	}

	// normal procedure
	if (!m_bRegular && !m_bPosNeg)
	{
		m_tokenB.code = "";
		m_tokenB.type = STRING_TYPE;
		m_tokenB.line = m_lineCount;
	}
	else if (m_bRegular)
	{
		//m_tokenB.push_back('/');
		m_tokenB.type = REGULAR_TYPE; // ����
	}
	else
	{
		m_tokenB.type = STRING_TYPE; // ������
	}

	bool bQuote = false;
	bool bComment = false;
	bool bRegularFlags = false;
	bool bShebang = false; // Unix Shebang
	bool bFirst = true;
	bool bNum = false; // �ǲ�������
	bool bLineBegin = false;
	char chQuote = 0; // ��¼�������� ' �� "
	char chComment = 0; // ע������ / �� *

	if (m_bTempLite)
	{
		bQuote = true;
		chQuote = '`';
		m_tokenB.type = STRING_TYPE;
		m_tokenB.code.push_back(m_charA);
	}

	while (1)
	{
		m_charA = m_charB;
		if (m_charA == 0)
		{
			m_bRegular = false; // js content error
			return;
		}

		m_charB = GetChar();
		// \r\n -> \n(next char)
		if (m_charA == '\r' && m_charB == '\n')
		{
			m_charA = '\n';
			m_charB = GetChar();
		}
		// \r -> \n
		if (m_charA == '\r' && m_charB != '\n')
		{
			m_charA = '\n';
		}
	
		if (m_charA == '\n')
		{
			++m_lineCount;
		}

		/*
		 * �ο� m_charB ������ m_charA
		 * �������� m_charA
		 * ��һ��ѭ��ʱ�Զ����� m_charB ���� m_charA
		 */

		// ������Ҫ�� token �����ж�
		if (m_bRegular)
		{
			// ����״̬ȫ�����, ֱ�� /
			m_tokenB.code.push_back(m_charA);

			if (m_charA == '\\' &&
				(m_charB == '/' || m_charB == '\\' ||
				m_charB == '[' || m_charB == ']')) // ת���ַ�
			{
				m_tokenB.code.push_back(m_charB);
				m_charB = GetChar();
			}

			if (m_charA == '[' && m_iRegBracket == 0)
			{
				++m_iRegBracket;
			}

			if (m_charA == ']' && m_iRegBracket > 0)
			{
				--m_iRegBracket;
				if (bRegularFlags)
				{
					bRegularFlags = false;
				}
			}

			if (m_charA == '/' &&
				(m_charB != '*' && m_charB != '|' && m_charB != '?')) // ������ܽ���
			{
				if (!bRegularFlags &&
					(IsNormalChar(m_charB) || m_iRegBracket > 0))
				{
					if (m_iRegBracket == 0)
					{
						// ����� flags ����
						// /g /i /ig...
						// ���� [] �� / ����Ҫת��
						bRegularFlags = true;
					}
					continue;
				}
				else
				{
					// �������
					m_bRegular = false;
					return;
				}
			}

			if (bRegularFlags && !IsNormalChar(m_charB))
			{
				// �������
				bRegularFlags = false;
				m_bRegular = false;
				return;
			}

			continue;
		}

		if (bQuote)
		{
			// ����״̬, ȫ�����, ֱ�����Ž���
			m_tokenB.code.push_back(m_charA);

			if (m_charA == '\\' && (m_charB == chQuote || m_charB == '\\')) // ת���ַ�
			{
				m_tokenB.code.push_back(m_charB);
				m_charB = GetChar();
			}

			if (m_charA == chQuote) // ���Ž���
			{
				return;
			}

			if (chQuote == '`' && m_charA == '$' && m_charB == '{') // ģ��������
			{
				m_tokenB.code.push_back(m_charB);
				m_charB = GetChar();
				return;
			}

			continue;
		}

		if (bComment)
		{
			// ע��״̬, ȫ�����
			if (m_tokenB.type == COMMENT_TYPE_2)
			{
				// /*...*/ÿ��ǰ���\t, ' '��Ҫɾ��
				if (bLineBegin && (m_charA == '\t' || m_charA == ' '))
				{
					continue;
				}
				else if (bLineBegin && m_charA == '*')
				{
					m_tokenB.code.push_back(' ');
				}

				bLineBegin = false;

				if (m_charA == '\n')
				{
					bLineBegin = true;
				}
			}
			m_tokenB.code.push_back(m_charA);

			if (chComment == '*')
			{
				// ֱ�� */
				m_tokenB.type = COMMENT_TYPE_2;
				m_tokenB.inlineComment = false;
				if (m_charA == '*' && m_charB == '/')
				{
					m_tokenB.code.push_back(m_charB);
					m_charB = GetChar();

					m_tokenABeforeComment = m_tokenA;

					return;
				}
			}
			else
			{
				// ֱ������
				m_tokenB.type = COMMENT_TYPE_1;
				m_tokenB.inlineComment = false;
				if (m_charA == '\n')
				{
					return;
				}
			}

			continue;
		}

		if (bShebang)
		{
			// Shebang ״̬, ֱ������
			m_tokenB.code.push_back(m_charA);

			if (m_charA == '\n')
			{
				return;
			}

			continue;
		}

		if (IsNormalChar(m_charA))
		{
			m_tokenB.type = STRING_TYPE;
			m_tokenB.code.push_back(m_charA);

			// ������� 82e-2, 442e+6, 555E-6 ������
			// ��Ϊ����������, ����ֻ�ܷ������µı����ʽ
			bool bNumOld = bNum;
			if (bFirst || bNumOld) // ֻ��֮ǰ�����ֲŸı�״̬
			{
				bNum = IsNumChar(m_charA);
				bFirst = false;
			}
			if (bNumOld && !bNum && (m_charA == 'e' || m_charA == 'E') &&
				(m_charB == '-' || m_charB == '+' || IsNumChar(m_charB)))
			{
				bNum = true;
				if (m_charB == '-' || m_charB == '+')
				{
					m_tokenB.code.push_back(m_charB);
					m_charB = GetChar();
				}
			}

			if (!IsNormalChar(m_charB)) // loop until m_charB is not normal char
			{
				m_bPosNeg = false;
				return;
			}
		}
		else
		{
			if (IsBlankChar(m_charA))
			{
				continue; // ���Կհ��ַ�
			}

			if (IsQuote(m_charA) || IsTemplate(m_charA))
			{
				// ����
				bQuote = true;
				chQuote = m_charA;

				m_tokenB.type = STRING_TYPE;
				m_tokenB.code.push_back(m_charA);
				continue;
			}

			if (IsComment())
			{
				// ע��
				bComment = true;
				chComment = m_charB;

				//m_tokenBType = COMMENT_TYPE;
				m_tokenB.code.push_back(m_charA);
				continue;
			}

			if (IsShebang())
			{
				bShebang = true;
				m_tokenB.type = COMMENT_TYPE_1; // Shebang ��Ϊ����ע��������
				m_tokenB.code.push_back(m_charA);
				continue;
			}

			if (IsSingleOper(m_charA) ||
				IsNormalChar(m_charB) || IsBlankChar(m_charB) ||
				IsQuote(m_charB) || IsTemplate(m_charB))
			{
				m_tokenB.type = OPER_TYPE;
				m_tokenB.code = m_charA; // ���ַ�����
				return;
			}

			// ���ַ�����
			if ((m_charB == '=' || m_charB == m_charA) ||
				((m_charA == '-' || m_charA == '=') && m_charB == '>'))
			{
				// ��ȷ�Ƕ��ַ�����
				m_tokenB.type = OPER_TYPE;
				m_tokenB.code.push_back(m_charA);
				m_tokenB.code.push_back(m_charB);
				m_charB = GetChar();
				if ((m_tokenB.code == "==" || m_tokenB.code == "!=" ||
					m_tokenB.code == "<<" || m_tokenB.code == ">>") && m_charB == '=')
				{
					// ===, !==, <<=, >>=
					m_tokenB.code.push_back(m_charB);
					m_charB = GetChar();
				}
				else if (m_tokenB.code == ">>" && m_charB == '>')
				{
					// >>>, >>>=
					m_tokenB.code.push_back(m_charB);
					m_charB = GetChar();
					if (m_charB == '=') // >>>=
					{
						m_tokenB.code.push_back(m_charB);
						m_charB = GetChar();
					}
				}
				else if ((m_tokenB.code == "&&" || m_tokenB.code == "||" ||
					m_tokenB.code == "??") && m_charB == '=')
				{
					// &&=, ||=, ??=
					m_tokenB.code.push_back(m_charB);
					m_charB = GetChar();
				}
				return;
			}
			else if (m_charA == '?' && m_charB == '.')
			{
				m_tokenB.type = OPER_TYPE;
				m_tokenB.code.push_back(m_charA);

				int prevCharB = m_charB;
				m_charB = GetChar();
				if (!IsNumChar(m_charB))
				{
					// ?.xyz
					m_tokenB.code.push_back(prevCharB);
				}
				else
				{
					// ? .123
					m_tokenBQueue.push(m_tokenB);
					m_tokenB.code = prevCharB;
					m_tokenB.type = OPER_TYPE;
					m_tokenB.line = m_lineCount;
				}
				return;
			}
			else
			{
				// ���ǵ��ַ���
				m_tokenB.type = OPER_TYPE;
				m_tokenB.code = m_charA; // ���ַ�����
				return;
			}

			// What? How could we come here?
			m_charA = 0;
			return;
		}
	}
}

bool JSParser::GetToken()
{
	if (!m_bGetTokenInit)
	{
		// ��һ�ζ����һ�� GetTokenRaw
		GetTokenRaw();
		m_bGetTokenInit = true;
	}

	PrepareRegular(); // �ж�����
	PreparePosNeg(); // �ж�������
	PrepareTempLite(); // �ж�ģ��������

	++m_tokenCount;
	m_tokenPreA = m_tokenA;
	m_tokenA = m_tokenB;

	if (m_tokenBQueue.size() == 0)
	{
		GetTokenRaw();
		PrepareTokenB(); // �����ǲ���Ҫ��������
	}
	else
	{
		// ���ŶӵĻ���
		m_tokenB = m_tokenBQueue.front();
		m_tokenBQueue.pop();
	}

	return (m_charA != 0 || m_tokenA.code != "");
}

void JSParser::PrepareRegular()
{
	/*
	 * �ȴ���һ������
	 * m_tokenB[0] == /, �� m_tokenB ����ע��
	 * m_tokenA ���� STRING (���� m_tokenA ��һЩ�ؼ���)
	 * ���� m_tokenA �����һ���ַ���������Щ
	*/
	//size_t last = m_tokenA.size() > 0 ? m_tokenA.size() - 1 : 0;
	char tokenALast = m_tokenA.code.size() > 0 ? m_tokenA.code[m_tokenA.code.size() - 1] : 0;
	char tokenBFirst = m_tokenB.code[0];
	if (tokenBFirst == '/' && m_tokenB.type != COMMENT_TYPE_1 &&
		m_tokenB.type != COMMENT_TYPE_2 &&
		((m_tokenA.type != STRING_TYPE && m_strBeforeReg.find(tokenALast) != string::npos) ||
			(m_tokenA.code == "return" || m_tokenA.code == "throw" ||
				m_tokenA.code == "in" || m_tokenA.code == "of")))
	{
		m_bRegular = true;
		GetTokenRaw(); // ���������ݼӵ� m_tokenB
	}
}

void JSParser::PreparePosNeg()
{
	/*
	 * ��� m_tokenB �� -,+ ��
	 * ���� m_tokenA �����ַ�����Ҳ����������ʽ
	 * ���� m_tokenA ���� ++, --, ], )
	 * ���� m_charB ��һ�� NormalChar
	 * ��ô m_tokenB ʵ������һ��������
	 */
	Token tokenRealPre = m_tokenA;
	if (m_tokenA.type == COMMENT_TYPE_2)
	{
		tokenRealPre = m_tokenABeforeComment;
	}

	if (m_tokenB.type == OPER_TYPE && (m_tokenB.code == "-" || m_tokenB.code == "+") &&
		(tokenRealPre.type != STRING_TYPE || 
		tokenRealPre.code == "return" || tokenRealPre.code == "case" ||
		tokenRealPre.code == "delete" || tokenRealPre.code == "throw") && 
		tokenRealPre.type != REGULAR_TYPE &&
		tokenRealPre.code != "++" && tokenRealPre.code != "--" &&
		tokenRealPre.code != "]" && tokenRealPre.code != ")" &&
		IsNormalChar(m_charB))
	{
		// m_tokenB ʵ������������
		m_bPosNeg = true;
		GetTokenRaw();
	}
}

void JSParser::PrepareTempLite()
{
	if (m_tokenB.code == "}" && StackTopEq(m_blockStack, JS_TEMP_LITE))
	{
		m_bTempLite = true;
		GetTokenRaw();
		m_bTempLite = false;
	}
}

void JSParser::PrepareTokenB()
{
	//char stackTop = m_blockStack.top();

	/*
	 * ���� else, while, catch, ',', ';', ')', { ֮ǰ�Ļ���
	 * ����������Ĳ��������Ǽ���, �ٰ�ȥ���Ļ��в���
	 */
	int c = 0;
	while (m_tokenB.code == "\n" || m_tokenB.code == "\r\n")
	{
		++c;
		GetTokenRaw();
	}

	if (c == 0 && 
		m_tokenA.type != COMMENT_TYPE_1 &&
		m_tokenB.type == COMMENT_TYPE_2 && 
		m_tokenB.code.find("\r") == string::npos &&
		m_tokenB.code.find("\n") == string::npos)
	{
		// COMMENT_TYPE_2 ֮ǰû�л���, �Լ�Ҳû�л���
		m_tokenB.inlineComment = true;
	}

	if (m_tokenB.code != "else" && /*m_tokenB.code != "while" &&*/
		m_tokenB.code != "catch" && m_tokenB.code != "finally" &&
		m_tokenB.code != "," && m_tokenB.code != ";" && m_tokenB.code != ")")
	{
		// ��ȥ���Ļ���ѹ�����, �ȴ���
		if (m_tokenA.code == "{" && m_tokenB.code == "}")
		{
			return; // �� {}
		}

		bool eatNewLine = false;

		if (m_tokenA.code == "}" && m_tokenB.code == "while" &&
			StackTopEq(m_blockStack, JS_BLOCK))
		{
			char topStack;
			GetStackTop(m_blockStack, topStack);
			m_blockStack.pop();
			if (StackTopEq(m_blockStack, JS_DO))
			{
				eatNewLine = true;
			}
			m_blockStack.push(topStack);
		}

		bool needRepush = false;
		if (StackTopEq(m_blockStack, JS_BLOCK))
		{
			char topStack;
			GetStackTop(m_blockStack, topStack);
			m_blockStack.pop();
			needRepush = true;
		}
		if ((m_tokenA.code != ";" && StackTopEq(m_blockStack, JS_IMPORT)) ||
			StackTopEq(m_blockStack, JS_DECL))
		{
			eatNewLine = true;
		}
		if (needRepush)
		{
			m_blockStack.push(JS_BLOCK);
		}

		if (eatNewLine)
		{
			return;
		}

		Token temp;
		c = c > 2 ? 2 : c;
		for (; c > 0; --c)
		{
			temp.code = string("\n");
			temp.type = OPER_TYPE;
			m_tokenBQueue.push(temp);
		}
		temp = m_tokenB;
		m_tokenBQueue.push(temp);
		temp = m_tokenBQueue.front();
		m_tokenBQueue.pop();
		m_tokenB = temp;
	}
}
