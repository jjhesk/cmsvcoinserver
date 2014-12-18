<?php
/**
 * Created by PhpStorm.
 * User: ryo
 * Date: 14年12月16日
 * Time: 上午10:31
 */

if (!class_exists('PostUpdate')) {
    class PostUpdate
    {
        private $post_id, $post_type, $current_lang, $posts_in_other_lang, $default_lang, $cat;

        public function __construct($post_id, $post_type)
        {
            global $sitepress;
            $this->default_lang = $sitepress->get_default_language();
            $this->post_id = $post_id;
            $this->post_type = $post_type;
            $this->current_lang = $this->langcode_post_id();
            $this->get_posts_in_other_lang();
        }

        private function get_posts_in_other_lang()
        {
            $languages = icl_get_languages('skip_missing=1');
            $this->posts_in_other_lang = array();
            $i = 0;
            foreach ($languages as $language) {
                if ($language["language_code"] != $this->current_lang) {
                    $id = icl_object_id($this->post_id, $this->post_type, true, $language['language_code']);
                    if ($id != $this->post_id) {
                        $this->posts_in_other_lang[$i]["post_id"] = $id;
                        $this->posts_in_other_lang[$i++]["lang"] = $language["language_code"];
                    }
                }
            }
        }

        private function check_wpml_existence()
        {
            return defined('ICL_LANGUAGE_CODE');
        }

        private function get_post_taxonomies($post_id)
        {
            if ($this->cat == "category" || $this->cat == "appcate" || $this->cat == "appandroid") {
                return wp_get_post_categories($post_id, array());
            } else if ($this->cat == "country" || $this->cat == "countryios_nd" || $this->cat == "countryandroid") {
                return wp_get_object_terms($post_id, $this->cat, array('fields' => 'ids'));
            }
        }

        private function set_post_taxonomies($post_id, $id)
        {
            if ($this->cat == "category" || $this->cat == "appcate" || $this->cat == "appandroid") {
                return wp_set_post_categories($post_id, array($id), true);
            } else if ($this->cat == "country" || $this->cat == "countryios_nd" || $this->cat == "countryandroid") {
                return wp_set_post_terms($post_id, array($id), $this->cat, true);
            }
        }

        public function synchronize_all_cat($category)
        {
            if ($this->langcode_post_id() != $this->default_lang) {
                if ($this->check_wpml_existence() && $this->check_post_is_translated()) {
                    $this->cat = $category;
                    $checked_cat_ids = $this->get_post_taxonomies($this->post_id);
                    $checked_cat_ids_in_other_lang = array();
                    foreach ($this->posts_in_other_lang as $post) {
                        $checked_cat_ids_in_other_lang[] = $this->get_post_taxonomies($post["post_id"]);
                    }
                    //for just checked category ids in current lang ==============================================
                    $count = 0;
                    foreach ($checked_cat_ids as $checked_id) {
                        $id = icl_object_id($checked_id, $this->cat, false, $this->posts_in_other_lang[0]["lang"]);
                        foreach ($checked_cat_ids_in_other_lang[0] as $checked_id_in_other_lang) {
                            if ($id != $checked_id_in_other_lang) {
                                $count++;
                            }
                        }
                        if ($count == count($checked_cat_ids_in_other_lang[0])) {
                            foreach ($this->posts_in_other_lang as $post) {
                                $id = icl_object_id($checked_id, $this->cat, false, $post["lang"]);
                                $this->set_post_taxonomies($post["post_id"], $id);
                            }
                        }
                        $count = 0;
                    }
                    //for just unchecked category ids in current lang ============================================

                    $all_cat_ids = $this->get_all_term_ids();
                    $unchecked_cat_ids = array_diff($all_cat_ids, $checked_cat_ids);

                    foreach ($unchecked_cat_ids as $uncheck_id) {
                        $id = icl_object_id($uncheck_id, $this->cat, false, $this->posts_in_other_lang[0]["lang"]);
                        foreach ($checked_cat_ids_in_other_lang[0] as $checked_id_in_other_lang) {
                            if ($id == $checked_id_in_other_lang) {
                                foreach ($this->posts_in_other_lang as $post) {
                                    $a = icl_object_id($uncheck_id, $this->cat, false, $post["lang"]);
                                    $this->remove_term($post["post_id"], $a);
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }

        private function check_post_is_translated()
        {
            $count_post = count($this->posts_in_other_lang);
            return ($count_post > 0);
        }

        private function remove_term($post_id, $term_id)
        {
            global $wpdb;
            $term_taxonomy = get_term_by("id", $term_id, $this->cat);
            $deleted = $wpdb->query($wpdb->prepare("DELETE FROM $wpdb->term_relationships WHERE object_id=%d AND term_taxonomy_id=%d", (int)$post_id, (int)$term_taxonomy->term_taxonomy_id));
            wp_update_term_count((int)$term_taxonomy->term_taxonomy_id, $this->cat);
        }

        public function get_all_term_ids()
        {
            global $sitepress;
            $sitepress->switch_lang($this->current_lang, true);

            $terms = get_terms($this->cat, array('hide_empty' => 0));
            $cat_ids = array();
            foreach ($terms as $obj) {
                $cat_ids[] = $obj->term_id;
            }
            return $cat_ids;
        }

        /**
         * Do not use wpml constant ICL_LANGUAGE_CODE to get the current language code
         * If user open several tab or browser, ICL_LANGUAGE_CODE would return the language code of the latest open one
         */
        public function langcode_post_id()
        {
            global $wpdb;
            $query = $wpdb->prepare('SELECT language_code FROM ' . $wpdb->prefix . 'icl_translations WHERE element_id="%d"', $this->post_id);
            $query_exec = $wpdb->get_row($query);
            return $query_exec->language_code;
        }
    }
}