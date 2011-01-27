#include <Windows.h>
#include <tchar.h>
#include "Shlwapi.h"

#include "PluginInterface.h"
#include "IniFileProcessor.h"
#include "utility.h"

tstring GetConfigFilePath(HWND nppHandle)
{
	tstring strConfigFilePath;

	TCHAR szConfigDir[MAX_PATH];
	TCHAR szBuffer[MAX_PATH];
	szConfigDir[0] = 0;
	::SendMessage(nppHandle, NPPM_GETPLUGINSCONFIGDIR, 
		MAX_PATH, (LPARAM)szConfigDir);
	::PathCombine(szBuffer, szConfigDir, TEXT("JSMinNpp.ini"));
	strConfigFilePath = szBuffer;

	return strConfigFilePath;
}

void loadOption(HWND nppHandle, bool &bPutCR, char &chIndent, int &nChPerInd)
{
	loadDefaultOption(bPutCR, chIndent, nChPerInd);
	tstring tsConfigFilePath = GetConfigFilePath(nppHandle);

	IniFileProcessor processor(tsConfigFilePath);
	IniFileProcessor::IniMap map;

	map = processor.GetInfo(true);
	IniFileProcessor::IniMap::iterator itrEnd = map.end();

	if(map.find(keyPutCR) != itrEnd)
	{
		if(!map[keyPutCR].GetStrValue().compare("0"))
			bPutCR = false;
	}

	if(map.find(keyChIndent) != itrEnd)
	{
		string strIndent = map[keyChIndent].GetStrValue();
		if(!strIndent.compare("tab"))
			chIndent = '\t';
		else if(!strIndent.compare("space"))
			chIndent = ' ';
	}

	if(chIndent == ' ' && map.find(keyChPerInd) != itrEnd)
	{
		nChPerInd = atoi(map[keyChPerInd].GetStrValue().c_str());
	}
}

void loadDefaultOption(bool &bPutCR, char &chIndent, int &nChPerInd)
{
	bPutCR = true;
	chIndent = '\t';
	nChPerInd = 1;
}

void saveOption(HWND nppHandle, bool bPutCR, char chIndent, int nChPerInd)
{
	tstring tsConfigFilePath = GetConfigFilePath(nppHandle);

	IniFileProcessor processor(tsConfigFilePath);
	IniFileProcessor::IniMap map;
	
	map[keyPutCR] = bPutCR ? string("1") : string("0");
	map[keyChIndent] = chIndent == '\t' ? string("tab") : string("space");
	if(chIndent == '\t')
	{
		map[keyChPerInd] = string("1");
	}
	else
	{
		char buffer[256];
		itoa(nChPerInd, buffer, 10);
		map[keyChPerInd] = string(buffer);
	}

	processor.SetMap(map);

	processor.Save();
}
