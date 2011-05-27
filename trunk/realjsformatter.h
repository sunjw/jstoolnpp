/* realjsformatter.h
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
#ifndef _REAL_JSFORMATTER_H_
#define _REAL_JSFORMATTER_H_
#include <string>
#include <stack>
#include <queue>
#include <map>
#include <set>

using namespace std;

#define STRING_TYPE 0
#define OPER_TYPE 1
#define REGULAR_TYPE 2
#define COMMENT_TYPE_1 9 // 单行注释
#define COMMENT_TYPE_2 10 // 多行注释

/*
 * if-i, else-e, else if-i, 
 * for-f, do-d, while-w, 
 * switch-s, case-c, default-c
 * try-r, catch-h
 * {-BLOCK, (-BRACKET
 */ 
#define IF 'i'
#define ELSE 'e'
#define FOR 'f'
#define DO 'd'
#define WHILE 'w'
#define SWITCH 's'
#define CASE 'c'
#define TRY 'r'
#define CATCH 'h'
#define FUNCTION 'n'
#define ASSIGN '='
#define BLOCK '{'
#define BRACKET '('
#define SQUARE '['
#define HELPER '\\'

struct TokenAndType
{
	string token;
	int type;
};

class RealJSFormatter
{
public:
	typedef stack<char> CharStack;
	typedef stack<bool> BoolStack;
	typedef queue<TokenAndType> TokenQueue;
	typedef map<string, char> StrCharMap;
	typedef set<string> StrSet;

	RealJSFormatter();
	RealJSFormatter(char chIndent, int nChPerInd);
	RealJSFormatter(bool bSkipCR, bool bPutCR);
	RealJSFormatter(char chIndent, int nChPerInd, bool bSkipCR, bool bPutCR, bool bNLBracket);

	virtual ~RealJSFormatter()
	{}

	void Go();

	static string Trim(const string& str);
	static string TrimSpace(const string& str);
	static string TrimRightSpace(const string& str);
	void StringReplace(string& strBase, const string& strSrc, const string& strDes);

	bool m_debugOutput;

protected:
	void Init();

	// Should be implemented in derived class
	virtual int GetChar() = 0; // JUST get next char from input
	virtual void PutChar(int ch) = 0; // JUST put a char to output 

	void ProcessOper(bool bHaveNewLine, char tokenAFirst, char tokenBFirst);
	void ProcessString(bool bHaveNewLine, char tokenAFirst, char tokenBFirst);

	void GetToken(bool init = false);
	void PutToken(const string& token, 
		const string& leftStyle = string(""), 
		const string& rightStyle = string("")); // Put a token out with style
	void PutString(const string& str);
	void PutLineBuffer();

	bool inline IsNormalChar(int ch);
	bool inline IsNumChar(int ch);
	bool inline IsBlankChar(int ch);
	bool inline IsSingleOper(int ch);
	bool inline IsQuote(int ch);
	bool inline IsComment(); // 要联合判断 charA, charB

	void PrepareRegular(); // 通过词法判断 tokenB 正则
	void PreparePosNeg(); // 通过词法判断 tokenB 正负数
	void PrepareTokenB();
	void PopMultiBlock(char previousStackTop);

	int m_tokenCount;
	time_t m_startTime;
	time_t m_endTime;

	string m_strBeforeReg; // 判断正则时，正则前面可以出现的字符

	bool m_bRegular; // tokenB 实际是正则 GetToken 用到的两个成员状态
	bool m_bPosNeg; // tokenB 实际是正负数
	int m_charA;
	int m_charB;
	int m_tokenAType;
	int m_tokenBType;
	string m_tokenA;
	string m_tokenB;
	TokenQueue m_tokenBQueue;

	int m_nLineIndents;
	string m_lineBuffer;

	StrSet m_specKeywordSet; // 后面要跟着括号的关键字集合
	StrCharMap m_blockMap;
	CharStack m_blockStack; 
	int m_nIndents; // 缩进数量，不用计算 blockStack，效果不好

	bool m_bNewLine; // 准备换行的标志
	bool m_bBlockStmt; // block 真正开始了
	// 使用栈是为了解决在判断条件中出现循环的问题
	BoolStack m_brcNeedStack; // if 之类的后面的括号
	bool m_bAssign;
	bool m_bEmptyBracket; // 空 {}

	bool m_bCommentPut; // 刚刚输出了注释

	char m_chIndent; // 作为缩进的字符
	int m_nChPerInd; // 每个缩进缩进字符个数

	bool m_bSkipCR; // 读取时跳过 \r 
	bool m_bPutCR; // 使用 \r\n 作为换行

	bool m_bNLBracket; // { 之前是否换行

private:
	// 阻止拷贝
	RealJSFormatter(const RealJSFormatter&);
	RealJSFormatter& operator=(const RealJSFormatter&);
};

#endif
