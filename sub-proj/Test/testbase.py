#
# Base test
# Author: Sun Junwen
# Date: 2019-01-09
#
import hashlib
import os
from subprocess import call

from util import *

OUTPUT_FILE_NAME = "out.js"

class TestCase:
    case_dir = ""
    source = ""
    result = ""

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
