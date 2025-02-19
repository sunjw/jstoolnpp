/* jsparser.h
   2012-3-11
   Version: 0.9.9

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
#ifndef _JS_PARSER_H_
#define _JS_PARSER_H_
#include <stdio.h>
#include <time.h>
#include <string>
#include <stack>
#include <queue>
#include <map>
#include <set>

using namespace std;

#if defined (WIN32)
#define SNPRINTF sprintf_s
#else
#define SNPRINTF snprintf
#endif

template<class T>
bool GetStackTop(const stack<T>& stk, T& ret)
{
	if (stk.size() == 0)
	{
		return false;
	}
	ret = stk.top();
	return true;
}

template<class T>
bool StackTopEq(const stack<T>& stk, T eq)
{
	if (stk.size() == 0)
	{
		return false;
	}
	return (eq == stk.top());
}

#define NOT_TOKEN -1
#define STRING_TYPE 0
#define OPER_TYPE 1
#define REGULAR_TYPE 2
#define COMMENT_TYPE_1 9 // ����ע��
#define COMMENT_TYPE_2 10 // ����ע��

/*
 * if-i, else-e, else if-i,
 * for-f, do-d, while-w,
 * switch-s, case-c, default-c
 * try-r, catch-h
 * {-BLOCK, (-BRACKET
 * 0-empty
 */
#define JS_IF 'i'
#define JS_ELSE 'e'
#define JS_FOR 'f'
#define JS_DO 'd'
#define JS_WHILE 'w'
#define JS_SWITCH 's'
#define JS_CASE 'c'
#define JS_TRY 'r'
#define JS_CATCH 'h'
#define JS_IMPORT 'm'
#define JS_FUNCTION 'n'
#define JS_BLOCK '{'
#define JS_BRACKET '('
#define JS_SQUARE '['
#define JS_ASSIGN '='
#define JS_QUEST_MARK '?'
#define JS_TEMP_LITE '$'
#define JS_HELPER '\\'
#define JS_STUB ' '
#define JS_EMPTY 0

class JSParser
{
protected:
	struct Token
	{
		string code; // ��������
		int type; // Token ����
		bool inlineComment; // COMMENT_TYPE_2 �� inline ģʽ
		long line; // �к�
	};

public:
	typedef stack<char> CharStack;
	typedef stack<bool> BoolStack;
	typedef stack<int> IntStack;
	typedef stack<size_t> SizeStack;
	typedef queue<Token> TokenQueue;
	typedef map<string, char> StrCharMap;
	typedef set<int> IntSet;
	typedef set<string> StrSet;

	explicit JSParser();

	virtual ~JSParser()
	{}

	bool m_debug;
	inline const char *GetDebugOutput()
	{ return m_strDebugOutput.c_str(); }

private:
	Token m_tokenABeforeComment;

protected:
	int m_charA;
	int m_charB;
	Token m_tokenPreA;
	Token m_tokenA;
	Token m_tokenB;

	CharStack m_blockStack;

	long m_lineCount;
	long m_tokenCount;

	bool inline IsNormalChar(int ch)
	{
		// һ���ַ�
		return ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') ||
				(ch >= 'A' && ch <= 'Z') || ch == '_' || ch == '$' ||
				ch > 126 || ch < 0);
	}

	bool inline IsNumChar(int ch)
	{
		// ���ֺ�.
		return ((ch >= '0' && ch <= '9') || ch == '.');
	}

	bool inline IsBlankChar(int ch)
	{
		// �հ��ַ�
		return (ch == ' ' || ch == '\t' || ch == '\r');
	}

	bool inline IsSingleOper(int ch)
	{
		// ���ַ�����
		return (ch == '.' || ch == '(' || ch == ')' ||
				ch == '[' || ch == ']' || ch == '{' || ch == '}' ||
				ch == ',' || ch == ';' || ch == '~' || ch == '#' ||
				ch == '\n');
	}

	bool inline IsQuote(int ch)
	{
		// ����
		return (ch == '\'' || ch == '\"');
	}

	bool inline IsTemplate(int ch)
	{
		// ģ��
		return (ch == '`');
	}

	bool IsInlineComment(const Token& token);

	bool GetToken(); // ���������, ����ȵȵ� GetToken ����

	void inline StartParse()
	{ m_startClock = clock(); }

	void inline EndParse()
	{
		m_endClock = clock();
		m_duration = (double)(m_endClock - m_startClock) / CLOCKS_PER_SEC;
		PrintDebug();
	}

private:
	void Init();

	// Should be implemented in derived class
	virtual int GetChar() = 0; // JUST get next char from input

	bool inline IsComment(); // Ҫ�����ж� charA, charB
	bool inline IsShebang(); // Unix Shebang

	void GetTokenRaw();

	void PrepareRegular(); // ͨ���ʷ��ж� tokenB ����
	void PreparePosNeg(); // ͨ���ʷ��ж� tokenB ������
	void PrepareTempLite(); // ͨ���ʷ��ж� tokenB ģ��������
	void PrepareTokenB();

	void PrintDebug();
	virtual void PrintAdditionalDebug(string& strDebugOutput) {}

	string m_strBeforeReg; // �ж�����ʱ, ����ǰ����Գ��ֵ��ַ�

	TokenQueue m_tokenBQueue;

	bool m_bRegular; // tokenB ʵ�������� GetToken �õ���������Ա״̬
	int m_iRegBracket; // ������ʽ�г��ֵ� [] ���

	bool m_bPosNeg; // tokenB ʵ����������

	bool m_bTempLite; // tokenB ʵ����ģ��������

	bool m_bGetTokenInit; // �Ƿ��ǵ�һ��ִ�� GetToken

	clock_t m_startClock;
	clock_t m_endClock;
	double m_duration;
	string m_strDebugOutput;

private:
	// ��ֹ����
	JSParser(const JSParser&);
	JSParser& operator=(const JSParser&);
};

#endif
