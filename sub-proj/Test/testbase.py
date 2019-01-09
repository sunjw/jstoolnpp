#
# Base test
# Author: Sun Junwen
# Date: 2019-01-09
#
import collections
import hashlib
import os
from subprocess import call

from util import *

OUTPUT_FILE_NAME = "out.js"

class TestCase:
    case_dir = ""
    source = ""
    result = ""

class CaseGenerator(object):
    def __init__(self, case_dir):
        self.case_dir = case_dir

    def _make_test_case(self, files):
        test_cases = {}

        for file in files:
            file = os.path.join(self.case_dir, file)
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
            else:
                case.case_dir = self.case_dir

        test_cases_ordered = collections.OrderedDict(sorted(test_cases.items()))

        return test_cases_ordered

    def generate(self):
        files = list_file(self.case_dir)
        return self._make_test_case(files)

class CaseRuntime(object):
    def __init__(self, runtime_path):
        self.runtime_path = runtime_path
        self.out_file = OUTPUT_FILE_NAME

    def _case_execute(self, test_case):
        call([self.runtime_path, test_case.source, self.get_out_path_from_case(test_case)])

    def _case_result(self, test_case):
        result = "ERROR"
        out_md5 = hashlib.md5(open(self.get_out_path_from_case(test_case), "rb").read()).hexdigest()
        result_md5 = hashlib.md5(open(test_case.result, "rb").read()).hexdigest()
        if out_md5 == result_md5:
            result = "PASS"

        print result
        return result

    def run_case(self, test_case):
        self._case_execute(test_case)
        return self._case_result(test_case)

    def get_out_path_from_case(self, test_case):
        return os.path.join(test_case.case_dir, self.out_file)

    def dump_name(self):
        print "CaseRuntime"

    def dump_info(self):
        print "Using %s" % (self.runtime_path)

    def dump_version(self):
        call([self.runtime_path, "--version"])
