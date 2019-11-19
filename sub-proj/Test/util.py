#
# Util for test
# Author: Sun Junwen
# Date: 2019-01-09
#
import os
import platform
import time

def log(message):
    print(message)

def is_windows_sys():
    return (platform.system() == "Windows")

def is_osx_sys():
    return (platform.system() == "Darwin")

def is_linux_sys():
    return (platform.system() == "Linux")

def current_millis():
    return int(round(time.time() * 1000))

def list_file(dir_path):
    files = [f for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]
    return files
