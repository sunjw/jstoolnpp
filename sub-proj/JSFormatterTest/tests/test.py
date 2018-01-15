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
JSFORMATTER_NODEJS_SCRIPT_PATH = "../../JSFormatterJS/jsfjsnode.js"

def is_windows_sys():
	return (platform.system() == "Windows")

def is_osx_sys():
	return (platform.system() == "Darwin")

def current_millis():
	return int(round(time.time() * 1000));

def list_file():
	files = [f for f in os.listdir('.') if os.path.isfile(f)]
	return files

class TestCase:
	source = ""
	result = ""

class CaseRuntime(object):
	def __init__(self, runtime_path):
		self.runtime_path = runtime_path

	def _case_execute(self, test_case):
		call([self.runtime_path, test_case.source, "out.js"])

	def _case_result(self, test_case):
		result = "ERROR"
		out_md5 = hashlib.md5(open("out.js").read()).hexdigest()
		result_md5 = hashlib.md5(open(test_case.result).read()).hexdigest()
		if out_md5 == result_md5:
			result = "PASS"

		print result
		return result

	def run_case(self, test_case):
		self._case_execute(test_case)
		return self._case_result(test_case)

	def dump_name(self):
		print "CaseRuntime"

	def dump_info(self):
		print "Using %s" % (self.runtime_path)

	def dump_version(self):
		call([self.runtime_path, "--version"])

class MacOSCaseRuntime(CaseRuntime):
	def __init__(self, runtime_path, lib_path):
		super(MacOSCaseRuntime, self).__init__(runtime_path)
		self.lib_path = lib_path
		os.environ["DYLD_LIBRARY_PATH"] = self.lib_path

	def dump_name(self):
		print "macOSCaseRuntime"

	def dump_info(self):
		print "DYLD_LIBRARY_PATH=%s" % (os.environ["DYLD_LIBRARY_PATH"])

class NodeCaseRuntime(CaseRuntime):
	def _case_execute(self, test_case):
		call(["node", self.runtime_path, test_case.source, "out.js"])

	def dump_name(self):
		print "NodeCaseRuntime"

	def dump_version(self):
		call(["node", self.runtime_path, "--version"])
		print "node version: "
		call(["node", "--version"])

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

def main():
	if not is_windows_sys() and not is_osx_sys():
		print "Unknown operating system."
		return

	files = list_file()
	test_cases = make_test_case(files)

	x64 = False
	release = False
	nodejs = False

	for argv in sys.argv:
		argv = argv.lower()
		if argv == "node" or argv == "nodejs":
			nodejs = True
			x64 = False
			release = False
			break
		if argv == "release":
			release = True
		if argv == "64" or argv == "x64":
			x64 = True

	jsformatter_path_sel = ""
	jsformatter_lib_path_sel = ""

	if nodejs == False:
		if is_osx_sys():
			x64 = False # no x64 on macOS
			jsformatter_lib_path_sel = JSFORMATTER_LIB_PATH_MAC
			if release:
				jsformatter_lib_path_sel = JSFORMATTER_LIB_REL_PATH_MAC

		if is_windows_sys():
			jsformatter_path_sel = JSFORMATTER_PATH_WIN
			if release and x64:
				jsformatter_path_sel = JSFORMATTER_REL_PATH_WIN_64
			elif x64:
				jsformatter_path_sel = JSFORMATTER_PATH_WIN_64
			elif release:
				jsformatter_path_sel = JSFORMATTER_REL_PATH_WIN
		elif is_osx_sys():
			jsformatter_path_sel = JSFORMATTER_PATH_MAC
			if release:
				jsformatter_path_sel = JSFORMATTER_REL_PATH_MAC
	else:
		jsformatter_path_sel = JSFORMATTER_NODEJS_SCRIPT_PATH

	# make runtime
	case_runtime = 0
	if nodejs == False:
		if is_windows_sys():
			case_runtime = CaseRuntime(jsformatter_path_sel)
		if is_osx_sys():
			case_runtime = MacOSCaseRuntime(jsformatter_path_sel, jsformatter_lib_path_sel)
	else:
		case_runtime = NodeCaseRuntime(jsformatter_path_sel)

	# run cases
	start_time = current_millis()
	allpass = True
	idx = 1
	for name, case in test_cases.items():
		print "name: " + name
		print "source: " + case.source
		print "result: " + case.result
		print "running..."

		result = case_runtime.run_case(case)
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

	print "Test args: nodejs=%r, x64=%r, release=%r" % (nodejs, x64, release)
	print ""

	case_runtime.dump_name()
	case_runtime.dump_info()
	case_runtime.dump_version()

if __name__ == '__main__':
	main()
