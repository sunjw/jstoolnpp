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

int main(int argc, char *argv[])
{
	if(argc == 3)
	{
		char *inputFile = argv[1];
		char *outputFile = argv[2];

		try
		{
			tstring fileName = strtotstr(string(inputFile));
			JsonFileProc jfp(fileName);
			jfp.m_debugOutput = true;

			JsonValue jsonValue;
			jfp.GetJsonValue(jsonValue);

			//JsonValue& jval = jsonValue["web-app"]["taglib"];
			//JsonValue jvalNew("operator");
			///*jvalNew.SetValueType(JsonValue::ARRAY_VALUE);
			//jvalNew.ArrayPut(JsonValue("test1"));
			//jvalNew.ArrayPut(JsonValue("test4"));
			//jvalNew.ArrayPut(JsonValue("test3"));*/

			//jval["xxx2"][3] = jvalNew;

			/*JsonValue& jval = jsonValue["web-app"];
			JsonUnsortedMap& jmap = jval.GetMapValue();
			JsonUnsortedMap::iterator itr = jmap.find("txxx");
			jmap.insert(itr, JsonMapPair("taglib", JsonValue("xxxxx")));*/

			//jfp.Save(jsonValue);

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

