<?php

/**
 * Created by HKM Corporation
 * User: Hesk
 * Date: 14年11月5日
 * Time: 下午1:22
 * This is to carry out the lucky draw process
 */
class CouponOperation extends CouponLogic
{
    private $lucky;
    protected $data, $total;
    var $instance;
    protected $total_count;

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Return an instance of this class.
     * @since     1.0.0
     * @internal param $process_post_id
     * @return    object    A single instance of this class.
     */
    public static function get_instance()
    {
        // If the single instance hasn't been set, set it now.
        if (null == self::$instance)
            self::$instance = new self();

        return self::$instance;
    }


    private static function get_custom_query()
    {
        $query = array();
        $meta_query = array();
        $meta_query[] = array(
            "key" => "inn_exp_date",
            "value" => date("Y-m-d"),
            "compare" => "LIKE"
        );
        $meta_query[] = array(
            "key" => "game_type",
            "value" => "luck_draw",
            "compare" => "LIKE"
        );
        $meta_query["relation"] = "AND";
        $query["meta_query"] = $meta_query;
        return $query;
    }


    public static function _coupon_operation()
    {
        $coupon_list = new CouponPrizer(self::get_custom_query());
      //  inno_log_db::log_admin_coupon_management(-1, 7771, "_coupon_operation for the daily lucky draw is started!");
      //  inno_log_db::log_admin_coupon_management(-1, 7772, print_r(self::get_custom_query(), true));
        $array_list = $coupon_list->getResultArr();
        $log_message = "";
        foreach ($array_list as &$data) {
            try {
                $luck_draw_operation = new self();
                $luck_draw_operation->init($data["id"]);
                //   $log_message .= "Item name: " . $luck_draw_operation->get_tag() .
                //   ". Lucky draw has been drawn and the lucky ones are revealed in these codes: " .


                $codes = $luck_draw_operation->get_lucky_codes();

                $log_message .= "|" . $data["id"] . "|" . print_r($codes, true);
                $luck_draw_operation = NULL;
            } catch (Exception $e) {
                continue;
            }
        }
        $log_message = "This result announced that there are prizes drawn from the pot. The detail is listed as shown below: " . $log_message;

        inno_log_db::log_admin_coupon_management(-1, 777, $log_message);
        self::mail($log_message);

        return $log_message;
    }

    private static function mail($message)
    {
        $headers = "From: vCoin CMS<admin@cms.vcoinapp.com>" . "\r\n";
        wp_mail(get_option("admin_email"), "vCoin." . SERVER_STATE . " - draw prize result", $message, $headers, "");
    }

    public static function install_cron()
    {
        add_action("coupon_operation", array(__CLASS__, "_coupon_operation"));

        if (!wp_next_scheduled("coupon_operation")) {
            wp_schedule_event(current_time("timestamp"), "daily", "coupon_operation");
        }
    }

    /**
     * register the plugin hooks for the table actions
     * @param $file_location
     */
    public static function registration_plugin_hooks($file_location)
    {
        if (function_exists("register_activation_hook"))
            register_activation_hook($file_location, array(__CLASS__, "install_cron"));
        if (function_exists("register_deactivation_hook"))
            register_deactivation_hook($file_location, array(__CLASS__, "uninstall_cron"));
    }

    public static function uninstall_cron()
    {
        if (wp_next_scheduled("coupon_operation")) {
            wp_clear_scheduled_hook("coupon_operation");
        }
    }


    public function init($post_id)
    {
        $this->post_id = (int)$post_id;
        $this->total_count = (int)get_post_meta($post_id, "stock_available_total", true);
        if ($this->total_count === 0) return;
        $this->data = $this->get_claim_data($post_id);
        $this->lucky_draw();
    }

    private function change_type($ID)
    {
        $t = array(
            'game_type' => 777,
        );
        $this->db->update(
            $this->table,
            $t,
            array(
                'ID' => (int)$ID
            ),
            array(
                '%d'
            ),
            array(
                '%d'
            )
        );
    }

    public function reverse()
    {
        $this->data = $this->get_claim_data($this->post_id);
        $nn = $this->total_count;
        $this->lucky = array();
        shuffle($this->data);
        while ($nn > 0) {
            $this->lucky[] = $this->data[$nn]["client_redeem_code"];
            $this->change_type_zero($this->data[$nn]["ID"]);
            $nn--;
        }
        $this->data = NULL;;
    }

    private function change_type_zero($ID)
    {
        $t = array(
            'game_type' => 0,
        );
        $this->db->update(
            $this->table,
            $t,
            array(
                'ID' => (int)$ID
            ),
            array(
                '%d'
            ),
            array(
                '%d'
            )
        );
    }

    private function lucky_draw()
    {
        if ($this->data) {
            $this->lucky = array();
            $nn = $this->total_count;
            $hh = count($this->data);

            if ($hh < $nn) {
                $nn = $hh;
            }
            shuffle($this->data);
            while ($nn > 0) {
                $this->lucky[] = $this->data[$nn]["client_redeem_code"];
                $this->change_type($this->data[$nn]["ID"]);
                $nn--;
            }
            inno_log_db::log_admin_coupon_management(-1, 90832, print_r($this->data, true));
            $this->data = NULL;
        } else {
            throw new Exception("data not found in the claim list", 90831);
        }
    }

    public function get_tag()
    {
        return get_the_title($this->post_id);
    }

    /**
     * @return array
     */
    public function get_lucky_codes()
    {
        return $this->lucky;
    }
} 