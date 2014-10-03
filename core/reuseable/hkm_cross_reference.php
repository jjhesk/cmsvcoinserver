<?
/**
 * HKM CMS CORE MANAGEMENT hkm_cross_reference
 * This is the process the core CMS data from the backend structure
 * @Author: HESKEYO KAM
 * @Copyright:
 * {@link http://hkmdev.wordpress.com/ HKM LLC}
 *
 * Released under the terms of the GNU General Public License.
 * You should have received a copy of the GNU General Public License,
 * along with this software. In the main directory, see: /licensing/
 * If not, see: {@link http://www.gnu.org/licenses/}.
 *
 * @package class
 * @since 1.3.1
 */
defined('ABSPATH') || exit ;

if (!class_exists('hkm_cross_reference')) {
    // HKMhelper Class
    class hkm_cross_reference {
        /*
         function __construct(){
         $this->meta_featured_image_div=array();
         }
         */
        //to display a single title name from the query of the post
        public function __construct() {

        }

        public function meta_box_get_post_title($id, $type) {
            $optionpost = null;
            $items = get_posts(array('post_type' => $type, 'post_status' => 'publish', 'posts_per_page' => -1, "p" => $id));
            foreach ($items as $item) {
                $optionpost = $item -> post_title;
            }
            return $optionpost;
        }

        public function meta_box_get_permlink($id, $type) {
            $outp = null;
            $config = array('post_type' => $type, 'post_status' => 'publish', 'posts_per_page' => -1, "p" => $id);
            $customer_wp_query = new WP_Query($config);
            if ($customer_wp_query -> have_posts()) :
                while ($customer_wp_query -> have_posts()) : $customer_wp_query -> the_post();
                    $outp = get_permalink();
                endwhile;
            endif;
            wp_reset_query();
            return $outp;
        }

        //
        public function meta_box_get_post_slug($id, $type) {
            $optionpost = null;
            $items = get_posts(array('post_type' => $type, 'post_status' => 'publish', 'posts_per_page' => -1, "include" => array($id)));
            $optionpost = $items[0] -> post_name;
            return $optionpost;
        }

        //To list up a list of titles from the post and have them to display on the option list
        public function meta_box_enhance_list_post($posttype) {
            $optionpost = null;
            $optionpost[-1] = "[ empty field here ]";
            $items = get_posts(array('post_type' => $posttype, 'posts_per_page' => -1, 'post_status' => 'publish'));
            foreach ($items as $item) {
                $optionpost[$item -> ID] = $item -> ID . " - " . $item -> post_title;
            }
            return $optionpost;
        }

        //
        public function meta_box_enhance_list_get_field_id($posttype, $id, $fieldrequired) {
            $optionpost = null;
            $optionpost = array();
            $items = get_posts(array('post_type' => $type, 'posts_per_page' => -1, "include" => $id, 'post_status' => 'publish'));
            foreach ($items as $item) {
                $optionpost[$item -> ID] = $item -> post_title;
            }
            return $optionpost;
        }

        public function meta_box_enhance_thumbnail_src($posttype, $id) {
            $optionpost = "";
            $items = get_posts(array('post_type' => $posttype, "include" => $id, 'post_status' => 'publish'));
            /*, 'meta_query' => array( array(
             'key' => '_thumbnail_id',
             'value' => '0',
             'compare' => '>=',
             )
             )*/
            $optionpost = wp_get_attachment_image_src(get_post_thumbnail_id($items[0] -> ID), 'cd_player_album_cover');
            return $optionpost[0];
        }

        public function meta_box_get_list_all_images_src($id, $customfield) {
            $py_img = get_post_meta($id, $customfield, FALSE);
            $img_output = array();
            $thesizes = array("small", "medium", "large", "full");
            //return count($py_img);
            if (count($py_img) > 0) {
                foreach ($py_img as $key => $value) {

                    $image_data = array();
                    foreach ($thesizes as $valuesize) {
                        $data = wp_get_attachment_image_src($value, $valuesize);
                        $image_data[$valuesize] = $data[0];
                    }
                    $img_output[] = $image_data;

                }
            } else {
                $img_output = false;
            }

            return $img_output;
        }

        //
        public function metabox_get_listimgurls($posttype, $id, $customfield, $size = "full") {
            /*
             $config = array('post_type' => $posttype, "p" => $id);
             $py_img = array();
             $customer_wp_query = new WP_Query($config);
             if ($customer_wp_query -> have_posts()) :
             while ($customer_wp_query -> have_posts()) : $customer_wp_query -> the_post();
             $py_img = get_post_meta($customer_wp_query -> post -> ID, $customfield, false);
             endwhile;
             endif;
             wp_reset_query();
             */
            $py_img = get_post_meta($id, $customfield, FALSE);
            $img_output = array();
            foreach ($py_img as $key => $value) {
                $image_data = wp_get_attachment_image_src($value, $size);
                if (!empty($image_data[0])) {
                    $img_output[] = $image_data;
                }
            }

            return array('imagelist' => $img_output, 'loc_url' => get_post_meta($id, 'linkr_google_url', TRUE));
        }

        /**!
         * HKM
         * @license creative common / MIT LICENSE
         * @author Heskemo
         * This function is a helper list up all the images from the field
         * @param py_img - the given array of the ids of the image attachments
         * @param size - the size [large, full , small, medium]
         * @return array
         * @version 0.2
         */
        private function listimages($py_img) {
            $img_output = array();
            foreach ($py_img as $key => $value) {
                $image_data = wp_get_attachment_image_src($value, 'full');
                $img_output[] = $image_data;
            }
            return $img_output;
        }

        /**!
         * HKM
         * @link terms_walker_from_post
         * @license creative common / MIT LICENSE
         * @author Heskemo
         *                 -return a list of links that the post is surronding..
         * @param $taxonomy
         * @param $post_objID
         * @param string $extraClass
         * @return string
         * @internal param $taxonomy - self explaintory
         * @internal param $post_objID - the post ID
         * @version 0.2
         */
        public function terms_walker_from_post($taxonomy, $post_objID, $extraClass = "") {
            $out = "<ul class=\"key_" . $taxonomy . " " . $extraClass . "\">";
            $terms = wp_get_post_terms($post_objID, $taxonomy, array('fields' => 'all'));
            foreach ($terms as $key => $term) {
                $link = get_term_link($term -> slug, $taxonomy);
                $slug = $term -> slug;
                $name = $term -> name;
                $out .= "<li class=\"keyword keyword_" . $slug . "\"><a href='" . $link . "'>" . $name . "</a></li>";
            }
            $out .= "</ul>";
            return $out;
        }

        /**!
         * HKM
         * @link custom_taxonomy_walker_level_1
         * @license creative common / MIT LICENSE
         * @author Heskemo
         *                 -return a list of links that the post is surronding..
         * @param taxonomy - self explaintory
         * @param int $parent
         * @param bool $hide_empty
         * @param string $extraClass
         * @return string
         * @version 0.2
         */
        public function custom_taxonomy_walker_level_1($taxonomy, $parent = 0, $hide_empty = true, $extraClass = "") {
            $terms = get_terms($taxonomy, array('parent' => $parent, 'hide_empty' => $hide_empty));
            //If there are terms, start displaying
            if (count($terms) > 0) {
                //Displaying as a list
                $out = "<ul class=\"" . $taxonomy . " " . $extraClass . "\">";
                //Cycle though the terms
                foreach ($terms as $term) {
                    //href="'.get_term_link($term->slug, 'species').'"
                    //Secret sauce.  Function calls itself to display child elements, if any
                    $out .= "<li class=\"" . $term -> slug . "\"><a href='" . get_term_link($term -> slug, $taxonomy) . "'>" . $term -> name . custom_taxonomy_walker($taxonomy, $term -> term_id) . "</a></li>";
                }
                $out .= "</ul>";
                return $out;
            }
            return;
        }

        /** THIS IS LIMITED TO ONE LEVEL REFERENCE
         * TO FIND A LIST OF {coupons} THAT IS BELONGS THE {initial posts type}
         * @param the $other_types
         * @param the $key
         * @param the $id
         * @param null|throw $callback
         * @internal param \the $other_types target post type
         * @internal param \the $key keys of the custom field (id)
         * @internal param \the $id post ID of this or current post
         * @internal param \throw $callback in a object post
         */
        public function cross_reference_meta_query_id_from_other_types($other_types, $key, $id, $callback = null) {
            $query = array('post_type' => $other_types, 'post_status' => 'publish', 'meta_query' => array( array('key' => $key, 'value' => $id, )));
            $customer_wp_query = new WP_Query($query);
            if ($customer_wp_query -> have_posts()) :
                while ($customer_wp_query -> have_posts()) : $customer_wp_query -> the_post();
                    if ($callback != null) {
                        call_user_func($callback, $customer_wp_query -> post);
                    }
                endwhile;
            endif;
        }

        /** THIS IS LIMITED TO TWO LEVEL REFERENCES
         * TO FIND A LIST OF {coupons} THAT IS BELONGS THE {initial posts type}
         * @param the $post_type_level_1
         * @param the $post_type_level_2
         * @param the $post_type_level_1_key
         * @param the $post_type_level_2_key
         * @param the $id
         * @param post_type_level_1       the target post type
         * @return callback             using the custom callback and throw in a object post
         */
        public function cross_reference_collect_ids_2step($post_type_level_1, $post_type_level_2, $post_type_level_1_key, $post_type_level_2_key, $id, $callback = null) {
            $query = array('post_type' => $post_type_level_1, 'post_status' => 'publish', 'meta_query' => array( array('key' => $post_type_level_1_key, 'value' => $id, )));
            $lvl1 = new WP_Query($query);
            $collection = array();
            if ($lvl1 -> have_posts()) :
                while ($lvl1 -> have_posts()) : $lvl1 -> the_post();

                    $match_test = get_post_meta($post_type_level_1, $post_type_level_1_key, true);
                    $collection[] = $lvl1 -> post -> ID;
                endwhile;
            else :
                return false;
            endif;
            wp_reset_query();
            $query2 = array('post_type' => $post_type_level_2, 'post_status' => 'publish', 'meta_query' => array( array('compare' => 'IN', 'key' => $post_type_level_2_key, 'value' => $collection, )));
            $lvl2 = new WP_Query($query2);
            if ($lvl2 -> have_posts()) :
                while ($lvl2 -> have_posts()) : $lvl2 -> the_post();
                    if ($callback != null) {
                        call_user_func($callback, $lvl2 -> post);
                    }
                endwhile;
                return true;
            else :
                return false;
            endif;
        }

        /**
         * HKM CROSS REFERENCE FROM LOOKING UP FOLLOWERS WITH CALLBACK FEATURES
         * @param $lookup_post_type_cf
         * @param $lookup_post_type
         * @param $current_id
         * @param null $callback
         * @internal param $current_id - look up from the other post that one custom field has this ID
         * @internal param $lookup_post_type
         * @internal param $lookup_post_type_cf - the custom field fomr that post type
         * @return callback             using the custom callback and throw in a object post
         */
        public function cross_reference_lookup_followers_cb($lookup_post_type_cf, $lookup_post_type, $current_id, $callback = null) {

            $query2 = array('post_type' => $lookup_post_type, 'post_status' => 'publish',
            //using the meta query to perform the custom search
            'meta_query' => array( array('key' => $lookup_post_type_cf, 'value' => $current_id, )));

            // $id_of_another_post_type = get_post_meta($current_id, $current_post_custom_field, TRUE);

            $lvl2 = new WP_Query($query2);
            if ($lvl2 -> have_posts()) :
                while ($lvl2 -> have_posts()) : $lvl2 -> the_post();
                    if ($callback != null) {
                        call_user_func($callback, $lvl2 -> post);
                    }
                endwhile;
                //found the results
                return true;
            else :
                //no results was found
                return false;
            endif;
        }

        /**
         * HKM CROSS REFERENCE POST TYPE GET DATA
         * @param pid_1 the post ID from the first POST TYPE
         * @param the $pid_1
         * @param the $the_custom_field_id_2
         * @param POST $the_final_level_of_the_post_type
         * @version 0.4
         * @author Heskemo
         * you need to have a post-ID (no POST TYPE WILL BE NEEDED) on your hand and find out whats behind this post... by using 2 steps model
         * @return a simple array that contains (post ID, perm-link, and the post title)
         */
        public function cross_reference_2step($the_first_post_type, $pid_1, $the_custom_field_id_2, $the_final_level_of_the_post_type) {
            $id_level_2 = 0;
            $id_level_1 = 0;
            $query = array(
            //
            'post_type' => $the_first_post_type,
            //
            'p' => $pid_1, );
            $holder = array();
            $customer_wp_query = new WP_Query($query);
            if ($customer_wp_query -> have_posts()) :
                while ($customer_wp_query -> have_posts()) : $customer_wp_query -> the_post();
                    $id_level_1 = $customer_wp_query -> post -> ID;
                    $id_level_2 = get_post_meta($id_level_1, $the_custom_field_id_2, true);
                endwhile;
            endif;
            wp_reset_query();
            if ($id_level_2 == null)
                return false;
            $query = array(
            //
            'post_type' => $the_final_level_of_the_post_type,
            //
            'p' => $id_level_2, );
            $holder = array();
            $customer_wp_query = new WP_Query($query);
            if ($customer_wp_query -> have_posts()) :
                while ($customer_wp_query -> have_posts()) : $customer_wp_query -> the_post();
                    $id_level_1 = $customer_wp_query -> post -> ID;
                    $link = get_permalink();
                    $titlename = $customer_wp_query -> post -> post_title;
                    return array('id' => $id_level_1, 'link' => $link, 'title' => $titlename);
                endwhile;
            endif;
            wp_reset_query();
            return false;
        }

        /**
         * HKM CROSS REFERENCE -GET POST BY THE GIVEN TAXONOMY, SLUG, AND THE POST TYPE
         * @param type post type to be returned
         * @param slug $slug
         * @param taxonomy $tax
         * @internal param \slug $slug for the post
         * @return callback             using the custom callback and throw in a object post
         */
        public function list_tax_posts($posttype, $slug, $tax) {
            $query = array(
            //
            'post_type' => $posttype,
            //
            'tax_query' => array(
            //
            array(
            //
            'taxonomy' => $tax,
            //
            'field' => 'slug',
            //
            'terms' => $slug
            //
            )));
            $py_img = array();
            $customer_wp_query = new WP_Query($query);
            if ($customer_wp_query -> have_posts()) :
                while ($customer_wp_query -> have_posts()) : $customer_wp_query -> the_post();
                    $py_img[] = "post";
                endwhile;
            endif;
            wp_reset_query();
            return $py_img;
        }

    }

}
?>