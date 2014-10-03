<?php
/**
 * Header Template
 *
 * The header template is generally used on every page of your site. Nearly all other
 * templates call it somewhere near the top of the file. It is used mostly as an opening
 * wrapper, which is closed with the footer.php file. It also executes key functions needed
 * by the theme, child themes, and plugins.
 *
 * @package deTube
 * @subpackage Template
 * @since deTube 1.0
 */
?><!DOCTYPE html>
<!--[if IE 6]>
<html class="ie ie6 oldie" <?php language_attributes(); ?>><![endif]-->
<!--[if IE 7]>
<html class="ie ie7 oldie" <?php language_attributes(); ?>><![endif]-->
<!--[if IE 8]>
<html class="ie ie8 oldie" <?php language_attributes(); ?>><![endif]-->
<!--[if IE 9]>
<html class="ie ie9" <?php language_attributes(); ?>><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->
<html <?php language_attributes(); ?> ><!--<![endif]-->
<head> <!-- Meta Tags -->
    <meta charset="<?php bloginfo('charset'); ?>"/>
    <?php
    $viewport = '';
    //        'width=device-width';
    //if (get_option('dp_responsive')) {
        $viewport .= ', initial-scale=1, maximum-scale=1';
        $viewport .= ', user-scalable=no, min-device-pixel-ratio=1, max-device-pixel-ratio=1';
        // $viewport.=',max-device-width=640';
    //}
    ?>
    <meta name="viewport" content="<?php echo $viewport; ?>"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <link rel="profile" href="http://gmpg.org/xfn/11"/>
    <?php if ($favicon = get_option('dp_favicon')) echo '<link rel="shortcut icon" href="' . $favicon . '" />' . "\n"; ?>
    <?php
    wp_head();
    ?>
</head>
<body <?php body_class(); ?>>
<div id="page">
    <div id='fb-root'></div>
<?php do_action('dp_after_header_php'); ?>