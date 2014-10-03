<?php

/**
 * Created by PhpStorm.
 * User: hesk
 * Date: 5/14/14
 * Time: 12:24 AM
 */
class reportmodel
{
    function __construct()
    {
        //      require_once(get_template_directory() . '/hkm/Mustache/Autoloader.php');
        //      Mustache_Autoloader::register();
        add_action('report-header', array(__CLASS__, 'header'), 10, 2);
        add_action('report-footer', array(__CLASS__, 'footer'), 10, 2);
    }

    protected static function apply($original_string, $content)
    {
        $m = new Mustache_Engine();
        $new_string = $m->render($original_string, $content);
        return $new_string;
    }

    public static function header($a, $b)
    {
        $template_row = get_oc_template('report_tablecabledetection');
    }

    public static function footer($a, $b)
    {
        $template_row = get_oc_template('report_tablecabledetection');
    }

    protected static function get_jobid_by_filename($filename)
    {
        global $wpdb;
        $prepared = $wpdb->prepare("SELECT * FROM onecallapp_basemap WHERE remove = 0 AND filename=%s", $filename);
        return $wpdb->get_row($prepared);
    }
} 