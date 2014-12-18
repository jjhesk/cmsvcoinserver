<?php
/*
Plugin Name: Vcoin Term Display
Plugin URI:
Description: Taxonomies Terms Custom Display.
Version: 0.1
Author: Ryo, Hesk
Author URI:
Author Email:
*/

define('VTDPATH', plugin_dir_path(__FILE__));
define('VTDURL', plugins_url('', __FILE__));
define('VTDBASEPATH', plugin_basename(__FILE__));
define('VTDVERSION', '0.0.1');
//define('TO_VERSION_CHECK_URL', 'http://www.nsp-code.com/version-check/vcheck.php?app=advanced-taxonomy-terms-order');

foreach (glob(VTDPATH . "pack/*.php") as $filename) {
    require_once $filename;
}

//new pack\vtd_Loader(__FILE__);
new vtd_Loader(__FILE__);

?>