<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年8月25日
 * Time: 下午2:39
 */
class AppComment
{
    private $table, $total_results, $post_id, $db;

    public function __construct($post_id)
    {
        global $wpdb;
        $this->post_id = $post_id;
        $this->db = $wpdb;
        $this->table = $this->db->prefix . "app_comment";
    }

    public function __destruct()
    {
        $this->post_id = NULL;
        $this->db = NULL;
        $this->table = NULL;
    }

    public function flag($comment_id, $flag)
    {

        $this->db->update($this->table,
            array('flagged' => $flag),
            array('ID' => $comment_id));

    }

    public function add_new_comment($post_id, $app_user_id, $string_content, $name)
    {

        $content = array(
            "comment" => $string_content,
            "post_id" => intval($post_id),
            "user" => intval($app_user_id),
            "name" => $name,
            "post_type" => get_post_type(intval($post_id))
        );
        $this->db->insert($this->table, $content);
    }

    public function default_comment()
    {
        return $this->get_comment($this->post_id);
    }

    public function get_comment($pid, $threads = 10, $start = 0)
    {

        // $t = $this->table;
        $s = $this->db->prepare("SELECT * FROM $this->table WHERE post_id=%d ORDER BY creationtime DESC", $pid);
        $c = $this->db->prepare("SELECT COUNT(*) FROM $this->table WHERE post_id=%d ORDER BY creationtime DESC", $pid);
        // inno_log_db::log_admin_coupon_management(-1, 20202, print_r($s, true));
        $result = $this->db->get_results($s);

        //   inno_log_db::log_admin_coupon_management(-1, 20202, print_r($s, true));
        $this->total_results = intval($this->db->get_var($c));
        foreach ($result as &$object) {
            $object->ID = intval($object->ID);
            $object->post_id = intval($object->post_id);
            $object->flagged = intval($object->flagged);
            $object->user = intval($object->user);
        }
        unset($s);
        unset($c);
        return $result;
    }

    public function get_comment_count($post_id)
    {


        $c = $this->db->prepare("SELECT COUNT(*) FROM $this->table WHERE post_id=%d ORDER BY creationtime DESC", $post_id);

        return intval($this->db->get_var($c));
    }

    public function get_counts_from_id($post_id)
    {


        $c = $this->db->prepare("SELECT COUNT(*) FROM $this->table WHERE post_id=%d ORDER BY creationtime DESC", $post_id);

        return array(
            "comment_count" => intval($this->db->get_var($c)),
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
        return $count;
    }

    public function get_share_count()
    {
        $count = get_post_meta($this->post_id, "share_count", true);
        return intval($count);
    }

    /** remove the existing comment
     * @param $qque
     * @throws Exception
     */
    public function remove($qque)
    {

        if (!isset($qque->comment_id)) throw new Exception("comment id is not exist", 1059);
        if (!isset($qque->user)) throw new Exception("user id is not exist", 1058);
        if (!isset($qque->reference_id)) throw new Exception("reference_id id is not exist", 1057);
        $id = intval($qque->reference_id);
        $user = intval($qque->user);
        $comment_id = intval($qque->comment_id);

        $r_detail = $this->db->prepare("SELECT COUNT(*) FROM $this->table WHERE post_id=%d AND user=%d AND ID=%d", $comment_id, $user, $id);
        $result = $this->db->get_row($r_detail);
        if ($result) {
            $this->db->delete($this->table, array("ID" => $id), array("ID" => "%d"));
        } else {
            throw new Exception("you are not allow to remove this comment", 1056);
        }
    }


} 