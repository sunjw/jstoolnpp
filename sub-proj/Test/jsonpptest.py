#
# JSONPP test
# Author: Sun Junwen
# Date: 2014-01-04
#
import os
import sys
from subprocess import call

from util import *
from testbase import *

TEST_CASE_DIR = "jsonpp"
OUTPUT_FILE_NAME = "out.json"

JSONPP_PATH_WIN = "../../trunk/debug/JsonPP.exe"
JSONPP_REL_PATH_WIN = "../../trunk/release/JsonPP.exe"

class NativeCaseRuntime(CaseRuntime):
    def __init__(self, runtime_path, sort):
        super(NativeCaseRuntime, self).__init__(runtime_path)
        self.out_file = OUTPUT_FILE_NAME
        self.sort = sort

    def _case_execute(self, test_case):
        if not self.sort:
            call([self.runtime_path, test_case.source, self.get_out_path_from_case(test_case)])
        else:
            call([self.runtime_path, "--sort", test_case.source, self.get_out_path_from_case(test_case)])

class JSONPPCaseGenerator(CaseGenerator):
    def __init__(self, case_dir, sort_json):
        super(JSONPPCaseGenerator, self).__init__(case_dir)
        self.sort_json = sort_json

    def _is_result_file(self, file):
        filename_no_ext = os.path.splitext(file)[0]
        if not self.sort_json:
            if filename_no_ext.endswith(".test") and not filename_no_ext.endswith(".sort.test"):
                return True
        else:
            if filename_no_ext.endswith(".sort.test"):
                return True
        return False

    def _result_file_to_case_name(self, file):
        filename_no_ext = os.path.splitext(file)[0]
        case_name = ""
        if not self.sort_json:
            case_name = filename_no_ext[:-5] # remove .test
        else:
            case_name = filename_no_ext[:-10] # remove .sort.test
        return case_name

def main():
    release = False
    sort_json = False

    for argv in sys.argv:
        argv = argv.lower()
        if argv == "release":
            release = True
        if argv == "sort" or argv == "sorted":
            sort_json = True

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
    case_runtime = NativeCaseRuntime(jsonpp_path_sel, sort_json)

    # prepare cases
    case_generator = JSONPPCaseGenerator(TEST_CASE_DIR, sort_json)
    test_cases = case_generator.generate()

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
        print ""

        if result == "ERROR":
            allpass = False
            break

        idx += 1

    end_time = current_millis()
    duration_time = (end_time - start_time) / 1000.0

    if allpass:
        print "%d cases ALL PASS, took %.2fs." % (len(test_cases), duration_time)

    print "Test args: release=%r, sort=%r" % (release, sort_json)
    print ""

    case_runtime.dump_name()
    case_runtime.dump_info()
    #case_runtime.dump_version()

if __name__ == '__main__':
    main()
