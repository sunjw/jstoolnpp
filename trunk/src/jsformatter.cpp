#include "jsformatter.h"
#include "realjsformatter.h"
#include "jsfGenericIO.h"

DLLAPI void FormatJavaScript(void *ioContext,
							 ReadCharFunc readCharFunc, 
							 WriteCharFunc writeCharFunc,
							 const FormatterOption *option)
{
	JSFormatGenericIO jsf(ioContext, readCharFunc, writeCharFunc, 
							FormatterOption(option->chIndent,
											option->nChPerInd,
											option->eCRRead,
											option->eCRPut,
											option->eBracNL,
											option->eEmpytIndent));
	jsf.Go();
}
