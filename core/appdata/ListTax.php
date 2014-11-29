<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月14日
 * Time: 上午11:40
 */
if (!class_exists('ListTax')) {
    class ListTax extends listBase
    {
        private $preset = array(
            //  'type' => 'post',
            'child_of' => 0,
            'parent' => '',
            'orderby' => 'term_order',
            'order' => 'ASC',
            'hide_empty' => true,
            'hierarchical' => 1,
            'exclude' => '',
            'include' => '',
            'number' => '',
            'taxonomy' => 'category',
            'pad_counts' => false
        );
        private $final_set = array();
        private $custom_taxonomy = "";

        public function __construct($args = array())
        {
            $this->custom_taxonomy = $args["taxonomy"];
            $this->final_set = wp_parse_args($args, $this->preset);
        }

        public function list_cat_reward()
        {
            try {
                $this->final_set['with_image'] = true;

                $this->listCateBy('category', $this->final_set);
                return $this->getResultArr();
            } catch (Exception $e) {
                throw $e;
            }
        }

        public function list_cat_android()
        {
            try {
                $this->final_set['with_image'] = true;
                if (isset($_REQUEST["lang"])) $this->final_set['lang'] = $_REQUEST["lang"];
                $this->listCateBy('appandroid', $this->final_set);
                return $this->getResultArr();
            } catch (Exception $e) {
                throw $e;
            }
        }

        public function list_cat_ios()
        {
            try {
                $this->final_set['with_image'] = true;
                if (isset($_REQUEST["lang"])) $this->final_set['lang'] = $_REQUEST["lang"];
                $this->listCateBy('appcate', $this->final_set);
                return $this->getResultArr();
            } catch (Exception $e) {
                throw $e;
            }
        }

        public function listCountryCodes()
        {
            $this->filter_keys_setting = 1;
            $this->listCateBy($this->final_set['taxonomy'], $this->final_set);
        }

        public function listCountry()
        {
            $this->final_set['with_image'] = true;
            $this->listCateBy($this->final_set['taxonomy'], $this->final_set);
            /*   try {
                   $this->listCateBy($this->final_set['taxonomy'], $this->final_set);
                   return $this->getResultArr();
               } catch (Exception $e) {
                   throw $e;
               }
            */
        }


        protected function all_button_initiate($key, $lang)
        {
            //all_cat
            if ($key == "appandroid" || $key == "appcate" || $key == "category") {
                $key = "cat";
            } else if ($key == "countryandroid" || $key == "countryios_nd" || $key == "country") {
                $key = "country";
            }
            if ($lang == "zh-hant") {
                $lang = "zh";
            }
            // inno_log_db::log_admin_coupon_management(-1, 323, $lang);

            $admin_settings = TitanFramework::getInstance('vcoinset');
            $text = $admin_settings->getOption("all_" . $key . "_" . $lang);
            $desc = $admin_settings->getOption("all_" . $key . "_desc");
            $unpressed = $admin_settings->getOption("all_" . $key . "_unpressed");
            $pressed = $admin_settings->getOption("all_" . $key . "_pressed");
            $spressed = $admin_settings->getOption("all_sm" . $key . "_pressed");
            $sunpressed = $admin_settings->getOption("all_sm" . $key . "_unpressed");


            $admin_settings = NULL;
            return array(
                "unpress" => $this->get_image($unpressed),
                "press" => $this->get_image($pressed),
                "unpress_s" => $this->get_image($sunpressed),
                "press_s" => $this->get_image($spressed),
                "description" => $desc,
                "name" => $text,
                "id" => -1,
            );
        }
        /*
                public static function inloop($cat)
                {

                }


                public static function inloop2($cat, $k = 0)
                {
                    if ($k == 0) {
                        return array(
                            "name" => trim($cat->name),
                            "description" => category_description($cat->term_id),
                            "id" => intval($cat->term_id),
                        );
                    } else {
                        return array(
                            "unpress" => z_taxonomy_image_url($cat->term_id),
                            "press" => z_taxonomy_image_url($cat->term_id, 2),
                            "unpress_s" => z_taxonomy_image_url($cat->term_id, 3),
                            "press_s" => z_taxonomy_image_url($cat->term_id, 4),
                            "name" => trim($cat->name),
                            "id" => intval($cat->term_id),
                        );
                    }

                }
        */

        /***
         * we dont use this one now
         * @param $id
         * @param array $args
         */
        protected function inDaLoop($id, $args = array())
        {
            // TODO: Implement inDaLoop() method.
        }
    }
}