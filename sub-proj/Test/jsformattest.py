#
# JSFormatter test
# Author: Sun Junwen
# Date: 2014-01-04
#
import hashlib
import os
import sys
from subprocess import call

from util import *
from testbase import *

TEST_CASE_DIR = "jsformat"

JSFORMATTER_PATH_WIN = "../../trunk/debug/JSFormatterTest.exe"
JSFORMATTER_REL_PATH_WIN = "../../trunk/release/JSFormatterTest.exe"
JSFORMATTER_PATH_WIN_64 = "../../trunk/x64/debug/JSFormatterTest.exe"
JSFORMATTER_REL_PATH_WIN_64 = "../../trunk/x64/release/JSFormatterTest.exe"
JSFORMATTER_LIB_PATH_MAC = "../../trunk/DerivedData/JSTool/Build/Products/Debug"
JSFORMATTER_LIB_REL_PATH_MAC = "../../trunk/DerivedData/JSTool/Build/Products/Release"
JSFORMATTER_PATH_MAC = "../../trunk/DerivedData/JSTool/Build/Products/Debug/JSFormatterTest"
JSFORMATTER_REL_PATH_MAC = "../../trunk/DerivedData/JSTool/Build/Products/Release/JSFormatterTest"
JSFORMATTER_NODEJS_SCRIPT_PATH = "../JSToolJS/jsfjsnode.js"

class MacOSCaseRuntime(CaseRuntime):
    def __init__(self, runtime_path, lib_path):
        super(MacOSCaseRuntime, self).__init__(runtime_path)
        self.lib_path = lib_path
        os.environ["DYLD_LIBRARY_PATH"] = self.lib_path

    def dump_name(self):
        log("macOSCaseRuntime")

    def dump_info(self):
        log("DYLD_LIBRARY_PATH=%s" % (os.environ["DYLD_LIBRARY_PATH"]))

class NodeCaseRuntime(CaseRuntime):
    def _case_execute(self, test_case):
        call(["node", self.runtime_path, test_case.source, self.get_out_path_from_case(test_case)])

    def dump_name(self):
        log("NodeCaseRuntime")

    def dump_version(self):
        call(["node", self.runtime_path, "--version"])
        log("node version: ")
        call(["node", "--version"])

class ValidateCaseRuntime(CaseRuntime):
    def __init__(self, runtime_path, nodejs_script_path):
        super(ValidateCaseRuntime, self).__init__(runtime_path)
        self.nodejs_script_path = nodejs_script_path
        self.out_cpp = "outcpp.js"
        self.out_js = "outjs.js"

    def _case_execute(self, test_case):
        log("Call cpp...")
        call([self.runtime_path, test_case.source, os.path.join(test_case.case_dir, self.out_cpp)])
        log("Call node...")
        call(["node", self.nodejs_script_path, test_case.source, os.path.join(test_case.case_dir, self.out_js)])

    def _case_result(self, test_case):
        result = "ERROR"
        outcpp_md5 = hashlib.md5(open(os.path.join(test_case.case_dir, self.out_cpp), "rb").read()).hexdigest()
        outjs_md5 = hashlib.md5(open(os.path.join(test_case.case_dir, self.out_js), "rb").read()).hexdigest()
        if outcpp_md5 == outjs_md5:
            result = "PASS"

        log(result)
        return result

    def dump_name(self):
        log("ValidateCaseRuntime")

    def dump_info(self):
        log("%s vs. %s" % (self.runtime_path, self.nodejs_script_path))

    def dump_version(self):
        call([self.runtime_path, "--version"])
        call(["node", self.nodejs_script_path, "--version"])
        log("node version: ")
        call(["node", "--version"])

def main():
    x64 = False
    release = False
    nodejs = False
    validate = False

    for argv in sys.argv:
        argv = argv.lower()
        if argv == "node" or argv == "nodejs":
            nodejs = True
            x64 = False
            release = False
            validate = False
            break
        if argv == "validate":
            validate = True
            x64 = False
            release = False
            nodejs = False
            break
        if argv == "release":
            release = True
        if argv == "64" or argv == "x64":
            x64 = True

    # system check
    if nodejs == False:
        if not is_windows_sys() and not is_osx_sys():
            if is_linux_sys():
                log("Only node support Linux.")
            else:
                log("Unknown operating system.")
            return
    else:
        if not is_windows_sys() and not is_osx_sys() and not is_linux_sys():
            log("Unknown operating system.")
            return

    # prepare path
    jsformatter_path_sel = ""
    jsformatter_lib_path_sel = ""
    jsformatter_nodejs_script_sel = ""

    if nodejs == False and validate == False:
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
        if is_osx_sys():
            jsformatter_path_sel = JSFORMATTER_PATH_MAC
            if release:
                jsformatter_path_sel = JSFORMATTER_REL_PATH_MAC
    if validate:
        # validate test only support Windows x64 relase build
        jsformatter_path_sel = JSFORMATTER_REL_PATH_WIN_64
    if nodejs or validate:
        jsformatter_nodejs_script_sel = JSFORMATTER_NODEJS_SCRIPT_PATH

    # make runtime
    case_runtime = 0
    if nodejs == False and validate == False:
        if is_windows_sys():
            case_runtime = CaseRuntime(jsformatter_path_sel)
        if is_osx_sys():
            case_runtime = MacOSCaseRuntime(jsformatter_path_sel, jsformatter_lib_path_sel)
    if nodejs:
        case_runtime = NodeCaseRuntime(jsformatter_nodejs_script_sel)
    if validate:
        if is_osx_sys():
            log("Validate only support Windows.")
            return
        case_runtime = ValidateCaseRuntime(jsformatter_path_sel, jsformatter_nodejs_script_sel)

    # prepare cases
    case_generator = CaseGenerator(TEST_CASE_DIR)
    test_cases = case_generator.generate()

    # run cases
    start_time = current_millis()
    allpass = True
    idx = 1
    for name, case in test_cases.items():
        log("name: " + name)
        log("source: " + case.source)
        log("result: " + case.result)
        log("running...")

        result = case_runtime.run_case(case)
        log("[%d/%d]" % (idx, len(test_cases)))
        log("")

        if result == "ERROR":
            allpass = False
            break

        idx += 1

    end_time = current_millis()
    duration_time = (end_time - start_time) / 1000.0

    if allpass:
        log("%d cases ALL PASS, took %.2fs." % (len(test_cases), duration_time))

    log("Test args: x64=%r, release=%r, nodejs=%r, validate=%r" % (x64, release, nodejs, validate))
    log("")

    case_runtime.dump_name()
    case_runtime.dump_info()
    case_runtime.dump_version()

if __name__ == '__main__':
    main()
