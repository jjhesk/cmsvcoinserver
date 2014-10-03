<?php
/**
 * Created by PhpStorm.
 * User: Hesk
 * Date: 14年2月10日
 * Time: 上午9:44
 */
defined('ABSPATH') || exit;

if (!class_exists('email_confirmation_verify')) {
    class email_confirmation_verify extends gformBase
    {
        private $email, $hash, $rgid, $check_confirmation_uid;

        public function __construct()
        {
            $ready = 0;
            if (isset($_GET["email"])) {
                $this->email = $_GET["email"];
                $ready++;
            }
            if (isset($_GET["hash"])) {
                $string = $_GET["hash"];
                //  $string = urlencode($_GET["hash"]);
                //  $string = str_replace("+", "%2B",$string);
                //  $this->hash = urldecode($string);
                $this->hash = $string;
                $ready++;
            }
            if (isset($_GET["rgi"])) {
                $this->rgid = $_GET["rgi"];
                $ready++;
            }

            /*if (isset($_POST["vid"])) {
                $this->check_confirmation_uid = intval($_POST["vid"]) > 0 ? intval($_POST["vid"]) : false;
                if ($this->check_confirmation_uid) {
                    $this->json_check_email_confirmation_uid();
                }
                return;
            }*/

            if ($ready == 3) {
                $this->input_var_completed_action();
            } else {
                if (isset($_POST['note']))
                    $this->render_email_verification_form($_POST['note']);
                else
                    api_handler::outputJson(array(
                        'result' => 'failure',
                        'code' => 100205,
                        'msg' => 'required params are not given1'
                    ));
            }
        }

        private function json_check_email_and_create_user_account()
        {
            $r = gfUserRegistration::isEmailVerified($this->hash, $this->rgid);
            if ($r) {
                api_handler::outputJson(array("result" => 1));
            } else {
                api_handler::outputJson(array("result" => 0));
            }
        }

        private function render_email_verification_form($message)
        {
            get_header();
            if (class_exists("RGFormsModel")) {
                if (is_user_logged_in()) {
                    if ($message == "1") {
                        $message = "please verify your email first";
                    } else {
                        $message = "";
                    }

                    ?>
                    <div id="main">
                        <div class="wrap cf">
                            <div id="content" class="email_confirmation_input" role="main">
                                <div class="wrapper">
                                    <?php
                                    echo $message;
                                    gravity_form(GF_EMAIL_VERIFY, $display_title = true, $display_description = true, $display_inactive = false, $field_values = null, $ajax = true);
                                    ?>
                                </div>
                            </div>
                            <!-- end #content -->
                        </div>
                    </div><!-- end #main -->
                <?php
                } else {
                    echo "user is not login";
                }
            } else {
                echo "gform is not active";
            }
            get_footer();
        }

        private function find_verify_error($code)
        {
            switch ($code) {
                case 995126:
                    return "email verification: email not matched";
                case 995027:
                    return "email verification: ID name not found";
                case 995138:
                    return "email verification: HKID not found";
                case 995165:
                    return "the password code does not match";
                case 995125:
                    return "the specific user did not found";
            }

        }

        private function render($message)
        {
            //$logo;
            get_header('email_respnse_name');
            //if ($logo = get_option('dp_login_logo')) {
                ?>
                <div class="notice"><img class="aligncenter" src=""/>
                    <span class="aligncenter"><?= $message; ?></span>
                </div>
            <?php
            //}
            get_footer('email_respnse_name');
        }

        private function input_var_completed_action()
        {
            $check_hash = parent::gf_get_entry_value(GF_FORM_USER_REG, $this->rgid, gf_field_email_token);
            $check_pending_list_email = parent::gf_get_entry_value(GF_FORM_USER_REG, $this->rgid, gf_field_email);
            $check_pending_list_username = parent::gf_get_entry_value(GF_FORM_USER_REG, $this->rgid, gf_field_login_name);
            $check_pending_list_password = parent::gf_get_entry_value(GF_FORM_USER_REG, $this->rgid, gf_field_password);
            $check_pending_list_company_name = parent::gf_get_entry_value(GF_FORM_USER_REG, $this->rgid, gf_field_company);


            if ($check_hash == $this->hash && !email_exists($check_pending_list_email)) {
                //$user_id = wp_create_user($check_pending_list_username, $check_pending_list_password, $check_pending_list_email);

                try {
                    $new_user = new userRegister();
                    $new_user->newUser($check_pending_list_username, $check_pending_list_email, "appuser", array(
                        "company_name"=>$check_pending_list_company_name
                    ), $check_pending_list_password );
                }
                catch (Exception $e){
                    $this->render($e->getMessage());
                    exit;
                }


                $this->render("Verify success. Please login your app and start getting fun!");
            }

            else {
                $this->render("Email verify is not success. As you have registered this Username before.");
            }


                /*if ($this->junit) {
                    print_r($user_id);
                }*/
                //add_action('user_register','trash_public_admin_bar');
                // function trash_public_admin_bar($user_ID) {

                /*if (is_wp_error($user_id)) {
                    //parent::loginfail(10402, "token login does not match with our internal fbid");
                    inno_log_db::log_login_china_server_info(-1,
                        $user_id->get_error_code(),
                        $user_id->get_error_message()
                        . ", Email:" . $email_reg
                        . ", FbID also User_name: " . $facebook_id .
                        ", User name: " . $user_name
                        , $token
                    );
                    return false;
                } else if (is_numeric($user_id)) {
                    if ($user_id > 0 && $user_id != 1) {
                        wp_update_user(array('ID' => $user_id, 'role' => 'fbuser'));
                        update_user_option($user_id, 'show_admin_bar_front', 'false');
                        // update_user_meta($user_id, 'dismissed_wp_pointers', get_user_meta(1, 'dismissed_wp_pointers'));
                        add_user_meta($user_id, 'vcoin', 0);
                        add_user_meta($user_id, 'id4digit', '');
                        add_user_meta($user_id, 'country_code', 'HK');
                        //parent::bind_facebook_id($user_id, $facebook_id);
                        //parent::renew_token($user_id, $token);
                        //parent::renew_nicename($user_id, $user_name);
                        return true;
                    }
                } else {
                    return false;
                }*/

            //$r = inno_db::email_action_verify($this->rgid, $this->email, $this->hash);
            /*if ($r == 1) {
                $this->render("Verify success. Please login your app and start getting fun!");
            } else {
                //inno_log_db::log_redemption_error(-1, $this->find_verify_error($r), $r);
                $this->render("Email verify is not success. code: " . $r);
            }*/
        }

    }
}