#
# Auto test for JSFormatter
# Author: Sun Junwen
# Date: 2014-01-04
#
import hashlib
import os
import platform
import sys
from subprocess import call

JSFORMATTER_PATH_WIN = "..\\..\\..\\trunk\\debug\\JSFormatterTest.exe"
JSFORMATTER_REL_PATH_WIN = "..\\..\\..\\trunk\\release\\JSFormatterTest.exe"
JSFORMATTER_LIB_PATH_MAC = "../../../trunk/DerivedData/JSTool/Build/Products/Debug"
JSFORMATTER_LIB_REL_PATH_MAC = "../../../trunk/DerivedData/JSTool/Build/Products/Release"
JSFORMATTER_PATH_MAC = "../../../trunk/DerivedData/JSTool/Build/Products/Debug/JSFormatterTest"
JSFORMATTER_REL_PATH_MAC = "../../../trunk/DerivedData/JSTool/Build/Products/Release/JSFormatterTest"

JSFORMATTER_PATH_SEL = ""

class TestCase:
	source = ""
	result = ""
	
def is_windows_sys():
	return (platform.system() == "Windows")

def is_osx_sys():
	return (platform.system() == "Darwin")

def list_file():
	files = [f for f in os.listdir('.') if os.path.isfile(f)]
	return files

def make_test_case(files):
	test_cases = {}
	
	for file in files:
		# base name
		fname = os.path.splitext(file)[0]
		#print fname
		fname_part = fname.split('.')
		if fname_part[len(fname_part) - 1] == "test":
			# case result
			case_name = fname[:-5] # remove .test
			
			if not (case_name in test_cases):
				test_cases[case_name] = TestCase()
			
			test_cases[case_name].result = file
		else:
			if not (fname in test_cases):
				test_cases[fname] = TestCase()
			
			test_cases[fname].source = file
	
	for name, case in test_cases.items():
		if case.source == "" or case.result == "":
			test_cases.pop(name, 0)
	
	return test_cases

def run_case(test_case, release):
	global JSFORMATTER_PATH_SEL
	
	if is_windows_sys():
		JSFORMATTER_PATH_SEL = JSFORMATTER_PATH_WIN
		if release:
			JSFORMATTER_PATH_SEL = JSFORMATTER_REL_PATH_WIN
	else:
		JSFORMATTER_PATH_SEL = JSFORMATTER_PATH_MAC
		if release:
			JSFORMATTER_PATH_SEL = JSFORMATTER_REL_PATH_MAC
	
	result = "ERROR"
	
	# os.system(JSFORMATTER_PATH_SEL + " " + test_case.source + " out.js")
	call([JSFORMATTER_PATH_SEL, test_case.source, "out.js"])
	out_md5 = hashlib.md5(open("out.js").read()).hexdigest()
	result_md5 = hashlib.md5(open(test_case.result).read()).hexdigest()
	if out_md5 == result_md5:
		result = "PASS"
	
	print result
	return result

def main():
	files = list_file()
	test_cases = make_test_case(files)
	release = False
	
	if len(sys.argv) == 2 and sys.argv[1] == "release":
		release = True
	
	JSFORMATTER_LIB_PATH_SEL = ""
	if is_osx_sys():
		JSFORMATTER_LIB_PATH_SEL = JSFORMATTER_LIB_PATH_MAC
		if release:
			JSFORMATTER_LIB_PATH_SEL = JSFORMATTER_LIB_REL_PATH_MAC

		os.environ["DYLD_LIBRARY_PATH"] = JSFORMATTER_LIB_PATH_SEL
	
	# run cases
	for name, case in test_cases.items():
		print "name: " + name
		print "source: " + case.source
		print "result: " + case.result
		print "running..."
		
		result = run_case(case, release)
		if result == "ERROR":
			return;
		
		print ""

	print "%d cases PASS" % len(test_cases)

	print ""
	if is_osx_sys():
		print "DYLD_LIBRARY_PATH=" + os.environ["DYLD_LIBRARY_PATH"]
	print "Using " + JSFORMATTER_PATH_SEL
	call([JSFORMATTER_PATH_SEL, "--version"])

if __name__ == '__main__':
	main()
