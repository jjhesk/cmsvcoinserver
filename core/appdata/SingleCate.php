<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年11月24日
 * Time: 下午1:02
 */
class SingleCate
{
    public static function catloop($cat, $image = false, $isCate = false, $taxonomy_id)
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

        return array(
            "unpress" => z_taxonomy_image_url($cat->term_id),
            "press" => z_taxonomy_image_url($cat->term_id, 2),
            "unpress_s" => z_taxonomy_image_url($cat->term_id, 3),
            "press_s" => z_taxonomy_image_url($cat->term_id, 4),

            "name" => trim($cat->name),
            "description" => $desc,
            "id" => intval($cat->term_id),
        );
    }
} 