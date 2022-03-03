#
# Package for npp
# Author: Sun Junwen
# Date: 2020-01-25
#
import logging
import os
import platform
import re

from logging.handlers import RotatingFileHandler
from subprocess import call

# pip3 install pywin32
from win32api import GetFileVersionInfo, LOWORD, HIWORD

log_path = './log/debug.log'
logger = logging.getLogger('RunTime')
logging.basicConfig(
    format = '%(asctime)s %(levelname)s [%(filename)s line:%(lineno)d] - %(message)s',
    level = logging.DEBUG,
    handlers = [
        #RotatingFileHandler(logPath, maxBytes=10000000, backupCount=10),
        logging.StreamHandler()
    ])

VERSION_FILE_H = './src/version.h'
RELEASED_FILES_DIR = './ReleasedFiles'
DLL_FILE_NAME = 'JSMinNPP.dll'
DLL_UNI_32_DIR = './Unicode Release'
DLL_UNI_64_DIR = './x64/Unicode Release'
SRC_LIST = ['icon_048.png', 'jsMinNpp15.sln', 'jsMinNpp.vcxproj', 'src']

version = 0

def is_windows_sys():
    return (platform.system() == 'Windows')

def read_file(file_path):
    file_content = ''
    with open(file_path) as f:
        file_content = f.read()
    return file_content

def read_version_h():
    version_file_content = read_file(VERSION_FILE_H)
    reg = re.compile('VERSION_VALUE "(.*)"')
    #logger.info(version_file_content)
    reg_match = reg.search(version_file_content)
    version_value = reg_match.group(1)
    #logger.info(version_value)
    version_parts = version_value.split('.')
    if len(version_parts) > 3:
        version_value = version_parts[0] + '.' + version_parts[1] + '.' + version_parts[2]
    return version_value

def read_version_exe(filename):
    info = GetFileVersionInfo(filename, '\\')
    ms = info['FileVersionMS']
    ls = info['FileVersionLS']
    return '%s.%s.%s.%s' % (HIWORD(ms), LOWORD(ms), HIWORD(ls), LOWORD(ls))

def package_dll():
    global version
    version_full = version + '.0'

    cwd = os.getcwd()
    #logger.info(cwd)

    released_files_dir_full = os.path.join(cwd, RELEASED_FILES_DIR)

    logger.info('Package uni.32...')
    os.chdir(DLL_UNI_32_DIR)
    dll_uni_32_zip_full = os.path.join(released_files_dir_full, 'JSToolNPP.%s.uni.32.zip' % (version))
    #logger.info(dll_uni_32_zip_full)
    dll_uni_32_version = read_version_exe(DLL_FILE_NAME)
    #logger.info(dll_uni_32_version)
    if not dll_uni_32_version == version_full:
        logger.error('Version not match, want: %s, found %s' % (version, dll_uni_32_version))
        return
    call(['7z', 'a', dll_uni_32_zip_full, DLL_FILE_NAME])
    # Go back
    os.chdir(cwd)

    logger.info('Package uni.64...')
    os.chdir(DLL_UNI_64_DIR)
    dll_uni_64_zip_full = os.path.join(released_files_dir_full, 'JSToolNPP.%s.uni.64.zip' % (version))
    #logger.info(dll_uni_64_zip_full)
    dll_uni_64_version = read_version_exe(DLL_FILE_NAME)
    #logger.info(dll_uni_64_version)
    if not dll_uni_64_version == version_full:
        logger.error('Version not match, want: %s, found %s' % (version, dll_uni_64_version))
        return
    call(['7z', 'a', dll_uni_64_zip_full, DLL_FILE_NAME])
    # Go back
    os.chdir(cwd)

    logger.info('Package src...')
    src_zip_full = os.path.join(released_files_dir_full, 'JSToolNPP.%s.src.zip' % (version))
    logger.info(src_zip_full)
    cmd_list = ['7z', 'a', src_zip_full]
    cmd_list.extend(SRC_LIST)
    call(cmd_list)
    # Go back
    os.chdir(cwd)

def main():
    global version

    if not is_windows_sys():
        logger.error('Only support Windows.')
        return

    os.chdir(os.path.dirname(__file__))

    version = read_version_h()
    logger.info('Version: %s' % (version))

    package_dll()


if __name__ == '__main__':
    main()
