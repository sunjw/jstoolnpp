// JSMinConsole.cpp : 定义控制台应用程序的入口点。
//
#include <ctime>
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <stdexcept>

#include "jsonpp.h"
#include "jsonFileProc.h"

using namespace std;
using namespace sunjwbase;

int main(int argc, char* argv[])
{
	if(argc == 3)
	{
		char* inputFile = argv[1];
		char* outputFile = argv[2];

		try
		{
			tstring fileName = strtotstr(string(inputFile));
			JsonFileProc jfp(fileName);
			jfp.m_debugOutput = true;

			JsonValue jsonValue;
			jfp.GetJsonValue(jsonValue);

			//JsonUnsortedMap& jmap = jsonValue.GetMapValue()["web-app"].GetMapValue();
			//JsonValue& jval = jmap["xxx"];
			//JsonValue jvalNew("true");
			//jvalNew.SetValueType(JsonValue::BOOL_VALUE);
			//jval.MapPut("xxx2", jvalNew);

			jfp.Save(jsonValue);

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

