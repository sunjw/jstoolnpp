/* JsonParser.cpp
   2012-3-23
   Version: 0.9.5

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
#include "jsonpp.h"
#include "jsonparser.h"

using namespace std;
using namespace sunjwbase;

template<class T>
bool JsonParser::GetStackTop(stack<T> stk, T& ret)
{
	if(stk.size() == 0)
		return false;
	ret = stk.top();
	return true;
}

template<class T>
bool JsonParser::StackTopEq(stack<T> stk, T eq)
{
	if(stk.size() == 0)
		return false;
	return (eq == stk.top());
}

void JsonParser::RecursiveProc(JsonValue& jsonValue)
{
	// initial job
	if(m_nRecuLevel == 0)
	{
		m_startClock = clock();
		jsonValue.SetValueType(JsonValue::UNKNOWN_VALUE);
	}

	++m_nRecuLevel;
	// initial job

	char stackTop = JS_EMPTY;
	GetStackTop(m_blockStack, stackTop);

	string key, strValue;
	bool bGetKey = false;
	bool bGetSplitor = false;

	while(GetToken()) // 获得下一个 m_tokenA 和 m_tokenB
	{
		// JsonParser 忽略换行, 其它的解析器可能不要忽略
		if(m_tokenA == "\r\n" || 
			m_tokenA == "\n" ||
			m_tokenAType == COMMENT_TYPE_1 || 
			m_tokenAType == COMMENT_TYPE_2)
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
			m_blockStack.push(JS_BLOCK);

			if(stackTop == JS_EMPTY)
			{
				jsonValue.SetValueType(JsonValue::MAP_VALUE);
				RecursiveProc(jsonValue);
			}
			else
			{
				JsonValue innerValue;
				innerValue.SetValueType(JsonValue::MAP_VALUE);

				RecursiveProc(innerValue);

				if(stackTop == JS_SQUARE)
				{
					jsonValue.ArrayPut(innerValue);
				}
				else if(stackTop == JS_BLOCK)
				{
					bGetKey = false;
					bGetSplitor = false;
					jsonValue.MapPut(key, innerValue);
				}
			}

			continue;
		}

		if(m_tokenA == "}")
		{
			bGetKey = false;
			bGetSplitor = false;

			m_blockStack.pop();
			--m_nRecuLevel;

			return;
		}

		if(m_tokenA == "[")
		{
			m_blockStack.push(JS_SQUARE);

			if(stackTop == JS_EMPTY)
			{
				jsonValue.SetValueType(JsonValue::ARRAY_VALUE);
				RecursiveProc(jsonValue);
			}
			else
			{
				JsonValue innerValue;
				innerValue.SetValueType(JsonValue::ARRAY_VALUE);

				RecursiveProc(innerValue);

				if(stackTop == JS_SQUARE)
				{
					jsonValue.ArrayPut(innerValue);
				}
				else if(stackTop == JS_BLOCK)
				{
					bGetKey = false;
					bGetSplitor = false;
					jsonValue.MapPut(key, innerValue);
				}
			}

			continue;
		}

		if(m_tokenA == "]")
		{
			m_blockStack.pop();
			--m_nRecuLevel;

			return;
		}

		if(stackTop == JS_BLOCK)
		{
			if(!bGetKey && m_tokenA != ",")
			{
				key = m_tokenA;

				if(key[0] == '\'')
					key = strtrim(key, string("'"));
				else if(key[0] == '"')
					key = strtrim(key, string("\""));

				bGetKey = true;
				continue;
			}

			if(bGetKey && !bGetSplitor && m_tokenA == ":")
			{
				bGetSplitor = true;
				continue;
			}

			if(bGetKey && bGetSplitor)
			{
				strValue = ReadStrValue();

				JsonValue jValue;
				GenStrJsonValue(jValue, strValue);

				jsonValue.MapPut(key, jValue);

				bGetKey = false;
				bGetSplitor = false;
			}
		}

		if(stackTop == JS_SQUARE)
		{
			if(m_tokenA != ",")
			{
				strValue = ReadStrValue();

				JsonValue jValue;
				GenStrJsonValue(jValue, strValue);

				jsonValue.ArrayPut(jValue);
			}
		}
	}

	// finished job
	if(m_nRecuLevel == 1)
	{
		//FlushLineBuffer();
		m_endClock = clock();
		m_duration = (double)(m_endClock - m_startClock) / CLOCKS_PER_SEC;
		if(m_debugOutput)
		{
			cout << "Processed tokens: " << m_tokenCount << endl;
			cout << "Time used: " << m_duration << "s" << endl;
			cout << m_tokenCount/ m_duration << " tokens/second" << endl;
		}
	}
	// finished job
}

string JsonParser::ReadStrValue()
{
	string ret(m_tokenA);
	// fix decimal number value bug
	if(m_tokenB == ".")
	{
		// maybe it's a decimal
		string strDec(m_tokenA);
		GetToken();
		strDec.append(".");
		strDec.append(m_tokenB);
		ret = strDec;
		GetToken();
	}

	return ret;
}

void JsonParser::GenStrJsonValue(JsonValue& jsonValue, string value)
{
	if(value[0] == '\'' || value[0] == '"')
	{
		if(value[0] == '\'')
			value = strtrim(value, string("'"));
		else if(value[0] == '"')
			value = strtrim(value, string("\""));

		/*
		 * STRING_VALUE 存入的时候会把周围的引号去掉
		 * 输出的时候统一成 "..."
		 * 所以要把里面的引号转义
		 */
		value = strreplace(value, "\\'", "'");
		value = strreplace(value, "\\\"", "\"");
		value = strreplace(value, "\"", "\\\"");

		jsonValue.SetValueType(JsonValue::STRING_VALUE);
	}
	else if(IsNumChar(value[0]) || value[0] == '-' || value[0] == '+')
	{
		jsonValue.SetValueType(JsonValue::NUMBER_VALUE);
	}
	else if(value == "true" || value == "false")
	{
		jsonValue.SetValueType(JsonValue::BOOL_VALUE);
	}
	else if(value[0] == '/')
	{
		jsonValue.SetValueType(JsonValue::REGULAR_VALUE);
	}
	else
	{
		jsonValue.SetValueType(JsonValue::UNKNOWN_VALUE);
	}

	jsonValue.SetStrValue(value);
}
