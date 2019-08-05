<?php

/**
 * 获得 $_POST 中的 query 参数的值
 * @param $param_name 参数名称
 * @return 参数值或""
 */
function post_query($param_name)
{
    $query = "";
    if(isset($_POST[$param_name]))
    {
        $query = $_POST[$param_name];
    }
    return $query;
}


/**
 * 获得 $_GET 中的 query 参数的值
 * @param $param_name 参数名称
 * @return 参数值或""
 */
function get_query($param_name)
{
    $query = "";
    if(isset($_GET[$param_name]))
    {
        $query = $_GET[$param_name];
    }
    return $query;
}

/**
 * 获得 COOKIE 中的 name 参数的值
 * @param $name 参数名称
 * @return 参数值或""
 */
function get_cookie($name)
{
    $value = "";
    if(isset($_COOKIE[$name]))
    {
        $value = $_COOKIE[$name];
    }
    return $value;
}

/**
 * 获得当前页面的 URI
 * @return URI 字符串
 */
function get_URI()
{
    if($_SERVER['QUERY_STRING'] != "")
        $uri = $_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING'];
    else
        $uri = $_SERVER['PHP_SELF'];
        
    return $uri;
}

/**
 * 获得该系统的基路径，结尾有'/'
 * @return 基路径
 */
function get_base_dir()
{
    $current_file_path = dirname(__FILE__); // inc 文件夹的绝对路径
    $current_base_path = substr($current_file_path, 0, -3);
    if(substr($current_base_path, strlen($current_base_path) - 1, 1) != "\\" && 
        substr($current_base_path, strlen($current_base_path) - 1, 1) != "/")
    {
        $current_base_path .= "/";
    }
    return $current_base_path;
}

/**
 * 获得设置的编码方式
 * @return 编码方式字符串
 */
function get_encoding()
{
    return "UTF-8";
}

/**
 * 将指定字符串从 GB2312 转换成 UTF-8
 * @param $str 目标字符串
 * @return 转换后的 UTF-8 字符串
 */
function convert_gbtoutf8($str)
{
    return @iconv("GB2312", "UTF-8", $str);
}

/**
 * 将指定字符串从 UTF-8 转换成 GB2312
 * @param $str 目标字符串
 * @return 转换后的 GB2312 字符串
 */
function convert_utf8togb($str)
{
    return @iconv("UTF-8", "GB2312", $str);
}

/**
 * xcopy 拷贝目录
 * @param $src 源
 * @param $dest 目标
 * @return false 失败, true 完成
 */
function xcopy($src, $dest)
{
    if(!$dh = @opendir($src))
        return false;
    
    if(!is_dir($dest))
        if(!@mkdir($dest))
            return false;
    
    while(false !== ($item = readdir($dh)))
    {
        if($item != '.' && $item != '..')
        {
            $src_folder_content = $src. '/' .$item;
            $dest_folder_content = $dest. '/' .$item;
            
            if(is_file($src_folder_content))
                @copy($src_folder_content, $dest_folder_content);
            elseif(is_dir($src_folder_content))
                xcopy($src_folder_content, $dest_folder_content);
        }
    }
        
    closedir($dh);
    return true;
}

/**
 * 在文件路径中获得文件名
 * 取代 php 自带的 basename()，因为 basename() 在部分平台处理中文有问题
 * @param $filename
 * @return basename
 */
function get_basename($filename)
{
    return preg_replace('/^.+[\\\\\\/]/', '', $filename);
}

/**
 * 跳转至指定 url
 * @param $url url
 * @param $need_rawurldecode 是否要进行 rawurldecode，默认 false
 */
function redirect($url, $need_rawurldecode = false)
{
    if($need_rawurldecode)
        $url = rawurldecode($url);
    
    header("Location: " . $url);
    exit;
}

/**
 * 在 header 中设置编码 UTF-8
 */
function set_response_utf8()
{
    header("Content-Type: text/html; charset=UTF-8");
}

/**
 * 将时间字符串转换为 timestamp
 * @param $str 时间字符串 格式为 Y-n-j H:i:s
 * @return int timestamp
 */
function timestrtotime($str)
{
    $array = explode(" ", $str);
    $date = $array[0];
    $time = $array[1];
    
    $date = explode("-", $date);
    $time = explode(":", $time);
    
    $timestamp = mktime($time[0], $time[1], $time[2], $date[1], $date[2], $date[0]);
    
    return $timestamp;
}

/**
 * htmlentities 的 UTF-8 编码版本
 * @param $str 需要处理的字符串
 * @return string 结果
 */
function htmlentities_utf8($str)
{
    return htmlentities($str, ENT_COMPAT, "UTF-8");
}

/**
 * 将字符串最后的斜杠或反斜杠删掉
 * @param $str 需要处理的字符串
 * @return string 结果
 */
function erase_last_slash($str)
{
    $temp = $str;
    if(mb_substr($str, -1) == "/" || mb_substr($str, -1) == "\\" )
        $temp = mb_substr($str, 0, mb_strlen($str) - 1);
        
    return $temp;
}

?>