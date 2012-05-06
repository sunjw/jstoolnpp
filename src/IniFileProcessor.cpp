/*
 * IniFileProcessor class implementation file
 * Author: Sun Junwen
 * Version: 1.0.1
 */
#include <cstdlib>
#include <string>
#include <fstream>

#include "IniFileProcessor.h"

using namespace std;

void IniFileProcessor::Save()
{
	ofstream out(m_strFileName.c_str());

	if(out)
	{
		out << ToString();
	}

	out.close();
}
	
IniProcessor::IniMap IniFileProcessor::GetInfo(bool bProcSection, bool bRefresh)
{
	ifstream m_in(m_strFileName.c_str());
	return IniProcessor::GetInfo(m_in, bProcSection, bRefresh);
}
