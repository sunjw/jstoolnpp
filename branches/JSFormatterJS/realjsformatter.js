/* jsformatter.js
2011-04-12

Copyright (c) 2011- SUN Junwen

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
var RealJSFormatter = function (indent_char, indent_size, newline_bracket) {
	this.indent_char = indent_char; // m_chIndent
	this.indent_size = indent_size; // m_nChPerInd
	this.newline_bracket = newline_bracket; // m_bNLBracket
	
	this.STRING_TYPE = 0;
	this.OPER_TYPE = 1;
	this.REGULAR_TYPE = 2;
	this.COMMENT_TYPE_1 = 9; // 单行注释
	this.COMMENT_TYPE_2 = 10; // 多行注释
	
	this.IF = 'i';
	this.ELSE = 'e';
	this.FOR = 'f';
	this.DO = 'd';
	this.WHILE = 'w';
	this.SWITCH = 's';
	this.CASE = 'c';
	this.TRY = 'r';
	this.CATCH = 'h';
	this.FUNCTION = 'n';
	this.ASSIGN = '=';
	this.BLOCK = '{';
	this.BRACKET = '(';
	this.SQUARE = '[';
	this.HELPER = '\\';
	
	// Initiate
	this.char_a = ''; // m_charA
	this.char_b = ''; // m_charB
	this.token_a = ''; // m_tokenA
	this.token_b = ''; // m_tokenB
	this.token_a_type = this.STRING_TYPE; // m_tokenAType
	this.token_b_type = this.STRING_TYPE; // m_tokenType
	
	this.chars_before_regex = "(,=:[!&|?+{};\n"; // m_strBeforeReg
	this.line_buffer = ""; // m_lineBuffer
	
	this.regular_express = false; // this.regular_express
	this.posneg = false; // this.posneg
	this.indents = 0; // m_nIndents
	this.newlined = false; // m_bNewLine
	this.block_stmt = true; // m_bBlockStmt
	this.assign = false; // m_bAssign
	this.empty_bracket = false; // m_bEmptyBracket
	this.comment_put = false; // m_bCommentPut
	
	this.block_map = new Array(); // m_blockMap
	this.block_map["if"] = this.IF;
	this.block_map["else"] = this.ELSE;
	this.block_map["for"] = this.FOR;
	this.block_map["do"] = this.DO;
	this.block_map["while"] = this.WHILE;
	this.block_map["switch"] = this.SWITCH;
	this.block_map["case"] = this.CASE;
	this.block_map["default"] = this.CASE;
	this.block_map["try"] = this.TRY;
	this.block_map["catch"] = this.CATCH;
	this.block_map["="] = this.ASSIGN;
	this.block_map["function"] = this.FUNCTION;
	this.block_map["{"] = this.BLOCK;
	this.block_map["("] = this.BRACKET;
	this.block_map["["] = this.SQUARE;
	
	this.keyword_set = new Array(); // m_specKeywordSet
	this.keyword_set.push("if");
	this.keyword_set.push("for");
	this.keyword_set.push("while");
	this.keyword_set.push("switch");
	this.keyword_set.push("catch");
	this.keyword_set.push("function");
	this.keyword_set.push("with");
	this.keyword_set.push("return");
	// Initiate end
	
	this.is_normal_char = function (ch) { // IsNormalChar
		// 一般字符
		return ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') ||
			(ch >= 'A' && ch <= 'Z') || ch == '_' || ch == '$' || ch > 126);
	};
	
	this.is_num = function (ch) { // IsNumChar
		// 数字和.
		return ((ch >= '0' && ch <= '9') || ch == '.');
	};
	
	this.is_blank = function (ch) { // IsBlankChar
		// 空白字符
		return (ch == ' ' || ch == '\t' || ch == '\r');
	};
	
	this.is_single_oper = function (ch) { // IsSingleOper
		// 单字符符号
		return (ch == '.' || ch == '(' || ch == ')' ||
			ch == '[' || ch == ']' || ch == '{' || ch == '}' ||
			ch == ':' || ch == ',' || ch == ';' || ch == '~' ||
			ch == '\n');
	};
	
	this.is_quote = function (ch) { // IsQuote
		// 引号
		return (ch == '\'' || ch == '\"');
	};
	
	this.is_comment = function () { // IsComment
		// 注释
		return (this.char_a == '/' && (this.char_b == '/' || this.char_b == '*'));
	};
	
	this.get_token = function (init) { // GetToken
		if (init) {
			this.char_b = GetChar();
		}
		
		// normal procedure
		if (!this.regular_express && !this.posneg) {
			this.token_b_type = this.STRING_TYPE;
			this.token_b = "";
		} else if (this.regular_express) {
			this.token_b_type = this.REGULAR_TYPE; // 正则
			//m_tokenB.push_back('/');
		} else {
			this.token_b_type = this.STRING_TYPE; // 正负数
		}
		
		quote_stat = false; // bQuote
		comment_stat = false; // bComment
		first_char = true; // first_char
		num_stat = false; // 是不是数字 // bNum
		line_begin = false; // bLineBegin
		quote_char = ''; // 记录引号类型 ' 或 " // chQuote
		comment_char = ''; // 注释类型 / 或 * // chComment
		while (1) {
			this.char_a = this.char_b;
			//if (this.char_a == EOF)
			//	return ; 停止
			do {
				this.char_b = GetChar();
			} while (this.char_b == '\r') ;
			
			/*
			 * 参考 m_charB 来处理 m_charA
			 * 输出或不输出 m_charA
			 * 下一次循环时自动会用 m_charB 覆盖 m_charA
			 */
			
			// 正则需要在 token 级别判断
			if (this.regular_express) {
				// 正则状态全部输出，直到 /
				this.token_b += this.char_a;
				
				if (this.char_a == '\\' && (this.char_b == '/' || this.char_b == '\\')) { // 转义字符
					this.token_b += this.char_b;
					this.char_b = GetChar();
				}
				
				if (this.char_a == '/') { // 正则结束
					this.regular_express = false;
					return ;
				}
				
				continue;
			}
			
			if (quote_stat) {
				// 引号状态，全部输出，直到引号结束
				this.token_b += this.char_a;
				
				if (this.char_a == '\\' && (this.char_b == quote_char || this.char_b == '\\')) { // 转义字符
					this.token_b += this.char_b;
					this.char_b = GetChar();
				}
				
				if (this.char_a == quote_char) // 引号结束
					return ;
				
				continue;
			}
			
			if (comment_stat) {
				// 注释状态，全部输出
				if (this.token_b_type == this.COMMENT_TYPE_2) {
					// /*...*/每行前面的\t, ' '都要删掉
					if (line_begin && (this.char_a == '\t' || this.char_a == ' '))
						continue;
					else if (line_begin && this.char_a == '*')
						this.token_b += ' ';
					
					line_begin = false;
					
					if (this.char_a == '\n')
						line_begin = true;
				}
				this.token_b += this.char_a;
				
				if (comment_char == '*') {
					// 直到 */
					this.token_b_type = this.COMMENT_TYPE_2;
					if (this.char_a == '*' && this.char_b == '/') {
						this.token_b += this.char_b;
						this.char_b = GetChar();
						return ;
					}
				} else {
					// 直到换行
					this.token_b_type = this.COMMENT_TYPE_1;
					if (this.char_a == '\n')
						return ;
				}
				
				continue;
			}
			
			if (this.is_normal_char(this.char_a)) {
				this.token_b_type = this.STRING_TYPE;
				this.token_b += this.char_a;
				
				// 解决类似 82e-2, 442e+6, 555E-6 的问题
				// 因为这是立即数，所以只能符合以下的表达形式
				num_stat_old = num_stat;
				if (first_char || num_stat_old) // 只有之前是数字才改变状态
				{
					num_stat = this.is_num(this.char_a);
					first_char = false;
				}
				if (num_stat_old && !num_stat && (this.char_a == 'e' || this.char_a == 'E') &&
					(this.char_b == '-' || this.char_b == '+' || this.is_num(this.char_b))) {
					num_stat = true;
					if (this.char_b == '-' || this.char_b == '+') {
						this.token_b += this.char_b;
						this.char_b = GetChar();
					}
				}
				// Done here!
				
				if (!IsNormalChar(m_charB)) // loop until m_charB is not normal char
				{
					this.posneg = false;
					return ;
				}
			} else {
				if (IsBlankChar(m_charA))
					continue; // 忽略空白字符
				
				if (IsQuote(m_charA)) {
					// 引号
					bQuote = true;
					chQuote = m_charA;
					
					m_tokenBType = STRING_TYPE;
					m_tokenB.push_back(m_charA);
					continue;
				}
				
				if (IsComment()) {
					// 注释
					bComment = true;
					chComment = m_charB;
					
					//m_tokenBType = COMMENT_TYPE;
					m_tokenB.push_back(m_charA);
					continue;
				}
				
				if (IsSingleOper(m_charA) ||
					IsNormalChar(m_charB) || IsBlankChar(m_charB) || IsQuote(m_charB)) {
					m_tokenBType = OPER_TYPE;
					m_tokenB = m_charA; // 单字符符号
					return ;
				}
				
				// 多字符符号
				if (m_charB == '=' || m_charB == m_charA) {
					// 的确是多字符符号
					m_tokenBType = OPER_TYPE;
					m_tokenB.push_back(m_charA);
					m_tokenB.push_back(m_charB);
					m_charB = GetChar();
					if ((m_tokenB == "==" || m_tokenB == "!=" ||
							m_tokenB == "<<" || m_tokenB == ">>") && m_charB == '=') {
						// 三字符 ===, !==, <<=, >>=
						m_tokenB.push_back(m_charB);
						m_charB = GetChar();
					} else if (m_tokenB == ">>" && m_charB == '>') {
						// >>>, >>>=
						m_tokenB.push_back(m_charB);
						m_charB = GetChar();
						if (m_charB == '=') // >>>=
						{
							m_tokenB.push_back(m_charB);
							m_charB = GetChar();
						}
					}
					return ;
				} else {
					// 还是单字符的
					m_tokenBType = OPER_TYPE;
					m_tokenB = m_charA; // 单字符符号
					return ;
				}
				
				// What? How could we come here?
				m_charA = EOF;
				return ;
			}
		}
	}
}
 