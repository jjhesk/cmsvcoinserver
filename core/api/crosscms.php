<?php

/*
  Controller name: Crosscms
  Controller description: Cross CMS controller. <br>Only for the signals from the auth cms <br> Hesk
 */
if (!class_exists('JSON_API_Crosscms_Controller')) {
    class JSON_API_Crosscms_Controller
    {
        /**
         * API Name: api get sliders
         */
        /*    $post = array(
                    'ID'             => [ <post id> ] // Are you updating an existing post?
                    'post_content'   => [ <string> ] // The full text of the post.
                    'post_name'      => [ <string> ] // The name (slug) for your post
                    'post_title'     => [ <string> ] // The title of your post.
                    'post_status'    => [ 'draft' | 'publish' | 'pending'| 'future' | 'private' | custom registered status ] // Default 'draft'.
                    'post_type'      => [ 'post' | 'page' | 'link' | 'nav_menu_item' | custom post type ] // Default 'post'.
                    'post_author'    => [ <user ID> ] // The user ID number of the author. Default is the current user ID.
                    'ping_status'    => [ 'closed' | 'open' ] // Pingbacks or trackbacks allowed. Default is the option 'default_ping_status'.
                    'post_parent'    => [ <post ID> ] // Sets the parent of the new post, if any. Default 0.
                    'menu_order'     => [ <order> ] // If new post is a page, sets the order in which it should appear in supported menus. Default 0.
                    'to_ping'        => // Space or carriage return-separated list of URLs to ping. Default empty string.
                    'pinged'         => // Space or carriage return-separated list of URLs that have been pinged. Default empty string.
                    'post_password'  => [ <string> ] // Password for post, if any. Default empty string.
                    'guid'           => // Skip this and let Wordpress handle it, usually.
                    'post_content_filtered' => // Skip this and let Wordpress handle it, usually.
                    'post_excerpt'   => [ <string> ] // For all your post excerpt needs.
                    'post_date'      => [ Y-m-d H:i:s ] // The time post was made.
                    'post_date_gmt'  => [ Y-m-d H:i:s ] // The time post was made, in GMT.
                    'comment_status' => [ 'closed' | 'open' ] // Default is the option 'default_comment_status', or 'closed'.
                    'post_category'  => [ array(<category id>, ...) ] // Default empty.
                    'tags_input'     => [ '<tag>, <tag>, ...' | array ] // Default empty.
                    'tax_input'      => [ array( <taxonomy> => <array | string> ) ] // For custom taxonomies. Default empty.
                    'page_template'  => [ <string> ] // Requires name of template file, eg template.php. Default empty.
                  );
        */
        public static function addnewapp()
        {
            global $json_api, $current_user;
            try {
                $result = app_host::add_new_app($json_api->query);
                api_handler::outSuccessDataWeSoft($result);
            } catch (Exception $e) {
                inno_log_db::log_admin_stock_management($current_user->ID, $e->getCode(), $e->getMessage());
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * adding count for apps from another cms server api
         */
        public static function add_count_4_app()
        {
            global $json_api, $current_user;
            $post_id = $json_api->query->pid;
            $type = $json_api->query->type;
            if ($type == 'comment') app_host::update_comment_count($post_id);
            if ($type == 'share') app_host::update_share_count($post_id);
            if ($type == 'download') app_host::update_download_count($post_id);
            return api_handler::outSuccess(true);
        }


        /**
         * provided for the app to submit comment about the application
         */
        public static function makingcomment()
        {
            global $json_api;

            $query = $json_api->query;
            try {

                $comment = new AppComment("newcomment");
                $comment->add_new_comment(
                    $query->post_id,
                    $query->userid,
                    $query->comment,
                    $query->name
                );

                api_handler::outSuccess();
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        public static function flagcomment()
        {
            global $json_api;

            $query = $json_api->query;
            try {

                $comment = new AppComment("flagcomment");
                $comment->flag(
                    $query->comment_id,
                    $query->flag
                );

                api_handler::outSuccess();
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }


        /**
         *
         */
        public static function redeemrewardsubmission()
        {
            global $wpdb, $json_api;
            try {
                $t = new Redemption();
                $t->submission($json_api->query);
                api_handler::outSuccessDataWeSoft($t->get_result());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         *
         */
        public static function redeemcoupon()
        {
            global $wpdb, $json_api;
            try {
                $t = new Redemption();
                $t->redeem_coupon($json_api->query);
                api_handler::outSuccessDataWeSoft($t->get_result());
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        public static function get_claim_history_rewards()
        {

            global $json_api, $wpdb;
            try {
                $json_api_query = $json_api->query;
                // if (!isset($json_api_query->type)) throw new Exception("query type is missing.", 1001);
                $transaction_table = $wpdb->prefix . "post_redemption";
                $additional_query = "";

                if (isset($json_api_query->stock_id)) {
                    $additional_query .= " AND stock_id=" . $json_api_query->stock_id;
                }

                if (isset($json_api_query->distribution)) {
                    $additional_query .= " AND distribution='" . $json_api_query->distribution . "'";
                }

                if (isset($json_api_query->vcoin)) {
                    $additional_query .= " AND vcoin=" . $json_api_query->vcoin;
                }

                if (isset($json_api_query->address)) {
                    $additional_query .= " AND address=" . $json_api_query->address;
                }

                if (isset($json_api_query->obtained)) {
                    $additional_query .= " AND obtained=" . $json_api_query->obtained;
                }
                if (!isset($json_api_query->user_id)) {
                    throw new Exception("user Id is not provided", 1077);
                }
                $SQL = $wpdb->prepare("SELECT * FROM $transaction_table WHERE user=%d $additional_query ORDER BY time DESC", $json_api_query->user_id);
                $results = $wpdb->get_results($SQL);
                $__array = array();
                foreach ($results as $rowdata) {
                    $reward = new SingleRewardHistory($rowdata->stock_id);
                    $__array[] = array(
                        "user" => intval($rowdata->user),
                        "amount" => intval($rowdata->vcoin),
                        "trace_id" => $rowdata->trace_id,
                        "qr_a" => $rowdata->qr_a,
                        "qr_b" => $rowdata->qr_b,
                        "handle" => intval($rowdata->handle_requirement),
                        "status" => intval($rowdata->vstatus),
                        "detail" => $reward->get_result(),
                    );
                    unset($reward);
                }
                unset($results);
                api_handler::outSuccessDataWeSoft($__array);
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * display a list redempted e-coupon items
         */
        public static function user_redempted_e_coupon_list()
        {
            global $wpdb, $json_api;
            $query = $json_api->query;
            $table = $wpdb->prefix . "post_coupon_claim";
            try {
                $sql = $wpdb->prepare("SELECT * FROM $table WHERE redeem_agent=%d ORDER BY time(claim_time) DESC", $query->user);
                $rows = $wpdb->get_results($sql);
                $arr = array();
                if (count($rows) === 0) throw new Exception("data not found", 1091);
                foreach ($rows as $r) {
                    $id = $r->coupon_id;
                    $arr[] = array(
                        "status" => $r->vstatus,
                        "claim_time" => $r->claim_time,
                        "vcoin_expense" => intval($r->coin_spent),
                        "client_coupon_code" => $r->client_redeem_code,
                        "detail" => RCoupon::inloop($id),
                    );
                }
                unset($rows);
                api_handler::outSuccessDataWeSoft($arr);
            } catch (Exception $e) {
                api_handler::outFail($e->getCode(), $e->getMessage());
            }
        }

        /**
         * cms use only
         */
        public static function get_developer_related_app_ids()
        {
            global $wpdb, $json_api;
            $postmeta_table = $wpdb->prefix . "postmeta";
            $query = $wpdb->prepare("SELECT post_id FROM $postmeta_table WHERE meta_key=%s
                                                AND meta_value=%d", "_developer", $json_api->query->id);
            $total_apps = $wpdb->get_results($query);
            api_handler::outSuccessDataWeSoft($total_apps);
        }

        /**
         * get app post ID
         */
        public static function get_app_post_id()
        {
            global $wpdb, $json_api;
            $post_table = $wpdb->prefix . "posts";
            $query = $wpdb->prepare("SELECT ID FROM $post_table WHERE post_status=%s",
                $json_api->query->post_status);

            $all_pending_apps = $wpdb->get_results($query);

            api_handler::outSuccessDataWeSoft($all_pending_apps);
        }

        public static function get_transaction_history(){

        }
    }
}