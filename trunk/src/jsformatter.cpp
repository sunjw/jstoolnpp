#include "jsformatter.h"
#include "realjsformatter.h"
#include "jsfGenericIO.h"
#include "version.h"

DLLAPI JSFormatter *CreateJSFormatter(void *ioContext,
							 ReadCharFunc readCharFunc, 
							 WriteCharFunc writeCharFunc,
							 const FormatterOption *option)
{
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
	delete (JSFormatGenericIO *)jsf;
}

DLLAPI void FormatJavaScript(JSFormatter *jsf)
{
	((JSFormatGenericIO *)jsf)->Go();
}

DLLAPI void EnableJSFormatterDebug(JSFormatter *jsf)
{
	((JSFormatGenericIO *)jsf)->m_debug = true;
}

DLLAPI void DisableJSFormatterDebug(JSFormatter *jsf)
{
	((JSFormatGenericIO *)jsf)->m_debug = false;
}

DLLAPI const char *GetJSFormatterDebugOutput(JSFormatter *jsf)
{
	return ((JSFormatGenericIO *)jsf)->GetDebugOutput();
}

DLLAPI int GetFormattedLine(JSFormatter *jsf, int originalLine)
{
	return ((JSFormatGenericIO *)jsf)->GetFormattedLine(originalLine);
}

DLLAPI const char *GetVersion()
{
	return VERSION_VALUE;
}
