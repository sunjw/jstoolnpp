import datetime
import hashlib
import io
import json
import math
import os
import platform
import re
import subprocess
import time


def log_print(message):
    print(message)


def get_cur_timestamp():
    return math.floor(time.mktime(datetime.datetime.today().timetuple()))


def get_cur_timestamp_millis():
    return int(round(time.time() * 1000))


def read_file_text(file_path):
    file_content = ''
    with open(file_path, encoding='utf-8') as f:
        file_content = f.read()
    return file_content


def write_file_text(file_path, file_content, eol=None):
    with io.open(file_path, 'w', newline=eol, encoding='utf-8') as file:
        file.write(file_content)


def read_file_binary(file_path):
    if not os.path.exists(file_path):
        return ''
    file_content = open(file_path, 'rb').read()
    return file_content


def write_file_binary(file_path, file_content):
    file_obj = open(file_path, 'wb')
    file_obj.write(file_content)
    file_obj.close()


def pprint_dict_to_string(a_dict):
    return json.dumps(a_dict, indent=2, ensure_ascii=False)


def is_ipv4(input_str):
    compile_ip = re.compile(
        '^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$')
    if compile_ip.match(input_str):
        return True
    else:
        return False


def list_file(dir_path):
    files = [f for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]
    return files


def is_windows():
    return (platform.system() == 'Windows')


def is_macos():
    return (platform.system() == 'Darwin')


def is_linux():
    return (platform.system() == 'Linux')


def call_command(args_list, is_shell=False):
    subprocess.call(args_list, shell=is_shell)


def md5_str(input_str, encode='utf-8'):
    md5hash = hashlib.md5()
    md5hash.update(input_str.encode(encode))
    return md5hash.hexdigest()
