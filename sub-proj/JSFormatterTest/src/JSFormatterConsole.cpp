// JSMinConsole.cpp : 定义控制台应用程序的入口点。
//
#include <ctime>
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <stdexcept>

#include "jsformatter.h"

using namespace std;

class StreamIOContext
{
public:
	StreamIOContext(istream& i, ostream& o):
	in(i), out(o)
	{}

	static char ReadCharFromStream(void *ioContext);
	static void WriteCharFromStream(void *ioContext, const char ch);

private:
	istream& in;
	ostream& out;
};

char StreamIOContext::ReadCharFromStream(void *ioContext)
{
	StreamIOContext *streamIOCtx = (StreamIOContext *)ioContext;
	int ret = streamIOCtx->in.get();
	if(ret == EOF)
		return 0;
	return ret;
}

void StreamIOContext::WriteCharFromStream(void *ioContext, const char ch)
{
	StreamIOContext *streamIOCtx = (StreamIOContext *)ioContext;
	(streamIOCtx->out) << static_cast<char>(ch);
}

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
			FormatterOption option;
			option.chIndent = '\t';
			option.nChPerInd = 1;
#ifndef WIN32
			option.eCRPut = PUT_CR;
#endif
			option.eBracNL = NO_NEWLINE_BRAC;
			option.eEmpytIndent = NO_INDENT_IN_EMPTYLINE;

			StreamIOContext streamIOCtx(inFileStream2, outStrStream);

			JSFormatter *jsf = CreateJSFormatter(
							(void *)&(streamIOCtx), 
							StreamIOContext::ReadCharFromStream,
							StreamIOContext::WriteCharFromStream,
							&option);

			EnableJSFormatterDebug(jsf);

			FormatJavaScript(jsf);

			ReleaseJSFormatter(jsf);

			jsf = NULL;

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

