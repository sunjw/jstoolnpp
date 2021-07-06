#include "jsonpp.h"
#include "jsonFileProc.h"

using namespace std;
using namespace sunjwbase;

JsonFileProc::JsonFileProc(const tstring& intputFile)
{
	m_strInputFile = tstrtostr(intputFile);
}

void JsonFileProc::GetJsonValue(JsonValue& jsonValue)
{ 
	m_ifile.open(m_strInputFile.c_str());
	if (m_ifile)
	{
		Go(jsonValue);
	}
	m_ifile.close();
}

void JsonFileProc::Save(const JsonValue& jsonValue, const tstring& outputFile, bool sort)
{
	m_ofile.open(tstrtostr(outputFile).c_str());
	if (m_ofile)
	{
		if (!sort)
		{
			m_ofile << jsonValue.ToString();
		}
		else
		{
			m_ofile << jsonValue.ToStringSorted();
		}
	}
	m_ofile.close();
}

int JsonFileProc::GetChar()
{
	int ret = m_ifile.get();
	if (ret == EOF)
	{
		return 0;
	}
	return ret;
}
