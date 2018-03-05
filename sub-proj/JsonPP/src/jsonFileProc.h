#ifndef _JSON_FILE_PROC_H_
#define _JSON_FILE_PROC_H_

#include "jsonpp.h"
#include "jsonparser.h"

class JsonFileProc: public JsonParser
{
public:
	explicit JsonFileProc(const sunjwbase::tstring& intputFile);

	void GetJsonValue(JsonValue& jsonValue);

	inline void Save(const JsonValue& jsonValue, const sunjwbase::tstring& outputFile)
	{ Save(jsonValue, outputFile, false); }
	void Save(const JsonValue& jsonValue, const sunjwbase::tstring& outputFile, bool sort);

private:
	std::string m_strInputFile;
	std::ifstream m_ifile;
	std::ofstream m_ofile;

	virtual int GetChar();
};

#endif
