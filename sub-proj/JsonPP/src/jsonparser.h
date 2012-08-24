/* JsonParser.h
   2012-3-23
   Version: 0.9.6

Copyright (c) 2012 SUN Junwen

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
#ifndef _JSON_PARSER_H_
#define _JSON_PARSER_H_

#include "jsonpp.h"
#include "jsparser.h"

/*
 * if-i, else-e, else if-i,
 * for-f, do-d, while-w,
 * switch-s, case-c, default-c
 * try-r, catch-h
 * {-BLOCK, (-BRACKET
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
#define JS_FUNCTION 'n'
#define JS_ASSIGN '='
#define JS_BLOCK '{'
#define JS_BRACKET '('
#define JS_SQUARE '['
#define JS_HELPER '\\'
#define JS_EMPTY 0

class JsonParser: public JSParser
{
public:
	template<class T>
	bool GetStackTop(stack<T> stk, T& ret);
	template<class T>
	bool StackTopEq(stack<T> stk, T eq);

	JsonParser():m_nRecuLevel(0)
	{}

	inline void Go(JsonValue& jsonValue)
	{ RecursiveProc(jsonValue); }

	bool m_debugOutput;

private:
	int m_nRecuLevel; // ¿éµÝ¹é²ã´Î
	JSParser::CharStack m_blockStack;

	// performance info
	clock_t m_startClock;
	clock_t m_endClock;
	double m_duration;

	void RecursiveProc(JsonValue& jsonValue);
	void GenStrJsonValue(JsonValue& jsonValue, std::string value);
	std::string ReadStrValue();
};

#endif

