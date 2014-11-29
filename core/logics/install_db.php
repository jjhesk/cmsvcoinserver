<?php

/**
 * Created by HKM Corporation.
 * User: Hesk
 * Date: 14年11月3日
 * Time: 下午6:22
 */
class install_db
{
    private $db;
    private $api_tables;

    /**
     *
     */
    function __construct()
    {
        global $wpdb;
        $this->db = $wpdb;
        $this->api_tables = array(
            'app_comment' => $wpdb->prefix . 'app_comment',
            'app_log' => $wpdb->prefix . 'app_log',
            'post_coupon_claim' => $wpdb->prefix . 'post_coupon_claim',
            'post_redemption' => $wpdb->prefix . 'post_redemption',
            'stock_address' => $wpdb->prefix . 'stock_address',
            'stock_count' => $wpdb->prefix . 'stock_count'
        );
    }

    public static function install_db_manually()
    {
        $k = new self();
        $k->create_tables();
        $k = NULL;
    }

    public static function registration_plugin_hooks($file_plugin_location_path)
    {
        $k = new self();
        $k->_registration_table($file_plugin_location_path);
        $k = NULL;
    }

    /**
     * register the plugin hooks for the table actions
     * @param $file_location
     */
    public function _registration_table($file_location)
    {
        if (function_exists('register_activation_hook'))
            register_activation_hook($file_location, array($this, 'create_tables'));
        if (function_exists('register_deactivation_hook'))
            register_deactivation_hook($file_location, array($this, 'fake_drop_table'));
    }

    /**
     * tutorial to getting the table code on the console.
     * install console debug bar
     * go to debug on the top right hand corner
     * go click on the console tab
     * choose the SQL tab
     * type in..
     *
     * show create table vapp_app_login_token_banks
     * show create table vapp_app_app_log
     * show create table vapp_app_action_reward
     * show create table vapp_oauth_api_consumers
     * ...
     *
     * copy and paste the code from there to here
     *
     * remove ` character
     *
     * create tables
     */
    public function create_tables()
    {
        $charset_collate = '';
        if ($this->db->has_cap('collation')) {
            $charset_collate .= 'ENGINE=InnoDB AUTO_INCREMENT=727 ';
            if (!empty($this->db->charset))
                $charset_collate = 'DEFAULT CHARACTER SET ' . $this->db->charset;
            if (!empty($this->db->collate))
                $charset_collate .= ' COLLATE ' . $this->db->collate;
        }

        $this->db->query(
            "CREATE TABLE IF NOT EXISTS {$this->api_tables['app_comment']} (
			ID bigint(20) NOT NULL AUTO_INCREMENT,
 post_id bigint(20) NOT NULL,
 post_type varchar(100) COLLATE utf8_bin NOT NULL,
 comment mediumtext COLLATE utf8_bin NOT NULL,
 flagged tinyint(4) NOT NULL DEFAULT '0',
 creationtime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 user bigint(20) NOT NULL,
 name varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
 PRIMARY KEY (ID),
 UNIQUE KEY ID (ID),
 KEY app_post_id (post_id)
			) $charset_collate;");

        $this->db->query(
            "CREATE TABLE IF NOT EXISTS {$this->api_tables['app_log']} (
               ID bigint(20) NOT NULL AUTO_INCREMENT,
 user bigint(20) NOT NULL,
 comments longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
 time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 event_code bigint(20) NOT NULL,
 error_code bigint(20) NOT NULL,
 PRIMARY KEY (ID)
			) $charset_collate;");

        $this->db->query(
            "CREATE TABLE IF NOT EXISTS {$this->api_tables['post_coupon_claim']} (
			ID bigint(20) NOT NULL AUTO_INCREMENT,
 client_redeem_code varchar(300) COLLATE utf8_bin NOT NULL,
 coupon_id bigint(20) NOT NULL,
 redeem_agent bigint(20) NOT NULL DEFAULT '-1',
 coin_spent mediumint(9) NOT NULL,
 trace_id text COLLATE utf8_bin NOT NULL,
 vstatus tinyint(4) NOT NULL,
 game_type int(3) NOT NULL DEFAULT '0' COMMENT 'game type',
 exp_date date NOT NULL,
 time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 claim_time timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 PRIMARY KEY (ID)
			) $charset_collate;");

        $this->db->query(
            "CREATE TABLE IF NOT EXISTS {$this->api_tables['post_redemption']} (
			 ID bigint(20) unsigned NOT NULL AUTO_INCREMENT,
 trace_id text COLLATE utf8_bin NOT NULL,
 vstatus tinyint(4) NOT NULL,
 qr_a varchar(32) COLLATE utf8_bin NOT NULL,
 qr_b varchar(32) COLLATE utf8_bin NOT NULL,
 distribution enum('DECEN','CENTRAL') COLLATE utf8_bin NOT NULL,
 handle_mac_address varchar(17) COLLATE utf8_bin NOT NULL COMMENT 'mac address from the staff machine',
 handle_terminal_id int(11) NOT NULL,
 handle_requirement bigint(20) NOT NULL,
 names longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
 action_taken_by enum('ADMIN','ID','QR','NA','RESTAURANT') COLLATE utf8_bin NOT NULL DEFAULT 'NA',
 user bigint(20) NOT NULL COMMENT 'beneficiary',
 stock_id bigint(20) NOT NULL,
 vcoin int(11) NOT NULL,
 obtained int(1) NOT NULL DEFAULT '0',
 address bigint(20) NOT NULL,
 offer_expiry_date date NOT NULL COMMENT 'scan expiration',
 claim_time datetime NOT NULL COMMENT 'when the product is claimed',
 time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (ID)
			) $charset_collate;");

        $this->db->query(
            "CREATE TABLE IF NOT EXISTS {$this->api_tables['stock_address']} (
          ID bigint(20) NOT NULL AUTO_INCREMENT,
 email_opt enum('optin','optout') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'optout',
 terminal varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 zh text COLLATE utf8_unicode_ci NOT NULL,
 short_zh varchar(20) COLLATE utf8_unicode_ci NOT NULL,
 cn text COLLATE utf8_unicode_ci NOT NULL,
 short_cn varchar(20) COLLATE utf8_unicode_ci NOT NULL,
 en text CHARACTER SET latin1 NOT NULL,
 short_en varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
 ja text COLLATE utf8_unicode_ci NOT NULL,
 short_ja varchar(20) COLLATE utf8_unicode_ci NOT NULL,
 contact_number varchar(20) CHARACTER SET latin1 NOT NULL,
 email varchar(300) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
 business_hour varchar(30) COLLATE utf8_unicode_ci NOT NULL,
 country enum('macau','hongkong','china','usa','japan') CHARACTER SET hp8 NOT NULL DEFAULT 'hongkong',
 date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (ID),
 UNIQUE KEY ID (ID)
			) $charset_collate;");

        $this->db->query(
            "CREATE TABLE IF NOT EXISTS {$this->api_tables['stock_count']} (
       ID bigint(20) NOT NULL AUTO_INCREMENT,
 label varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
 stock_id bigint(20) NOT NULL,
 extension tinyint(4) NOT NULL,
 distribution enum('NA','DECEN','CENTRAL') COLLATE utf8_bin NOT NULL,
 count mediumint(9) NOT NULL,
 location_id bigint(20) NOT NULL,
 qr varchar(36) COLLATE utf8_bin NOT NULL,
 PRIMARY KEY (ID)
			) $charset_collate;");

    }

    /**
     * drop tables
     */
    public function drop_tables()
    {
        foreach ($this->api_tables as $key => $table) {
            $this->db->query("DROP TABLE IF EXISTS {$table};");
        }
    }

    public function fake_drop_table()
    {

    }

} 