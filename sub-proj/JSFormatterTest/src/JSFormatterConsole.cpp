// JSMinConsole.cpp : 定义控制台应用程序的入口点。
//
#include <ctime>
#include <iostream>
#include <fstream>
#include <sstream>
#include <streambuf>
#include <string>
#include <stdexcept>

//#define DEBUG_MEM_LEAK
#undef DEBUG_MEM_LEAK

#ifdef DEBUG_MEM_LEAK
#define _CRTDBG_MAP_ALLOC
#include <stdlib.h>
#include <crtdbg.h>
#endif

#include "jsformatter.h"

using namespace std;

class StreamIOContext
{
public:
	StreamIOContext(istream& i, ostream& o):
	in(i), out(o)
	{}

	static char ReadCharFromStream(void *ioContext);
	static void WriteCharToStream(void *ioContext, const char ch);

private:
	istream& in;
	ostream& out;
};

char StreamIOContext::ReadCharFromStream(void *ioContext)
{
	StreamIOContext *streamIOCtx = (StreamIOContext *)ioContext;
	char ch = 0;
	if (streamIOCtx->in.read(&ch, 1))
		return ch;
	return 0;
}

void StreamIOContext::WriteCharToStream(void *ioContext, const char ch)
{
	StreamIOContext *streamIOCtx = (StreamIOContext *)ioContext;
	(streamIOCtx->out) << static_cast<char>(ch);
}


void WriteStringToStream(void *ioContext, const char *outputString)
{
	*((ostream *)ioContext) << outputString;
}

#define USE_GENERIC_IO
//#undef USE_GENERIC_IO
//#define USE_STRING_IO
#undef USE_STRING_IO

int main(int argc, char *argv[])
{
#ifdef DEBUG_MEM_LEAK
	_CrtSetDbgFlag(_CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF);
#endif

	bool processed = false;
	if (argc == 3)
	{
		processed = true;

		char *inputFile = argv[1];
		char *outputFile = argv[2];

		ifstream inFileStream1(inputFile, ios::in | ios::binary);
		ofstream outFileStream1(outputFile);

		clock_t startClock = clock();

		string line;
		while (getline(inFileStream1, line))
		{
			outFileStream1 << line;
		}

		outFileStream1.close();
		inFileStream1.close();

		clock_t endClock = clock();
		double duration = (double)(endClock - startClock) / CLOCKS_PER_SEC;
		cout << "Read file time used: " << duration << "s" << endl;

		ifstream inFileStream2(inputFile, ios::in | ios::binary);
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

#if defined (USE_GENERIC_IO)
			StreamIOContext streamIOCtx(inFileStream2, outStrStream);

			JSFormatter *jsf = JSFCreateGenericIO(
							(void *)&(streamIOCtx), 
							StreamIOContext::ReadCharFromStream,
							StreamIOContext::WriteCharToStream,
							&option);
#elif defined (USE_STRING_IO)
			string strInput((istreambuf_iterator<char>(inFileStream2)), istreambuf_iterator<char>());

			JSFormatter *jsf = JSFCreateStringIO(
							(void *)&(outStrStream), 
							strInput.c_str(),
							WriteStringToStream,
							&option);
#endif

			JSFEnableDebug(jsf);

			JSFFormatJavaScript(jsf);

			JSFRelease(jsf);

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
	else if (argc == 2)
	{
		const char *argvCmd = argv[1];
		if (strcmp(argvCmd, "--version") == 0)
		{
			processed = true;
			cout << "libJSFormatter version: " << JSFGetVersion() << ", using ";
#if defined (USE_GENERIC_IO)
			cout << "JSFCreateGenericIO";
#elif defined (USE_STRING_IO)
			cout << "JSFCreateStringIO";
#endif
			cout << "." << endl;
		}
	}


	if (!processed)
	{
		cout << "Usage: jsformatter [input file] [output file]" << "\n\n"
			<< "  --version	Display version info." << endl;
	}


	return 0;
}

