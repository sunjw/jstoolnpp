/*
 * IniFileProcessor class header file
 * Author: Sun Junwen
 * Version: 1.0
 */
#ifndef _INI_FILE_PROCESSOR_H_
#define _INI_FILE_PROCESSOR_H_

#include "strconvert.h"
#include "IniProcessor.h"

using namespace std;

class IniFileProcessor: public IniProcessor
{
public:
	/*
	 * Constructor
	 * Specific the ini file name
	 */
	IniFileProcessor(tstring fileName)
	{
		#if defined(UNICODE) || defined(_UNICODE)
		m_strFileName = wstrtostr(fileName);
		#else
		m_strFileName = fileName;
		#endif
	}

	virtual void Save();

	inline IniMap GetInfo(bool bSection)
	{ return GetInfo(bSection, true); }

	IniProcessor::IniMap GetInfo(bool bProcSection, bool bRefresh);

private:
	string m_strFileName;
};

#endif
