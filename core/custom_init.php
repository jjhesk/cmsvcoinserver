<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年7月31日
 * Time: 上午11:45
 */
if (!function_exists('plugin_is_active')) {
    function plugin_is_active($plugin_path)
    {
        $return_var = in_array($plugin_path, apply_filters('active_plugins', get_option('active_plugins')));
        return $return_var;
    }
}
if (!function_exists('get_oc_template')) {
    function get_oc_template($filename)
    {
        $path = locate_template('view/' . $filename . '.php', false);
        ob_start();
        if (!empty($path))
            load_template($path);
        else
            echo "no path defined::" . $path . " :filename::" . $filename;
        return ob_get_clean();
    }
}

