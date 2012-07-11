#ifndef _JSON_FILE_PROC_H_
#define _JSON_FILE_PROC_H_

#include "jsonpp.h"
#include "jsonparser.h"

class JsonFileProc: public JsonParser
{
public:
	explicit JsonFileProc(const sunjwbase::tstring& fileName);

	void GetJsonValue(JsonValue& jsonValue);
	void Save(const JsonValue& jsonValue);

private:
	std::string m_strFileName;
	std::ifstream m_ifile;
	std::ofstream m_ofile;

	virtual int GetChar();
};

#endif
