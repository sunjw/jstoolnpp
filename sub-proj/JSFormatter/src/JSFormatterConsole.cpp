// JSMinConsole.cpp : 定义控制台应用程序的入口点。
//
#include <ctime>
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <stdexcept>

#include "jsfStream.h"

using namespace std;

int main(int argc, char *argv[])
{
	if(argc == 3)
	{
		char *inputFile = argv[1];
		char *outputFile = argv[2];

		ifstream inFileStream1(inputFile);
		ofstream outFileStream1(outputFile);

		clock_t startClock = clock();

		string line;
		while(getline(inFileStream1, line))
		{
		    outFileStream1 << line;
		}

		outFileStream1.close();
		inFileStream1.close();

		clock_t endClock = clock();
		double duration = (double)(endClock - startClock) / CLOCKS_PER_SEC;
		cout << "Read file time used: " << duration << "s" << endl;

		ifstream inFileStream2(inputFile);
		ofstream outFileStream2(outputFile);
	    ostringstream outStrStream;
		try
		{
			JSFormatterStream::FormatterOption option;
			option.chIndent = '\t';
			option.nChPerInd = 1;
#ifndef WIN32
			option.eCRPut = JSFormatterStream::PUT_CR;
#endif
			option.eBracNL = JSFormatterStream::NO_NEWLINE_BRAC;
			option.eEmpytIndent = JSFormatterStream::NO_INDENT_IN_EMPTYLINE;

			JSFormatterStream jsf(inFileStream2, outStrStream, option);
			jsf.m_debug = true;
			jsf.Go();

			string output = outStrStream.str();

			// 输出到文件
			outFileStream2 << output;

			outFileStream2.close();
			inFileStream2.close();

			cout << "Done" << endl;
		}
		catch(runtime_error ex)
		{
			cout << "Error: " << ex.what() << endl;
		}
	}
	else
	{
		cout << "Usage: jsformatter [input file] [output file]" << endl;
	}


    return 0;
}

