<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月14日
 * Time: 上午10:32
 */
defined('ABSPATH') || exit;
if (!class_exists('taxonomy_develop')) {
    class taxonomy_develop
    {
        public function __construct()
        {

            $this->init_country_tax();
            $this->init_app_cate();

            add_filter("pre_insert_term", array(&$this, "preinsert"), 15, 2);
            add_action("create_term", array(&$this, "clean_term"), 15, 3);
        }

        public function preinsert($term, $taxonomy)
        {
            return $term . " ##" . $taxonomy;
        }

        public function clean_term($term_id, $tt_id, $taxonomy)
        {
            //$matcer = /##[^\s]*/g;
            global $wpdb;
            $existing_term = $wpdb->get_row($wpdb->prepare("SELECT name FROM $wpdb->terms WHERE term_id = %d", $term_id), ARRAY_A);
            $string_after = preg_replace('/##[^\s]*/', "", $existing_term['name']);
            $string_after = preg_replace('/@[^\s]*/', "", $string_after);
            $existing_term['name'] = $string_after;
            $wpdb->update($wpdb->terms, array(
                "name" => $string_after
            ), compact('term_id'));
        }

        private function init_country_tax()
        {

            //for rewards
            register_taxonomy('country', array(VPRODUCT, VSLIDER, VCOUPON),
                array(
                    'label' => __('P Countries'),
                    'rewrite' => array('slug' => 'countryforproduct'),
                    'hierarchical' => true,
                    'show_admin_column' => true,
                    'query_var' => true,
                )
            );
            register_taxonomy('country_vendor_nd', array(VENDOR),
                array(
                    'label' => __('V Countries'),
                    'rewrite' => array('slug' => 'countryforvendor'),
                    'hierarchical' => true,
                    'show_admin_column' => true,
                    'query_var' => true,
                )
            );
            register_taxonomy('countryios_nd', array(APPDISPLAY, VSLIDER),
                array(
                    'label' => __('iOS Country'),
                    'rewrite' => array('slug' => 'countryforios'),
                    'hierarchical' => true,
                    'show_admin_column' => true,
                    'query_var' => true,
                )
            );
            register_taxonomy('countryandroid', array(APPDISPLAY, VSLIDER),
                array(
                    'label' => __('Android Country'),
                    'rewrite' => array('slug' => 'countryforandroid'),
                    'hierarchical' => true,
                    'show_admin_column' => true,
                    'query_var' => true,
                )
            );
        }

        private function init_app_cate()
        {
            register_taxonomy('appcate', array(APPDISPLAY, VSLIDER),
                array(
                    'label' => __('iOS Cat'),
                    'rewrite' => array('slug' => '_catapp'),
                    /*   'capabilities' => array(
                         'assign_terms' =>'edit_linkages',
                         'edit_terms' =>'publish_linkages'
                    )*/
                    'query_var' => true,
                    'hierarchical' => true,
                    'show_admin_column' => true,
                )
            );
            register_taxonomy('appandroid', array(APPDISPLAY, VSLIDER),
                array(
                    'label' => __('Android Cat'),
                    'rewrite' => array('slug' => '_catandroid'),
                    /*   'capabilities' => array(
                         'assign_terms' => 'edit_linkages',
                         'edit_terms' => 'publish_linkages'
                     )*/
                    'query_var' => true,
                    'hierarchical' => true,
                    'show_admin_column' => true,
                )
            );
        }

        /*      private function init_slider_tax()
              {
                  register_taxonomy('slidercate', array(VSLIDER),
                      array(
                          'label' => __('Slider Cat'),
                          'rewrite' => array('slug' => '_slider'),
                          'hierarchical' => true,
                          'show_admin_column' => true,
                      )
                  );
              }*/
    }
}