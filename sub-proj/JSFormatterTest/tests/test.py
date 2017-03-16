#
# Auto test for JSFormatter
# Author: Sun Junwen
# Date: 2014-01-04
#
import hashlib
import os
import platform
import sys
import time
from subprocess import call

JSFORMATTER_PATH_WIN = "..\\..\\..\\trunk\\debug\\JSFormatterTest.exe"
JSFORMATTER_REL_PATH_WIN = "..\\..\\..\\trunk\\release\\JSFormatterTest.exe"
JSFORMATTER_PATH_WIN_64 = "..\\..\\..\\trunk\\x64\\debug\\JSFormatterTest.exe"
JSFORMATTER_REL_PATH_WIN_64 = "..\\..\\..\\trunk\\x64\\release\\JSFormatterTest.exe"
JSFORMATTER_LIB_PATH_MAC = "../../../trunk/DerivedData/JSTool/Build/Products/Debug"
JSFORMATTER_LIB_REL_PATH_MAC = "../../../trunk/DerivedData/JSTool/Build/Products/Release"
JSFORMATTER_PATH_MAC = "../../../trunk/DerivedData/JSTool/Build/Products/Debug/JSFormatterTest"
JSFORMATTER_REL_PATH_MAC = "../../../trunk/DerivedData/JSTool/Build/Products/Release/JSFormatterTest"
JSFORMATTER_NODEJS_LIB_PATH_MAC = "../../../trunk/DerivedData/JSTool/Build/Products/Release/libJSFormatter.dylib"
JSFORMATTER_NODEJS_PATH_MAC = "../../JSFNodeJS/jsfnode.js"

JSFORMATTER_PATH_SEL = ""

class TestCase:
	source = ""
	result = ""

def is_windows_sys():
	return (platform.system() == "Windows")

def is_osx_sys():
	return (platform.system() == "Darwin")

def current_millis():
	return int(round(time.time() * 1000));

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

def run_case(test_case, release, nodejs):
	global JSFORMATTER_PATH_SEL
	global JSFORMATTER_NODEJS_LIB_PATH_MAC
	
	result = "ERROR"
	
	if nodejs == False:
		call([JSFORMATTER_PATH_SEL, test_case.source, "out.js"])
	else:
		call(["node", JSFORMATTER_PATH_SEL, JSFORMATTER_NODEJS_LIB_PATH_MAC, test_case.source, "out.js"])

	out_md5 = hashlib.md5(open("out.js").read()).hexdigest()
	result_md5 = hashlib.md5(open(test_case.result).read()).hexdigest()
	if out_md5 == result_md5:
		result = "PASS"
	
	print result
	return result

def dump_version(nodejs):
	global JSFORMATTER_PATH_SEL
	global JSFORMATTER_NODEJS_LIB_PATH_MAC

	if nodejs == False:
		call([JSFORMATTER_PATH_SEL, "--version"])
	else:
		call(["node", JSFORMATTER_PATH_SEL, JSFORMATTER_NODEJS_LIB_PATH_MAC, "--version"])

def main():
	global JSFORMATTER_PATH_SEL

	files = list_file()
	test_cases = make_test_case(files)
	x64 = False
	release = False
	nodejs = False
	
	if is_windows_sys():
		if len(sys.argv) == 2:
			if sys.argv[1] == "release":
				release = True
			elif sys.argv[1] == "64":
				x64 = True

		if len(sys.argv) == 3 and ((sys.argv[1] == "release" and sys.argv[2] == "64") or (sys.argv[2] == "release" and sys.argv[1] == "64")):
			release = True
			x64 = True
	elif is_osx_sys():
		if len(sys.argv) == 2:
			if sys.argv[1] == "release":
				release = True
			elif sys.argv[1] == "nodejs":
				nodejs = True
	else:
		print "Unknown operating system."
		return
	
	JSFORMATTER_LIB_PATH_SEL = ""
	if is_osx_sys() and nodejs == False:
		JSFORMATTER_LIB_PATH_SEL = JSFORMATTER_LIB_PATH_MAC
		if release:
			JSFORMATTER_LIB_PATH_SEL = JSFORMATTER_LIB_REL_PATH_MAC

		os.environ["DYLD_LIBRARY_PATH"] = JSFORMATTER_LIB_PATH_SEL

	if is_windows_sys():
		JSFORMATTER_PATH_SEL = JSFORMATTER_PATH_WIN
		if release and x64:
			JSFORMATTER_PATH_SEL = JSFORMATTER_REL_PATH_WIN_64
		elif x64:
			JSFORMATTER_PATH_SEL = JSFORMATTER_PATH_WIN_64
		elif release:
			JSFORMATTER_PATH_SEL = JSFORMATTER_REL_PATH_WIN
	elif is_osx_sys():
		if nodejs == False:
			JSFORMATTER_PATH_SEL = JSFORMATTER_PATH_MAC
			if release:
				JSFORMATTER_PATH_SEL = JSFORMATTER_REL_PATH_MAC
		else:
			JSFORMATTER_PATH_SEL = JSFORMATTER_NODEJS_PATH_MAC

	# run cases
	start_time = current_millis()
	allpass = True
	idx = 1
	for name, case in test_cases.items():
		print "name: " + name
		print "source: " + case.source
		print "result: " + case.result
		print "running..."
		
		result = run_case(case, release, nodejs)
		print "[%d/%d]" % (idx, len(test_cases))
		
		if result == "ERROR":
			allpass = False
			break;
		
		print ""
		idx += 1

	end_time = current_millis()
	duration_time = (end_time - start_time) / 1000.0

	if allpass:
		print "%d cases ALL PASS, took %.2fs." % (len(test_cases), duration_time)

	print ""
	if is_osx_sys() and nodejs == False:
		print "DYLD_LIBRARY_PATH=" + os.environ["DYLD_LIBRARY_PATH"]
	if nodejs == False:
		print "Using " + JSFORMATTER_PATH_SEL
	else:
		print "Using " + JSFORMATTER_PATH_SEL + " with " + JSFORMATTER_NODEJS_LIB_PATH_MAC
	dump_version(nodejs)

if __name__ == '__main__':
	main()
