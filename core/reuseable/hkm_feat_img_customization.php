<?php
/**
* HKM CMS CORE MANAGEMENT INIT CLASS FOR HKM FEATURE IMAGE CUSTOMIZATION SUPPORT
*
* Author: HESKEYO KAM
* Copyright: &#169; 2011
* {@link http://hkmdev.wordpress.com/ HKM LLC}
*
* Released under the terms of the GNU General Public License.
* You should have received a copy of the GNU General Public License,
* along with this software. In the main directory, see: /licensing/
* If not, see: {@link http://www.gnu.org/licenses/}.
*
* @package Core
* @since 1.2
*/
defined('ABSPATH') || exit ;
if (!class_exists('hkm_feat_img_customization')) {
	// HKMhelper Class
	class hkm_feat_img_customization {
		function __construct($setup_feature_images_metabox = array()) {
			$this -> register($setup_feature_images_metabox);
		}
		public function register($args = array()) {
			$defaults = array('type' => null, 'label' => null, 'title' => null, 'html' => null, );
			$args = wp_parse_args($args, $defaults);
			// Create and set properties
			foreach ($args as $k => $v) {
				$this -> $k = $v;
			}
			// Need these args to be set at a minimum
			if (null === $this -> type || null === $this -> label || null === $this -> title) {
				if (WP_DEBUG) {
					trigger_error(sprintf("The 'label' and 'id' values of the 'args' parameter of '%s::%s()' are required", __CLASS__, __FUNCTION__));
				}
				return;
			}
			// add theme support if not already added
			if (!current_theme_supports('post-thumbnails')) {
				add_theme_support('post-thumbnails');
			}
			add_action('do_meta_boxes', array(&$this, 'remove_metabox'));
			add_action('admin_head-post-new.php', array(&$this, 'htmlfilter_featureimage'));
			add_action('admin_head-post.php', array(&$this, 'htmlfilter_featureimage'));
		}

		public function remove_metabox() {
			remove_meta_box('postimagediv', $this -> type, 'side');
			add_meta_box('postimagediv', __($this -> title, 'linkr_txt_domain'), 'post_thumbnail_meta_box', $this -> type, 'normal', 'high');
		}

		public function htmlfilter_featureimage() {
			if ($this -> type == $GLOBALS['post_type'])
				add_filter('admin_post_thumbnail_html', array(&$this,'html_filter_process'));
		}

		public function html_filter_process($content) {
			$content = str_replace(__('Set featured image'), __($this -> label), $content);
			if(!empty($this -> html)||$this -> html!=null){
				$content .= $this -> html;
			}
			return $content;
		}

	}
//end class here
}

?>