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
import collections
from subprocess import call

JSFORMATTER_PATH_WIN = "../../../trunk/debug/JSFormatterTest.exe"
JSFORMATTER_REL_PATH_WIN = "../../../trunk/release/JSFormatterTest.exe"
JSFORMATTER_PATH_WIN_64 = "../../../trunk/x64/debug/JSFormatterTest.exe"
JSFORMATTER_REL_PATH_WIN_64 = "../../../trunk/x64/release/JSFormatterTest.exe"
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

	test_cases_ordered = collections.OrderedDict(sorted(test_cases.items()))

	return test_cases_ordered

def run_case(test_case, release):
	global JSFORMATTER_PATH_SEL

	result = "ERROR"

	# os.system(JSFORMATTER_PATH_SEL + " " + test_case.source + " out.js")
	call([JSFORMATTER_PATH_SEL, test_case.source, "out.js"])

	out_md5 = hashlib.md5(open("out.js").read()).hexdigest()
	result_md5 = hashlib.md5(open(test_case.result).read()).hexdigest()
	if out_md5 == result_md5:
		result = "PASS"

	print result
	return result

def dump_version():
	global JSFORMATTER_PATH_SEL

	call([JSFORMATTER_PATH_SEL, "--version"])

def main():
	global JSFORMATTER_PATH_SEL

	if not is_windows_sys() and not is_osx_sys():
		print "Unknown operating system."
		return

	files = list_file()
	test_cases = make_test_case(files)

	x64 = False
	release = False

	for argv in sys.argv:
		argv = argv.lower()
		if argv == "release":
			release = True
		if argv == "64" or argv == "x64":
			x64 = True

	JSFORMATTER_LIB_PATH_SEL = ""
	if is_osx_sys():
		x64 = False # no x64 on macOS
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
		JSFORMATTER_PATH_SEL = JSFORMATTER_PATH_MAC
		if release:
			JSFORMATTER_PATH_SEL = JSFORMATTER_REL_PATH_MAC

	# run cases
	start_time = current_millis()
	allpass = True
	idx = 1
	for name, case in test_cases.items():
		print "name: " + name
		print "source: " + case.source
		print "result: " + case.result
		print "running..."

		result = run_case(case, release)
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

	print "Test args: x64=%r, release=%r" % (x64, release)
	print ""

	if is_osx_sys():
		print "DYLD_LIBRARY_PATH=%s" % (os.environ["DYLD_LIBRARY_PATH"])
	else:
		print "Using %s" % (JSFORMATTER_PATH_SEL)

	dump_version()

if __name__ == '__main__':
	main()
