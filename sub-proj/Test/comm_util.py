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


def call_command_with_output(args_list, is_shell=False):
    process = subprocess.Popen(args_list, shell=is_shell,
                                stdin=subprocess.PIPE,
                                stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE)
    # wait for the process to terminate
    stdout, stderr = process.communicate()
    returncode = process.returncode
    return (returncode, stdout.decode('utf-8'), stderr.decode('utf-8'))


def md5_str(input_str, encode='utf-8'):
    md5hash = hashlib.md5()
    md5hash.update(input_str.encode(encode))
    return md5hash.hexdigest()


def md5_file(file_path):
    filemd5 = hashlib.md5(open(file_path, 'rb').read()).hexdigest()
    return filemd5


def query_yes_no(question, default='yes'):
    # Ask a yes/no question via raw_input() and return their answer.
    # "question" is a string that is presented to the user.
    # "default" is the presumed answer if the user just hits <Enter>.
    #         It must be "yes" (the default), "no" or None (meaning
    #         an answer is required of the user).
    # The "answer" return value is True for "yes" or False for "no".

    valid = {'yes': True, 'y': True, 'ye': True, 'no': False, 'n': False}
    if default is None:
        prompt = '[y/n] '
    elif default == 'yes':
        prompt = '[Y/n] '
    elif default == 'no':
        prompt = '[y/N] '
    else:
        raise ValueError('invalid default answer: [%s]' % default)

    while True:
        log_print('%s %s' % (question, prompt))
        choice = input().lower()
        if default is not None and choice == '':
            return valid[default]
        elif choice in valid:
            return valid[choice]
        else:
            log_print('Please respond with "yes" or "no" (or "y" or "n").')
