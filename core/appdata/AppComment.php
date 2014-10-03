<?php

/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年8月25日
 * Time: 下午2:39
 */
class AppComment
{
    private $action, $table, $total_results;

    public function __construct($action)
    {
        global $wpdb;
        $this->action = $action;
        $this->table = $wpdb->prefix . "app_comment";
    }

    public function flag($comment_id, $flag)
    {
        global $wpdb;

        $wpdb->update($this->table,
            array('flagged' => $flag),
            array('ID' => $comment_id));

    }

    public function add_new_comment($post_id, $app_user_id, $string_content)
    {
        global $wpdb;
        $content = array(
            "comment" => $string_content,
            "post_id" => $post_id,
            "user" => $app_user_id
        );
        $wpdb->insert($this->table, $content);
    }

    public function default_comment($post_id)
    {
        return $this->get_comment($post_id, 10, 0);
    }

    public function get_comment($post_id, $threads = 10, $start = 0)
    {
        global $wpdb;
        $t = $this->table;
        $s = $wpdb->prepare("SELECT * FROM $t WHERE post_id=%d ORDER BY creationtime DESC", $post_id);
        $c = $wpdb->prepare("SELECT COUNT(*) FROM $t WHERE post_id=%d ORDER BY creationtime DESC", $post_id);
        $result = $wpdb->get_results($s);
        $count = $wpdb->get_var($c);
        $this->total_results = $count;
        return $result;
    }

    public function get_comment_count($post_id)
    {
        global $wpdb;
        $table_comment = $this->table;
        $c = $wpdb->prepare("SELECT COUNT(*) FROM $table_comment WHERE post_id=%d ORDER BY creationtime DESC", $post_id);

        return intval($wpdb->get_var($c));
    }

    public function get_counts_from_id($post_id)
    {
        global $wpdb;
        $table_comment = $this->table;
        $c = $wpdb->prepare("SELECT COUNT(*) FROM $table_comment WHERE post_id=%d ORDER BY creationtime DESC", $post_id);

        return array(
            "comment_count" => intval($wpdb->get_var($c)),
            "share_count" => intval(get_post_meta($post_id, "share_count", true)),
        );

    }

    public function get_count()
    {
        return $this->total_results;
    }

    public function addcountshare($id)
    {
        $count = get_post_meta($id, "share_count", true);
        if ($count == "") $count = 0;
        update_post_meta($id, "share_count", intval($count) + 1, $count);
        return true;
    }


} 