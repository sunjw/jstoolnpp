#include "jsonpp.h"
#include "jsonFileProc.h"

using namespace std;
using namespace sunjwbase;

JsonFileProc::JsonFileProc(const tstring& fileName)
{
	m_strFileName = tstrtostr(fileName);
}

void JsonFileProc::GetJsonValue(JsonValue& jsonValue)
{ 
	m_ifile.open(m_strFileName.c_str());
	if(m_ifile)
	{
		Go(jsonValue);
	}
	m_ifile.close();
}

void JsonFileProc::Save(const JsonValue& jsonValue)
{
	m_ofile.open(m_strFileName.c_str());
	if(m_ofile)
	{
		m_ofile << jsonValue.ToString();
	}
	m_ofile.close();
}

int JsonFileProc::GetChar()
{
	int ret = m_ifile.get();
	if(ret == EOF)
		return 0;
	return ret;
}
