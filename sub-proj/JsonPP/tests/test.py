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

JSONPP_PATH_WIN = "../../../trunk/debug/JsonPP.exe"
JSONPP_REL_PATH_WIN = "../../../trunk/release/JsonPP.exe"

def is_windows_sys():
	return (platform.system() == "Windows")

def is_osx_sys():
	return (platform.system() == "Darwin")

def is_linux_sys():
	return (platform.system() == "Linux")

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
		out_md5 = hashlib.md5(open("out.js", "rb").read()).hexdigest()
		result_md5 = hashlib.md5(open(test_case.result, "rb").read()).hexdigest()
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
	release = False

	for argv in sys.argv:
		argv = argv.lower()
		if argv == "release":
			release = True

	# system check
	if not is_windows_sys():
		print "JsonPP test only supports Windows."
		return

	# prepare path
	jsonpp_path_sel = ""

	if is_windows_sys():
		jsonpp_path_sel = JSONPP_PATH_WIN
		if release:
			jsonpp_path_sel = JSONPP_REL_PATH_WIN

	# make runtime
	case_runtime = CaseRuntime(jsonpp_path_sel)

	# prepare cases
	files = list_file()
	test_cases = make_test_case(files)

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

	print "Test args: release=%r" % (release)
	print ""

	case_runtime.dump_name()
	case_runtime.dump_info()
	#case_runtime.dump_version()

if __name__ == '__main__':
	main()
