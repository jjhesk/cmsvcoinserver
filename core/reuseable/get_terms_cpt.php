<?php

/**
 * Created by PhpStorm.
 * User: ryo
 * Date: 14年12月1日
 * Time: 下午3:47
 */
class get_terms_cpt
{
    public $instance;
    private $taxonomy_ids, $post_type, $db, $term_relationships_table, $country_id;

    public function __construct($taxonomy_ids, $post_type, $country_id)
    {
        global $wpdb;
        $this->taxonomy_ids = $taxonomy_ids;
        $this->post_type = $post_type;
        $this->db = $wpdb;
        $this->term_relationships_table = $this->db->prefix . "term_relationships";
        $this->term_taxonomy_table = $this->db->prefix . "term_taxonomy";
        $this->posts_table = $this->db->prefix . "posts";
        $this->country_id = (int)$country_id;
    }

    private function get_terms()
    {
        $ids = array();
        foreach ($this->taxonomy_ids as $taxonomy_id) {
            $ids[] = $taxonomy_id;
        }
        $ids = join(",", $ids);
        if ($this->country_id > 0) {
            $query = $this->db->prepare("SELECT t1.*, t2.term_id
                FROM $this->term_relationships_table AS t1
                JOIN $this->term_taxonomy_table AS t2 ON t1.term_taxonomy_id = t2.term_taxonomy_id
                WHERE t2.term_id IN ($ids) AND t1.object_id IN
                (SELECT object_id FROM cms_term_relationships WHERE term_taxonomy_id=%d)", $this->country_id);
        } else {
            $query = $this->db->prepare("SELECT t1.*, t2.term_id
                FROM $this->term_relationships_table AS t1
                JOIN $this->term_taxonomy_table AS t2 ON t1.term_taxonomy_id = t2.term_taxonomy_id
                WHERE t2.term_id IN ($ids) AND t1.object_id");
        }
        return $this->db->get_results($query);
    }

    public function get_terms_with_cpt()
    {
        $post_ids = $this->get_terms();

        $post_arr = array();
        foreach ($post_ids as $post) {
            $post_arr[$post->term_id]["id"][] = $post->object_id;
            $post_arr[$post->term_id]["term_id"] = $post->term_id;

            if ($this->post_type == VPRODUCT) {
                if ($post->term_id == 1905 || $post->term_id == 1922 || $post->term_id == 1923)
                    $post_arr[$post->term_id]["post_type"] = VCOUPON;
                else $post_arr[$post->term_id]["post_type"] = VPRODUCT;

            } else {
                $post_arr[$post->term_id]["post_type"] = $this->post_type;
            }
        }

        $valid_term_array = array();

        foreach ($post_arr as $post) {
            $ids = join(",", $post["id"]);
            if ($this->post_type == VPRODUCT && ($post['post_type'] == VPRODUCT || $post['post_type'] == VCOUPON)) {
                $type = $post['post_type'] == VPRODUCT ? VPRODUCT : VCOUPON;
            } else {
                $type = $this->post_type;
            }
            $query = $this->db->prepare("SELECT * FROM $this->posts_table
            WHERE ID IN ($ids) AND post_status=%s AND post_type=%s", 'publish', $type);

            $result = $this->db->get_results($query);
            if ($result) {
                $valid_term_array[]->term_id = $post['term_id'];
            }
        }
        return $valid_term_array;
    }

    public static function postTypeTaxonomy($taxonomy_id, $country_cat_id, $country_term_id, $post_type, $args)
    {
        //global $sitepress;
        //$sitepress->switch_lang("en", true);

        $term_taxonomy = get_term_by("id", $country_term_id, $country_cat_id);

        $terms_array = get_terms($taxonomy_id, $args);
        $taxonomy_ids = array();
        foreach ($terms_array as $obj) {
            $taxonomy_ids[] = $obj->term_id;
        }
        $instance = new self($taxonomy_ids, $post_type, $term_taxonomy->term_taxonomy_id);
        return $instance->get_terms_with_cpt();
    }
} 