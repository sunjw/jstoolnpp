#
# JSONPP test
# Author: Sun Junwen
# Date: 2014-01-04
#
import hashlib
import os
import sys
from subprocess import call

from util import *
from testbase import *

TEST_CASE_DIR = "jsonpp"
OUTPUT_FILE_NAME = "out.json"

JSONPP_PATH_WIN = "../../trunk/debug/JsonPP.exe"
JSONPP_REL_PATH_WIN = "../../trunk/release/JsonPP.exe"

class SortCaseRuntime(CaseRuntime):
    def __init__(self, runtime_path):
        super(SortCaseRuntime, self).__init__(runtime_path)
        self.out_file = OUTPUT_FILE_NAME

    def _case_execute(self, test_case):
        call([self.runtime_path, "--sort", test_case.source, self.get_out_path_from_case(test_case)])

class JSONPPCaseGenerator(CaseGenerator):
    def __init__(self, case_dir, sort_json):
        super(JSONPPCaseGenerator, self).__init__(case_dir)
        self.sort_json = sort_json



def make_test_case(files, sort_json):
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
        # filter test case by sort_json
        if not sort_json:
            if ".sort" in name:
                test_cases.pop(name, 0)
        else:
            # test ToStringSorted
            if ".sort" not in name:
                test_cases.pop(name, 0)

    test_cases_ordered = collections.OrderedDict(sorted(test_cases.items()))

    return test_cases_ordered

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
    case_runtime = 0
    if not sort_json:
        case_runtime = CaseRuntime(jsonpp_path_sel)
    else:
        case_runtime = SortCaseRuntime(jsonpp_path_sel)

    # prepare cases
    case_generator = CaseGenerator(TEST_CASE_DIR)
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

        if result == "ERROR":
            allpass = False
            break;

        print ""
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
