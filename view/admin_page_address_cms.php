<table id="datainput" class="form-table">
    <tr>
        <th>Chinese Traditional:</th>
        <td><input id="zh_short" class="regular-text zh-short" type="text" placeholder="short name"/>
            <input id="zh_full" class="regular-text zh" type="text" placeholder="full name"/></td>
    </tr>
    <tr>
        <th>Japanese:</th>
        <td><input id="ja_short" class="regular-text ja-short" type="text" placeholder="short name"/>
            <input id="ja_full" class="regular-text ja" type="text" placeholder="full name"/></td>
    </tr>
    <tr>
        <th>English:</th>
        <td>
            <input id="en_short" class="regular-text en-short" type="text" placeholder="short name"/>
            <input id="en_full" class="regular-text en" type="text" placeholder="full name"/></td>
    </tr>
    <tr>
        <th>Terminal Number (phone number for sms):</th>
        <td><input id="sms_no" class="regular-text" type="text" placeholder="sms"/></td>

    </tr>
    <tr>
        <th>Contact Number:</th>
        <td><input id="contact_no" class="regular-text" type="text" placeholder="phone number"/></td>
    </tr>
    <tr>
        <th>Email:</th>
        <td><input id="email" class="regular-text" type="email" placeholder="email"/></td>
    </tr>
    <tr>
        <th>Office Hours For Redemption Operations:</th>
        <td><input id="business_hr" class="regular-text" type="text" placeholder="opening hours"/></td>
    </tr>
    <tr>
        <th>Country:</th>
        <td>
            <select id="country">
                <option value="na">Select a country</option>
                <option value="hongkong">Hong Kong</option>
                <option value="japan">Japan</option>
                <option value="usa">United State</option>
            </select>
        </td>
    </tr>
    <tr>
        <th>ID:</th>
        <td><input id="address_id" class="regular-text" type="text" placeholder="" disabled/></td>
    </tr>
    <tr>
        <th></th>
        <td>
            <button class="button btn-primary button-primary" id="add_entry">Add Entry</button>
            <button class="button btn-primary button-primary hidden" id="update_entry">Update Entry</button>
            <button class="button btn-primary button-primary hidden" id="cancel_update">Cancel</button>
        </td>
    </tr>
</table>

<table id="admin_vendor_address_table" class="display" cellspacing="0" width="100%">
    <thead>
    <tr>
        <th>Edit</th>
        <th>ID</th>
        <th>ZH-short</th>
        <th>ZH</th>
        <th>JA-short</th>
        <th>JA</th>
        <th>EN-short</th>
        <th>EN</th>
        <th>Creation Time</th>
    </tr>
    </thead>

    <tfoot>
    <tr>
        <th>Edit</th>
        <th>ID</th>
        <th>ZH-short</th>
        <th>ZH</th>
        <th>JA-short</th>
        <th>JA</th>
        <th>EN-short</th>
        <th>EN</th>
        <th>Creation Time</th>
    </tr>
    </tfoot>
</table>

<script id="edit_address_template" type="text/x-handlebars-template">
    <button class="button edit_address" data-id="{{ID}}">Edit</button>
</script>