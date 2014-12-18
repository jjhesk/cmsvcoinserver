<div class="wrap">
    <div id="icon-settings" class="icon32"></div>
    <h2>General Settings</h2>

    <form id="form_data" name="form" method="post">
        <br/>
        <?php echo $content; ?>
        <p class="submit">
            <input type="submit" name="Submit" class="button-primary" value="<?php _e('Save Settings', 'atto') ?>">
        </p>
        <input type="hidden" name="form_submit" value="true"/>
    </form>
</div>