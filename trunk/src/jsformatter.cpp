#include "jsformatter.h"
#include "realjsformatter.h"
#include "jsfGenericIO.h"
#include "version.h"

//#define DEBUG_MEM_LEAK
#undef DEBUG_MEM_LEAK

#ifdef DEBUG_MEM_LEAK
#define _CRTDBG_MAP_ALLOC
#include <stdlib.h>
#include <crtdbg.h>
#endif

DLLAPI JSFormatter *CreateJSFormatter(void *ioContext,
							 ReadCharFunc readCharFunc, 
							 WriteCharFunc writeCharFunc,
							 const FormatterOption *option)
{
#ifdef DEBUG_MEM_LEAK
	_CrtSetDbgFlag(_CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF);
#endif

	JSFormatGenericIO *jsf = new JSFormatGenericIO(
		ioContext, readCharFunc, writeCharFunc, 
		FormatterOption(option->chIndent,
			option->nChPerInd,
			option->eCRRead,
			option->eCRPut,
			option->eBracNL,
			option->eEmpytIndent));

	return (JSFormatter *)jsf;
}

DLLAPI void ReleaseJSFormatter(JSFormatter *jsf)
{
	delete (RealJSFormatter *)jsf;
}

DLLAPI void FormatJavaScript(JSFormatter *jsf)
{
	((RealJSFormatter *)jsf)->Go();
}

DLLAPI void EnableJSFormatterDebug(JSFormatter *jsf)
{
	((RealJSFormatter *)jsf)->m_debug = true;
}

DLLAPI void DisableJSFormatterDebug(JSFormatter *jsf)
{
	((RealJSFormatter *)jsf)->m_debug = false;
}

DLLAPI const char *GetJSFormatterDebugOutput(JSFormatter *jsf)
{
	return ((RealJSFormatter *)jsf)->GetDebugOutput();
}

DLLAPI int GetFormattedLine(JSFormatter *jsf, int originalLine)
{
	return ((RealJSFormatter *)jsf)->GetFormattedLine(originalLine);
}

DLLAPI const char *GetVersion()
{
#ifdef _WIN64
	return VERSION_VALUE " x64";
#else
	return VERSION_VALUE;
#endif
}
