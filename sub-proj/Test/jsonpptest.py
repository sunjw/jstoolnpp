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

TEST_CASE_DIR = 'jsonpp'
OUTPUT_FILE_NAME = 'out.json'

JSONPP_PATH_WIN = '../../trunk/debug/JsonPP.exe'
JSONPP_REL_PATH_WIN = '../../trunk/release/JsonPP.exe'
JSONPP_NODEJS_SCRIPT_PATH = '../JSToolJS/jsonppjsnode.js'

class NativeCaseRuntime(CaseRuntime):
    def __init__(self, runtime_path, sort):
        super(NativeCaseRuntime, self).__init__(runtime_path)
        self.out_file = OUTPUT_FILE_NAME
        self.sort = sort

    def _case_execute(self, test_case):
        if not self.sort:
            call([self.runtime_path, test_case.source, self.get_out_path_from_case(test_case)])
        else:
            call([self.runtime_path, '--sort', test_case.source, self.get_out_path_from_case(test_case)])

    def dump_name(self):
        log('NativeCaseRuntime')

class NodeCaseRuntime(CaseRuntime):
    def __init__(self, runtime_path, sort):
        super(NodeCaseRuntime, self).__init__(runtime_path)
        self.out_file = OUTPUT_FILE_NAME
        self.sort = sort

    def _case_execute(self, test_case):
        if not self.sort:
            call(['node', self.runtime_path, test_case.source, self.get_out_path_from_case(test_case)])
        else:
            call(['node', self.runtime_path, '--sort', test_case.source, self.get_out_path_from_case(test_case)])

    def dump_name(self):
        log('NodeCaseRuntime')

    def dump_version(self):
        call(['node', self.runtime_path, '--version'])
        log('node version: ')
        call(['node', '--version'])

class JSONPPCaseGenerator(CaseGenerator):
    def __init__(self, case_dir, sort_json):
        super(JSONPPCaseGenerator, self).__init__(case_dir)
        self.sort_json = sort_json

    def _is_result_file(self, file):
        filename_no_ext = os.path.splitext(file)[0]
        if not self.sort_json:
            if filename_no_ext.endswith('.test') and not filename_no_ext.endswith('.sort.test'):
                return True
        else:
            if filename_no_ext.endswith('.sort.test'):
                return True
        return False

    def _result_file_to_case_name(self, file):
        filename_no_ext = os.path.splitext(file)[0]
        case_name = ''
        if not self.sort_json:
            case_name = filename_no_ext[:-5] # remove .test
        else:
            case_name = filename_no_ext[:-10] # remove .sort.test
        return case_name

def main():
    release = False
    sort_json = False
    nodejs = False

    for argv in sys.argv:
        argv = argv.lower()
        if argv == 'node' or argv == 'nodejs':
            nodejs = True
        if argv == 'release' or argv == 'rel':
            release = True
        if argv == 'sort' or argv == 'sorted':
            sort_json = True

    if nodejs:
        release = False

    # system check
    if not nodejs and not is_windows_sys():
        log('JsonPP native test only supports Windows.')
        return

    # prepare path
    jsonpp_path_sel = ''
    jsonpp_nodejs_script_sel = ''

    if not nodejs:
        jsonpp_path_sel = JSONPP_PATH_WIN
        if release:
            jsonpp_path_sel = JSONPP_REL_PATH_WIN
    else:
        jsonpp_nodejs_script_sel = JSONPP_NODEJS_SCRIPT_PATH

    # make runtime
    case_runtime = 0
    if not nodejs:
        case_runtime = NativeCaseRuntime(jsonpp_path_sel, sort_json)
    else:
        case_runtime = NodeCaseRuntime(jsonpp_nodejs_script_sel, sort_json)

    # prepare cases
    case_generator = JSONPPCaseGenerator(TEST_CASE_DIR, sort_json)
    test_cases = case_generator.generate()

    # run cases
    start_time = current_millis()
    allpass = True
    idx = 1
    for name, case in test_cases.items():
        log('name: ' + name)
        log('source: ' + case.source)
        log('result: ' + case.result)
        log('running...')

        result = case_runtime.run_case(case)
        log('[%d/%d]' % (idx, len(test_cases)))
        log('')

        if result == 'ERROR':
            allpass = False
            break

        idx += 1

    end_time = current_millis()
    duration_time = (end_time - start_time) / 1000.0

    if allpass:
        log('%d cases ALL PASS, took %.2fs.' % (len(test_cases), duration_time))

    log('Test args: release=%r, nodejs=%r, sort=%r' % (release, nodejs, sort_json))
    log('')

    case_runtime.dump_name()
    case_runtime.dump_info()
    #case_runtime.dump_version()

if __name__ == '__main__':
    main()
