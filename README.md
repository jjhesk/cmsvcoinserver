Content Control System Core
==============
This part of the server will handle massive complex transactions from the customer to inventory management system. 
Features are listed as below:

##feature listing:
 - Inventory Listing System
 - Stock Count Management System
 - Reward Listing Management System
 - e-Tickets Listing and Management System
 - Tasking for Luck Draw Prize
 - Multiple Layers for string translations including rewards and coupons
 - App hosting and listiing system
 - Automated email and template system

##setup instruction
1. Download the package first
2. Install Dependency packages:
 * [Titan Framework](https://github.com/gambitph/Titan-Framework)
 * [WordPress Importer](https://github.com/wp-plugins/wordpress-importer)
 * [Meta Box](https://github.com/rilwis/meta-box)
 * [JSON API](https://github.com/dphiffer/wp-json-api)
 * [JSON API Auth](https://github.com/jjhesk/json-api-auth-Wordpress)
 * [Advanced Taxonomy Terms Order](http://www.nsp-code.com/premium-plugins/wordpress-plugins/advanced-taxonomy-terms-order/)
 * [Categories Images](https://github.com/jjhesk/CateImages-Wordpress)
 * [BlackBox]
 * [Debug Bar Console]
 * [Debug Bar]
 * [Members]
 * [Vcoin Term Display]
 * [WP Condition]
 * [WP Last Login]
 * [Gravity Forms](http://www.gravityforms.com/) full package
 * [WPML](http://wpml.org/zh-hans/) full package
3. Install the theme zip and upload into the theme folder.
4. Active the theme

version: 1.32


##Table of Contents
1. Domain
2. VCoin or SDK APP Login
  2.1. Step 1 get nonce
  2.2. Step 2 generate token and the hash generation concept
  2.3. Step 3 token and app key usage
  2.4. renew token
	
3. User Registration
5. Access API from the SDK after successful login. 
 - Sample API
 - Display User Data
 - Change User Detail
 -- Change of Password
5.3.2 Country list
5.4 Move Coins
5.5 Watch Video move coin
5.6 Change Request
5.7 Upload Personal Image for Profile
6. Redemption
	6.1 Redeem Submission for Vcoin App
	6.2 Redeem Listing
	6.2.1 Explain for status
	6.3 Redeem Coupon Submission
	6.4 Callback Transaction from Vcoin Server
7. Reward Scan and Retrieve of Reward Gift/Services
	7.1 Scan and Pick Up Process For Restaurant or Retail Business
		7.1.1 Step 1. Initially scan the QR code from the App 
		7.1.2 Step 2. The store device will then submit the second request to the authentication server for final transaction for the pickup process
	7.2 Scan and Pick Up Process For Redemption Center
		7.2.1 Explain redemption_procedure, note, and handle
	7.3 Simple Scan Pick Up
	7.4 Complex Scan Pick Up
	7.5 Demo scan API SMS
8. Social Plugin
	8.1 Like or Follow pages
9.Vcoin History
9.1 Display VCoin History and the related actions
10 Comment
10.1 Add Comment
10.2 Flag Comment
10.3 Remove Comment
11. Get Vcoin Balance
12. Mission
	12.1 Finished Missions
	12.2 Unfinished Missions
	12.3 Check Point
	12.4 Mixed Mission List
	12.5 Download App From VcoinApp
	12.6 Start App with SDK
	12.7 Handling Alternative Results
13. Coupon Listing
	13.1 User redempted list for coupons
	13.2 User redempted list for rewards

14. Login gateway contains a list of api for VCoinApp
15. Common Errors and handlings
16. WebView Support Development
17. Production Information


##API instructions
https://docs.google.com/a/it.imusictech.com/document/d/1y2pw11TblzluGQA_4TOBKFBYjbIKvaFyo3_V82_-y5c/edit
https://docs.google.com/document/d/1y2pw11TblzluGQA_4TOBKFBYjbIKvaFyo3_V82_-y5c/pub
