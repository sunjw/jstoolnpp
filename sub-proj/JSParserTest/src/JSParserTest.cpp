#include <iostream>
#include <fstream>
#include "JSTokenDump.h"

using namespace std;

int main(int argc, char *argv[])
{
	if (argc != 3)
	{
		cout << "Usage: JSParserTest [input file] [output file]" << endl;
		return 0;
	}

	char *inputFile = argv[1];
	char *outputFile = argv[2];

	ifstream inFileStream(inputFile, ios::in | ios::binary);
	ofstream outFileStream(outputFile);

	JSTokenDump jsTokenDump(inFileStream, outFileStream);
	jsTokenDump.Go();

	return 0;
}

