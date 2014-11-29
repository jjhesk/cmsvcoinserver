<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月28日
 * Time: 上午11:37
 */
abstract class SingleBase
{
    protected $db, $table, $stock_operation, $app_comment;
    protected $post_id, $lang, $content, $cate_list;

    public function __construct($ID)
    {
        global $wpdb;
        $this->post_id = (int)$ID;
        if (isset($_GET['lang']))
            $this->lang = $_GET['lang'];
        if (!$this->isType(get_post_type($this->post_id))) throw new Exception("post type check failed. this object_id is not valid for this post type or this id is not exist", 1047);
        if (get_post_status($this->post_id) != 'publish') throw new Exception("the object id is not ready", 1048);
        $this->db = $wpdb;
        $this->content = $this->queryobject();
    }

    public function __destruct()
    {
        $this->db = NULL;
        $this->content = NULL;
        $this->stock_operation = NULL;
        $this->app_comment = NULL;
    }

    protected function isType($type)
    {
        return true;
    }

    abstract protected function queryobject();

    protected function get_terms($tax)
    {
        $terms = $tax == "category" ? get_the_category($this->post_id) : get_the_terms($this->post_id, $tax);
        //resposne in david request for android development
        return !$terms ? array() : $terms;
    }

    protected function get_terms_images($taxonomy_id)
    {
        $array_terms = $taxonomy_id == "category" ? get_the_category($this->post_id) : get_the_terms($this->post_id, $taxonomy_id);
        $this->cate_list = array();
        foreach ($array_terms as $cat) :
            $this->cate_list[] = $this->cat_loop($cat, true, strtolower($taxonomy_id) == "category", $taxonomy_id);
        endforeach;

        return count($this->cate_list) == 0 ? array() : $this->cate_list;
    }


    protected $filter_keys_setting = 0;

    /**
     * cate data loop
     *
     * @param $cat
     * @param bool $image
     * @param bool $isCate
     * @param $taxonomy_id
     * @throws Exception
     * @return array
     */
    private function cat_loop($cat, $image = false, $isCate = false, $taxonomy_id)
    {
        $image_url = "";
        if ($image && !function_exists('z_taxonomy_image_url')) {
            throw new Exception("image module not found.");
        }
        if ($isCate) {
            $desc = category_description($cat->term_id);
        } else {
            $text = trim(wp_kses(term_description($cat->term_id, $taxonomy_id), array()));
            $desc = str_replace('\n', "", $text);
        }

        if ($this->filter_keys_setting === 1) {
            return array(
                "name" => trim($cat->name),
                "countrycode" => $desc
            );
        } else {
            if ($image) {
                return array(
                    "unpress" => z_taxonomy_image_url($cat->term_id),
                    "press" => z_taxonomy_image_url($cat->term_id, 2),
                    "unpress_s" => z_taxonomy_image_url($cat->term_id, 3),
                    "press_s" => z_taxonomy_image_url($cat->term_id, 4),

                    "name" => trim($cat->name),
                    "description" => $desc,
                    "id" => intval($cat->term_id),
                );
            } else {
                return array(
                    "name" => trim($cat->name),
                    "description" => $desc,
                    "id" => intval($cat->term_id),
                );
            }
        }
    }


    /**
     * wordpress: wp_get_attachment_image_src
     * @param $key
     * @return mixed
     */
    protected function get_product_image($key)
    {
        $list = get_post_meta($this->post_id, $key, true);
        $optionpost = wp_get_attachment_image_src($list, 'large');
        return $optionpost[0];
    }

    protected function get_image_series($key)
    {
        $list = get_post_meta($this->post_id, $key, false);
        $arr = array();
        if (count($list) > 0)
            foreach ($list[0] as $id) {
                $image = wp_get_attachment_image_src($id, 'large');
                $arr[] = array(
                    "ID" => $id,
                    "url" => $image[0],
                );
            }
        return $arr;
    }

    protected function get_structure()
    {
        return json_decode(stripslashes(get_post_meta($this->post_id, "ext_v2", true)), true);
    }
} 