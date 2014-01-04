#
# Auto test for JSFormatter
# Author: Sun Junwen
# Date: 2014-01-04
#
import hashlib
import os
import sys

JSFORMATTER_PATH = "..\\..\\..\\trunk\\debug\\JSFormatter.exe"
JSFORMATTER_REL_PATH = "..\\..\\..\\trunk\\release\\JSFormatter.exe"
JSFORMATTER_PATH_SEL = ""

class TestCase:
    source = ""
    result = ""

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
	JSFORMATTER_PATH_SEL = JSFORMATTER_PATH
	if release:
		JSFORMATTER_PATH_SEL = JSFORMATTER_REL_PATH
	
	result = "ERROR"
	
	os.system(JSFORMATTER_PATH_SEL + " " + test_case.source + " out.js")
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
	
	print "Using " + JSFORMATTER_PATH_SEL
	print "%d cases" % len(test_cases)
	print "ALL PASS"

if __name__ == '__main__':
	main()
