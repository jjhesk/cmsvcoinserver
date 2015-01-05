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
2. Install Dependency packages: Advanced Taxonomy Terms Order,  BlackBox, Categories Images, Debug Bar Console,  Debug Bar, Gravity Forms, JSON API, Members, Meta Box, Titan Framework, Vcoin Term Display, WordPress Importer, WP Condition, WP Last Login, WPML Multilingual CMS, WPML String Translation, WPML Translation Management
3. Install the theme zip and upload into the theme folder.
4. Active the theme



iMusicTech
Author: Heskeyo Kam
Issued: 12/4/2015
version: 1.32
LOGIN API
For authentication server api documentation

Table of Contents
1. Domain
2. VCoin or SDK APP Login
	2.1 Step 1 get nonce
	2.2 Step 2 generate token and the hash generation concept
	2.3 Step 3 token and app key usage
	2.4 renew token
3. User Registration
5. Access API from the SDK after successful login. 
5.1 Sample API
5.2 Display User Data
5.3 Change User Detail
	5.3.1 Change of Password
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





1. Domain
Current domain for {domain}:

Domain
IP
Point to Server Name
cms.vcoinapp.com
54.187.234.80 
Vcoin CMS Production Server
devcms.vcoinapp.com
 54.187.23.89
Vcoin CMS Staging Server
login.vcoinapp.com
54.186.82.140 
Vcoin Authentication Production Server


devlogin.vcoinapp.com
 54.191.0.137
Vcoin Authentication Staging Server
www.vcoinapp.com
 54.191.167.247
(already done) Vcoin Portal Production Server
devwww.vcoinapp.com
 54.186.224.44
Vcoin Portal Staging Server






2. VCoin App and SDK Login
Introduction:
We will need to go to the back end to register a pair of app KEY and SECRET first. And using that to make proper login for the SDK and the vCoinapp. As of version 0.98, the login API for vcoin app and the login API for SDK will merged into one API. This API handles both SDK and Vcoinapp login API request. The API concept is illustrated as below:


Vcoin App login will need to go thru 3 steps process and they are listed as below:

2.1 Step 1 - acquiring nonce
Server side API endpoint using GET method
response example
{domain}/api/get_nonce/?controller=auth&method=generate_auth_cookie
{"status":"ok","controller":"auth","method":"generate_auth_cookie","nonce":"2d0edc3b41"}

GET:
URL={domain}/api/get_nonce/?controller=auth&method=generate_auth_cookie
Parameters
controller=auth
method=generate_auth_cookie

Response
response json{
nonce:[string obtain this nonce and save on the local machine]
method:[string]
controller:[string]
status:[string]
}

Response ----- failure
response json{
status:[string error]
error: [string the reason to support to the error]
}

2.2 Step 2 - generate token with credentials
Initialize login information with the key value nonce from the step 1 and login with the user name and the password to obtain the access token.

VcoinApp key and secret should be kept in a secured place
VcoinApp and secret:
vcoinapp app secret: oW7C5ADpUiMr9ouz
vcoinapp app key: yoqzLezk
vcoinapp app hash: referer to 4.0 section
hash for vcoinapp app key:
a81f4ea20b03e7861af745b03b9cb1785166bb7e0beaa62cdcf3597885a05c7cbfe7f6a54dcb16de7569287b7bac505115a54af7a0fd7e0a67d96d040f775cc9
Sample APP ID and secret:
App name: om.zhiyuanluo.app001
ios app id: 735058660
App ID (APP KEY):  2YVw8u9o
Secret: 93ZaX34iE4l3yskR
Post ID: 1001
sample app hash: c9c4d8a3a2486429cb689b031b31fa381395f5858adb8bb7dbd2f423e1c0c8419aa25e6614c2ad430c95e24856449fbf6b736385fc3b7843938688bc5b59722a
Sample Test User Account
login: hesk@it.imusictech.com
pass: 1234
Implementation concept:
app key + app secret  + SHA512 = app hash
by using the SHA512 method to encode the concat string app key and app secret and convert into app hash. The app key and the app secret will need to be coded or hard coded in the SDK or somewhere provided in xml in android development environment or string file in iOS. The SDK will need to use the app key and app secret to make proper calculation with SHA512 to find the app hash. The app hash will then be submitted to the server.

GET:
URL={auth domain}/api/auth/generate_token/

Parameters
required
type
content
nonce
yes
string
the nonce retrieved from the first step
username
yes
string
the user name or the login ID for the login or entering the email of the user to login


password
yes
string
 the password that used for the login system
key
yes
string
The application key from the SDK (App Key). Created from the developer platform and the sample is provided. If that key is for VcoinApp then the key is given as mentioned above.
hash
yes
string
The calculated hash compiled from the app secret. please see the Implementation concept

(new changes as of v0.96)
Response success
response json{
data: json{
id:[uint]
username:[string]
nicename:[string]
email:[string]
url:[string]
registered:[string]
displayname:[string]
firstname:[string]
lastname:[string]
nickname:[string]
description:[string]
exp:[uint] (the time of expiry time in second)
token:[string] (the key to access the app with the user authentication)
age:[int]
gender:[string | M or F]
profile_picture:[string | url of the image]
}
status:[string]
}

Response failure
response json{
status:[string error]
error: [string the reason to support to the error]
}
2.3 Step 3 - Using token to making api requests

For simple login for the vcoin app, please pass the obtained token from step 2 and pass it into the parameter as described on the left side. The detail instruction will be mentioned from the API listing. All user related API via authentication server must passing both of these params as listed.

REQUEST:
URL={domain}/api/{any_controllers}/{refered_method}?token={token}&appkey={app key}

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the developer sdk or the vcoinapp app key

Sample request:
http://devlogin.vcoinapp.com/api/mission/get_mission_list/

token:4b2f3802cfe9e1aadad1310e956d2df6c38e3651
appkey:yoqzLezk

2.4 Renew Token
When there is an error occurred from the login process or any other authentication processes and the message is about the expiration of the token. This api will be applicable. 
REQUEST:
URL={auth domain}/api/authen/renew/

Parameters
required
type
content
wasted
yes
string
the expired token
hash
yes
string
the calculated hash from the app key and the app secret
app_k
yes
string
app key
nouce
yes
string
the nouce request from the step 1

response json{
data: json{
exp:[uint] (the time of expiry time in second)
token:[string] (the key to access the app with the user authentication)
}
status:[string]
}

2.4.1 Error code
1720 - 1729

3. User Registration Native js Bridge
Response Samples
Android interface object: Android
iOS interface object: none

Native library bridge support from web to native mobile

js callback method
params
type
explanation
on_form_complete
text
string
triggers this when the form is successfully redeemed. Native should able to show a notification on the top bar to show a new redeem is successful or similar text to the user. The additional text should be added by the param text. length-max 30 chars. dialog box first, when press ok, it brings back to the reward channel. the message inside the dialog box should be given by the param text stated.. this is what on_form_complete does
on_page_return




triggers this to go back to the previous played video view
on_message_box
text
string
on_message_box is the method to be called for just the pop up message dialog box at anytime
on_float_notification
text
string
on_float_notification is the method to call to show up the pop up bubble or toast in android for the given messages


5.2 Display User Data
This api is to delivery the user data in general
User Info Details (Thumbnails, personal details) List
REQUEST:
URL={auth domain}/api/personal/display_user/

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
Response
response json{
data:{
id:[int]
username:[string]
nicename:[string]
email:[string]
url:[string]
registered:[string]
displayname:[string]
firstname:[string]
lastname:[string]
nickname:[string]
description:[string]
capabilities:[string]
role:[array string]
avatar:[string url or null]
image_thumb:[string | the banner of the image]
profile_picture:[string | url of the image]
about:[string]
latest_action:[string timestamp]
prefer_language:[string | en/ja/zh-hant]
country:{
	ID:[string | short code of the country]
	name:[string | the english name of the country]
}
coin:[int | the coin value of the user]
coin_update:[string| the date for last update of the vcoin]
birthday:[string | the date format for the birthday]
}
status:[string ok or failure]
result:[int]
}

5.3 Change User Detail (Vcoinapp)
User Info Details change request. The key will be the updating field and the value will be the updating value for that specific key. Only token and appkey is required. Other fields are not required but only required when the necessary field needs to update with the latest value.

POST:
URL={auth domain}/api/personal/changedetail/
with optional keys

Request example: 
URL={domain}/api/personal/changedetail/?token=xxx&appkey=xxx&{key1}={val1}&{key2}={val2}

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
firstname


string


lastname


string


nickname


string


description


string


gender


string
M or F
user_url


string


country


string
 the name field from return list json string. Please see 5.3.1;
countrycode


string
the countrycode field from the return list json string, the name of country code represented with 3 - characters uppercase. Please see 5.3.1
birthday


string
date format DD/MM/YYYY
setting_push_sms


string
settings for the user whether the user will received push sms notification. input 0 or 1. 0 - off, 1 - on
sms_number


string
the mobile phone number to be sent when the push sms notification is triggered. currently we only support the HK number. 
password


string
the string not less than 8 characters. this key will require another key called old_password to be submitted together.
old_password


string
the previous password to be verified. 
return errors are 1031, 1032, 
email


email
a formal email with @ character
language


string
the display of the value will be in a key [prefer_language]




Response------- success
response json{
status:[string ok or failure]
data:{
	change_field:[string | the field name]
	value:[string | the updated value by request]
}
result:[int]
}
5.3.1 Change of Password
example code are as listed:
http://devlogin.vcoinapp.com/api/personal/changedetail/?token=3fdfc5bede9aa733c89baf77bd8ed1c233c3e7b4&appkey=yoqzLezk&old_password=1234567890&password=12345678
this should be able to work correctly
The sample return should be
{
    "data": [
        {
            "field": "password",
            "value": “12345678”
        }
    ],
    "result": 1,
    "status": "success",
    "timestamp": 1412912781
}

5.3.2 Country List
This api is request to CMS server to get the related country codes for the user to select in the profile editing panel in the vcoinapp. We suggest to load this API when the APP is started on the first place, so this json will be saved as cached data for later use. When the language setting is changed, this api will need to loaded again based on available language code provided on CMS API document item 1. 

URL={cms domain}/api/listing/country_codes_for_user/
Parameters
lang - (required) the language code specified from the cms api document or read the introduction of 5.3.1
Response------- success
response json{
status:[string ok or failure]
data:{
	name:[string | the name of the country in ja, en, or zh-hant]
	countrycode:[string | the country code for the user to select]
}
result:[int]
}

5.4 Move Coins (SDK + vcoinapp)
move coins from user to Imusictech
REQUEST:
URL={domain}/api/vcoin/movecoins/

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the SDK app key
process_amount
yes
string
the amount to be transferred

The amount is the integer for the SDK to request a specific amount of vcoin to the user’s (application user) from (sdk or app host) wallet.
Response------- success
response json{
status:[string ok or failure]
result:[int]
}

5.5 Move Coins on after watching the video
This api will trigger an action to deduct coins from the video uuid or the merchant uuid
REQUEST:
URL={domain}/api/mission/watchvideo/

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the SDK app key
post_id
yes
int
the reward id

Response------- success
response json{
status:[string ok or failure]
result:[int]
data:[json{
trace_id: [string to processing vcoin ID or reference ID uuid]
payout: [int the amount of the vcoin to gain]
video_id:[int the reward post if from the submission]
}]
}

5.6 Change Request
User setting current status (SMS binding status, saving video cache, others) list. This API is not yet implemented

POST:
URL={domain}/api/personal/change_request/

5.7 Upload Personal Image for Profile
Ready on 4/11//2014
Upload personal image for profile. please make sure the image is successfully cropped before uploading. We suggest the app to pre process the image before upload the image. 
Spec:
Upload format: 400px x 400px
File format: jpg
File naming: numeric

POST:
URL={domain}/api/personal/upload_personal_image_profile/

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoin app key

Also using the file upload method to handle file uploads with name and file data. The uploaded image will be associated to the login account of the application user. The image will be show on the json from the personal profile json with the key profile_picture.

Sample code for android:
https://github.com/jjhesk/OneCallMobileAnaylizer/blob/f71dea9964c78539ee61eb894564b82768eb29ef/app/src/main/java/com/hkm/root/Tasks/upload_data.java
Response
response json{
status:[string ok or failure]
message:[string]
result:[int]
data:[string]
}
5.7.1 Visualization

This is the mechanism for changing the user profile image and the communication relationship.

6. Redemption
6.1 Redeem Submission for Vcoin App

GET:
URL={auth domain}/api/redemption/redeem_submission/
Parameters
required
type
content
token 
yes
string
access token
appkey 
yes
string
app key for the vcoinapp
lang


string
zh, en, or ja
product_id 
yes
int
that key stock_id from the reward single json string obtained from cms server
checkdoubles 
yes
int
1 or -1. 
1: check for error if the product has redempted for the second time
-1: will not do the checking as mentioned above
distribution 
yes
string
the letters from the key distribution_type in the single reward json api obtained from the cms server possible values are decentralized or perpetual.
offer_expiry_date 
yes
string
found by the single reward api
extension_id 
yes
int
the array order integer from the single reward api
address_id 
yes
int
the integer of the address code get from the single reward selections if the distribution is decentralized. Otherwise this value will be -1
price 
yes
int
the vcoin value of the product

Response
response json{
status:success
result:1
timestamp:[int | the current time]
data:json{
	user:[int | the user ID]
	amount:[int | the amount of vcoin that transacted]
	trace_id:[string | the reference ID from the vcoin server]
	qr_a: [string | the hash that can be generated a QR code]
qr_b: [string | the hash that can be generated a QR code]
handle:[int | the handling ID for the product to be redeemed]
message:[string]
}
}
Return parameters for [handle]
0, traditional redemption method
1, restaurant redemption with table number or label
2, restaurant redemption without table number or label
FAQ: 
How to know a reward should display QR Code?
The developer should know from the previous json on single reward json for submission redemption from the cms api document. There is a key called redemption_procedure to making control of each control call.
Explanation for redemption_procedure:
0: Scan QR code and then transact
1: Require customer to input extra label

code
messages
1088
user uuid is not exist or not set





















6.2 Redeem Listing 
GET
URL = {domain}/api/redemption/redeem_list/

This request will need to have token, appkey and one of the key that is not listed.

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
stock_id


int
stock ID
distribution


string


vcoin


int
the coin value
address


int
the address ID
obtained


int
 1 = have redempted / claim physically, 2 = not redempted yet / unclaim physically

Response   
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:[array json{
	user:[int | the user ID]
	amount:[int | the amount of vcoin that transacted]
	trace_id:[string | the reference ID from the vcoin server]
	qr_a: [string | the hash that can be generated a QR code]
qr_b: [string | the hash that can be generated a QR code]
handle:[int | the handling ID for the product to be redeemed]
p_status:[string | explain on 6.2.1]
c_status:[int to explain claim status 0: unclaimed 1:claimed see 6.2.2]
detail: [json{
	title:[string]
	stock_id:[int]
	vendor_id:[int]
	vendor_name:[string]
	video_url:[string]
	product_url:[string]
	product_description:[string]
}]
}]
}
6.2.1 Explain for Key p_status

value
comment
comment from vcoin server
0
processing
the transaction is still processing
1
after success processing
when the vcoin server has use API to notify the cms server for this transaction record. Please also see 6.4 to making API notification to the cms server after a transaction of the submission redeem process.
2
failure from processing
there were some issue from the connection of the vcoin server

6.2.2 Explain for Key c_status

value
comment
comment from vcoin server
0
unclaim physically


1
claimed physically



6.3 Redeem Coupon Submission (Vcoinapp)
GET:
URL={auth domain}/api/redemption/redeem_coupon_submission/

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
couponid
yes
int
the stock_id from the single reward json api
lang
yes
string
request en,zh,ja 

Response--
response json{
	status:success
	timestamp:[int | time]
	result:1
	data:json{
		trace_id:[string | the transaction id code]
		code:[string | the redemption code of the coupon]
		message:[string]
}
}

Common failure response will be displayed when the coin is not successfully received by the user.
6.3.1 Error Code
1001, 

6.4 Callback Transaction from Vcoin Server
Noticed that this API request will need to point at the CMS server on both staging server and the production server. User setting current status (SMS binding status, saving video cache, others) list. Callback from the transaction server to produce:
GET:
URL={CMS server domain}/api/vcoin/notify_transaction_status/

Parameters
required
type
content
transactionid
yes
string
the full transaction code form the vcoin server
reference
yes
string
the ref_code on the vcoin server
Possible input for reference: redemption_submission, redemption_coupon


status
yes
int
the new commanded status code to be updated
please see 6.2.1

Response
response json{
status:[string ok or failure]
message:[string]
result:[int]
}

Common failure response will be displayed when the coin is not successfully received by the user.
code
error
1001
missing transaction id
1002
missing reference
1003
missing status
1075
unknown transaction reference
1091
transaction record not found in coupons
1092
transaction record not found in rewards





7. Reward Scan and Retrieve of Reward Gift/Services
7.1. Scan and Pick Up Process For Redemption Center

Feature: the scanner is initialized from the vendor or the store app and verify from the store app.
Process
initially scan the qr code first
scan the second qr or enter hk ID for verification

Programming Guide
Once the api return a successfully json object. The obtained qr_a and the qr_b will be used for making the second alternative scan from the user device or their email note. The table will be shown as the situation as follow:



step 1
step 2
step 3
response
method 1
scan qr_a and get the initial json object return
scan and verify for qr_b.



success the make the API step 2 request providing trace_id as the reference


further success response
method 2
scan qr_b and get the initial json object return
scan and verify for qr_a.



success the make the API step 2 request providing trace_id as the reference


further success response


7.1.1 Step 1. Initially scan the QR code from the App 
The store device will need to submit QR code to the server and retrieve the redemption data to the device

GET
URL = {auth domain}/api/redemption/redeem_obtain_complex

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
step
yes
int
1
qr
yes
string
the stored QR code from the QR code reader. The qr code can be the stored qr_a or qr_b. 

if handle=0, call 7.1.1 and 7.1.2
if handle=1, call 7.2 with redemption_procedure=1
if handle=2, call 7.2 with redemption_procedure=2
Response------- success
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:json{
	ID:[int | the user ID]
	amount:[int | the amount of vcoin that transacted]
	trace_id:[string | the reference ID from the vcoin server]
	qr_a: [string | the hash that can be generated a QR code]
qr_b: [string | the hash that can be generated a QR code]
handle:[int | the handling ID for the product to be redeemed]
trace_id:[string | the vcoin transaction history id]
distribution:[string | DECEN or CENTRAL]
names: [string | in json format to store the related data for the application to display]
stock_id:[string | the stock id in number]
vcoin: [string | the represented vcoin transaction value]
address:[string the integer for the address ID]
action_take_by:[string the action key for the possible actions to be taken]
}

}
Error Codes
1063 1061 1062 1667

7.1.2 Step 2. The store device will then submit the second request to the authentication server for final transaction for the pickup process


GET
URL = {auth domain}/api/redemption/redeem_obtain_complex

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
trace_id
yes
string
the trace_id from the previous API response
step
yes
int
2

Response
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:json{
	ID:[int | the user ID]
	amount:[int | the amount of vcoin that transacted]
	trace_id:[string | the reference ID from the vcoin server]
	qr_a: [string | the hash that can be generated a QR code]
qr_b: [string | the hash that can be generated a QR code]
handle:[int | the handling ID for the product to be redeemed]
trace_id:[string | the vcoin transaction history id]
distribution:[string | DECEN or CENTRAL]
names: [string | in json format to store the related data for the application to display]
stock_id:[string | the stock id in number]
vcoin: [string | the represented vcoin transaction value]
address:[string the integer for the address ID]
action_take_by:[string the action key for the possible actions to be taken]
}
}

Error Code
1064 1068 1066 1067 1667 1669 1668
7.2. Scan and Pick Up Process For Restaurant or Retail Business
This process of the API will allow the QR code to be scanned on the vcoin app and the server will process the transaction based on the data. The scanner is initialized from the vcoin app.

GET
URL = {auth domain}/api/redemption/redeem_obtain

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoin app app key
redemption_procedure
yes
int
2: without note key 
1: with note key
Please also see 7.2.1
note
yes/no
string
the table number or letter in the restaurant. otherwise the note key will be filled with the product title
Please also see 7.2.1
qr
yes
string
the stored QR code from the QR code reader
lang
yes
string
request language in success message (success_message)  only: en, zh, ja


Response
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:json{
	user_id:[int the user id]
	stock_id:[int the stock id]
	claim_time:[int the processing claim time]
	processed_by:[string the process way]
	address_id:[int the address/location id]
	trace_id:[string]
	success_message:[string]
}
}
7.2.1 Explain redemption_procedure, note, and handle

handle
applicable only on store app
applicable only on vcoinapp
0
call 7.1.1 and 7.1.2 
display qr_a as an image on the app
1
not applicable
call 7.2 with redemption_procedure=1 with note param
2
not applicable
call 7.2 with redemption_procedure=2 without note param

7.3 Demo scan API SMS
This is used by the QR code scanner demo version.
POST
{domain}/api/vcoin/demo_scanner/

Parameters
required
type
content
postsms
yes
string
the posting string will be presented in sentences that will eventually be send in the sms message


Response
response {
	status:[string : ok]
	result:[string: success]
	code:[int : 1]
	data:[string | the return posting data from the postsms]
}
Social Plugin
8.1 Like or Follow Pages
Show all the links and urls for the like pages
GET
URL = {auth domain}/api/personal/get_social_urls
Response
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:json{
	field:[string| the possible supported key for the social network]
	val:[string| the url of the social network page or link]
}
}

 VCoin History
9.1 Display VCoin History and the related actions
This API is developed from the original document VCoin Server API document v1.3

GET
URL = {auth domain}/api/vcoin/vcoin_history

The parameters will be the same as parameters from the vcoin server API v1.9+

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
start


int
The start date in UTC, e.g. 2014-04-05. TBD
end


string
end date
index


string
Page index, starting from 1. Will return 20 records in each page. Caller should check the records count in the returned JSON to decide if need call this API again with index+1 to retrieve more. If 0, means to get all records.
feature
yes
string
according to API doc v1.9+

Response
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:[array json{	
transid:[string]
	count:[int]
	time:[string | timestamp]
	(david will add ref_code in here)
}]
}
Sample returns for success
Server returns from the vcoin server.. .:


10. Comment
10.1 Add Comment
Adding comment to the user

GET
URL = {auth domain}/api/personal/addcomment

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
objectid
yes
int
the post ID for the applications or rewards items
comment
yes
string
the comment to be added to this post ID


Response------- success
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:””
}
10.2 Flag Comment
Report the issue for the existing comment

GET
URL = {auth domain}/api/personal/flagcomment

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
flag
yes
int
see 10.2.1
comment_id
yes
int
comment post ID for app or reward or coupon
10.2.1 flag config
int
explain
0
unflag for display
1
flag for reported only use for request
2
pending flag for display its pending
Response------- success
response json{
status:success
timestamp:[int | the current time stamp]
result:1
}

10.3 Remove Comment
Remove the existing comment only allow for the original post person

GET
URL = {auth domain}/api/personal/removecomment

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
comment_id
yes
int
comment post ID for app or reward or coupon
reference_id
yes
int
the ID from the comment object
Response------- success
response json{
status:success
timestamp:[int | the current time stamp]
result:1
}
10.3.1 Error Code
Please also refer to these error code
1059,1058,1057,1056,1051,1052


11. Get Vcoin Balance
To retrieve the vcoin balance from the vcoin server

GET
URL = {auth domain}/api/vcoin/getbalance

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoin app app key
Response for success return
response json{
status:success
result:1
data:[json{
	account_id:[string | uuid]
	coin:[int | the coin number]
	account_user_name:[string | the first name and last name and display name]
developer_name:[string | name]
}]
timestamp:[int | the time number on the spot]
}

12. Mission
Finished Missions
Unfinished Missions
Check Point Triggers
Mix Mission List
12.1 Finished Missions
To retrieve the finished missions for the user.  As of 16/9/2014. This API will no longer be used on the mobile app.
GET
URL={auth domain}/api/mission/get_finished_missions

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key

Response 
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:[array json{
	mission_id:[int | the action ID]
	description:[string | the reference reminding]
	thumb_sq:[string | the url of the image in small thumb]
}]
}
12.2 Unfinished Missions
To retrieve the list of unfinished missions. As of 16/9/2014. This API will no longer be used on the mobile app.
GET
URL={auth domain}/api/mission/get_unfinished_missions

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
Response 
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:[array json{
	mission_id:[int | the action ID]
	description:[string | the reference reminding]
thumb_sq:[string | the url of the image in small thumb]
vcoin_reward:[int | the coins to be rewarded]
}]
}
12.3 Check Point Triggers
Action Point Trigger Functions for Vcoin App. You can understand it as mission complete triggers or mission checker.

POST:
URL={auth domain}/api/mission/checkpoint/

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
stock_id


int
required when only specified in Table 12.3.1
aid
yes
int
the action ID for the mission (mission ID)

Please note that the action ID will be changed by staging server and production server. Native programming on mobile may need to develop a switchable ID mapping class to handle changeable IDs.
12.3.1 Table
S
P
Content and description
id
SDK 
V
























43


login vcoinapp




yes
46


watch video - watch the video on the vcoin app on the product listing. Daily mission: Watching 5 videos of reward
yes


yes
45


Weekly mission: Finish downloading 3 apps and signing in inside these 3 apps respectively. Download app - download the app only from the vcoin app 




yes
69


Daily mission: Reach through 5 reward items
yes


yes
70


Weekly mission: Use VCoinApp 5 days in a row




yes
Legend for 12.3.1 Table:
(S)-the value of parameter [aid] on staging server
(P)-the value of parameter [aid] on production server
(SDK) - SDK use only
(V) - VCoinApp use only
(id) - additional key [stock_id] is required for completing this API request
Response 
This response is displayed only when the reward is successful recognized and the vcoin is distributed to the app user

response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:{
	coin:[int | the coin gain amount]
	trace_id:[string | the reference for the transaction id]
}
}

Common failure response will be displayed when the coin is not successfully received by the user.

code
error
1010
no reward to gain
1020
user vcoin account is missing

that means the vcoin uuid is not exist for this user..
may need to have proper registration for the vcoin uuid. For cms admin, you can login to the auth server in the backend cms and edit the user profile individually with their vcoin uuid. Then update with the information on the panel. This problem will then be resolved. 
1022
reward coin nature is not defined, no vcoin account
1021
not initiated
1024
stock_id is not defined
1001
missing action id
1011
request action point does not exist
1012
the action point is not ready
1013
SDK app key is not selected / Occurrence is not selected
1015
Occurrence is not selected
1014
reward have been gained

12.4 Mix Mission List
To retrieve the mix mission list including the finished items and the unfinished items in one single list.

GET
URL={auth domain}/api/mission/get_mission_list

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
Response 
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:[array json{
	title:[string | the title of the mission]
	mission_id:[int | the action ID]
	description:[string | the description of string to tell the status of the mission and review of its current mission for this user]
	thumb_sq:[string | the url of the image in small thumb]
	vcoin_reward:[int | the amount of the vcoin to be reward when reward is successful]
	status:[string | see 12.4.1]
	type:[string | see 12.4.2]

}]
}
12.4.1 Possible values for [status]
complete
incomplete
12.4.2 Possible values for [type]
daily : Daily Mission
weekly : Weekly Mission
one-time : One-Time Mission
continuous : Continuous Mission
Programming Guide































12.5 Download App From VcoinApp
This should be triggered on the download button is pressed on the app download section in the vcoinapp.
GET:
URL={auth domain}/api/mission/vcoinappdownload

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
down_app_key
yes
string
the app key of the downloading application
Response 
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:[array json{
	download_user:[int]
	app_key:[string]
	triggered:[int]
}]
}
For alternative results please refer to s12.7
12.6 Start App with SDK
The SDK should trigger this when the app is first started or started every. This will check the system for the first time coin gain. if the this app has previously downloaded from the vcoinapp and this sdk has never started before then this will make a coin gain from the system.
GET:
URL={auth domain}/api/mission/openappsdk

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
Response 
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:[array json{
download_user:[int]
	app_key:[string]
	triggered:[int]
}]
}
For alternative results please refer to s12.7
12.7 Alternative results or error messages

For API without success response, there are a list of codes:

code
error message
applicable for vcoinapp
applicable for sdk
1554
you have already got the reward


yes
1552
you have already downloaded
yes


1509
appkey is missing
yes
yes
1553
this is not an sdk appkey


yes
1551
down_app_keyis missing
yes


1550
appkey for vcoinapp not matched
yes




13. Coupon Listing
13.1 User redempted list for coupons
GET:
URL={auth domain}/api/redemption/mi_e_coupon_list_history/

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
Response 
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:[array json{
	claim_time:[string | the time stamp for the registration time of the coupon]
	vcoin_expense:[int | the expense of the vcoin from the user]
client_coupon_code:[string | the coupon code to be revealed]
status:[int | integer indication]
detail: {
	list:[array json{
ID:[string | the id of the post]
	image_sq_thumb:[string | the url of the image thumbnail]
	video_image_cover:[string | url of the video image cover]
	title:[string | the title of the coupon]
	vcoin:[int | the current cost of the coupon in vcoin]
	vendor_id:[int | the ID of the vendor in object ID]
	vendor_name:[string | the company name]
	vendor_url:[string | the url of the vendor]
	description:[string | the brief description of the coupon]
	exp_date:[string |  the expiration date]
	country_terms:[array objects{
	term_id:[int]
	name:[string]
	slug:[string url segment]
	term_group:[int]
	term_taxonomy_id:[int]
	description:[string| three letter short code e.g. HKG]
	parent:[int]
	count:[int total posts count under this term]
	filter:[string]
}]
category_terms:[array objects{
	term_id:[int]
	name:[string]
	slug:[string url segment]
	term_group:[int]
	term_taxonomy_id:[int]
	description:[string description of this term in full story]
	parent:[int]
	count:[int total posts count under this term]
	filter:[string]
}]
]
 	cate:json{
unpress:[string | image url]
press:[string | image url]
unpress_s:[string | image url on the search bar]
press_s:[string | image url on the search bar]
description:[string | the name of the description]
name: [string | category name],
id:[int | this will be the listed app id]
}
}
}]
}
13.1.1 explanation of status
code
comment


0
processing


1
success process


2
failure process



31.2 User redempted list for rewards
GET
URL = {auth domain}/api/redemption/redeem_list/?obtained=1

Parameters
required
type
content
token
yes
string
the token from step 2
appkey
yes
string
the app key from the vcoinapp app key
obtained
yes
int
value=1
stokc_id
optional
int
optional to filter the object_id
distribution
optional
string
standard format from the distribution uppercase
address
optional
int
specific address ID
vcoin
optional
int
filter out the specific vcoin value from the transaction
Response 
response json{
status:success
timestamp:[int | the current time stamp]
result:1
data:[json{
	user:[int | the user ID]
	amount:[int | the amount of vcoin that transacted]
	trace_id:[string | the reference ID from the vcoin server]
	qr_a: [string | the hash that can be generated a QR code]
qr_b: [string | the hash that can be generated a QR code]

handle:[int | the handling ID for the product to be redeemed]

detail:[json{
	title:[string]
	vendor_id:[int]
	vendor_name:[string]
	exp_date:[string | expiry date]
	video_url:[string | play video]
	product_url:[string | the url for the reward product]
	product_description:[string | the description of the product]
	image_banner:[string| url]
	image_small_thumb:[string| url]
	image_video_cover:[string| url]
	country:[array objects{
unpress:[string | image url]
press:[string | image url]
unpress_s:[string | image url on the search bar]
press_s:[string | image url on the search bar]
description:[string | the name of the description]
name: [string | category name]
id:[int]
}]
category:[array objects{
unpress:[string | image url]
press:[string | image url]
unpress_s:[string | image url on the search bar]
press_s:[string | image url on the search bar]
description:[string | the name of the description]
name: [string | category name]
id:[int]
}]
}]
}
}
Programming Guide
Depends on the situation on the handling code, some situation will require two different verification QR code in order to verify for the completion of product receive. 
So that qr_a and qr_b may not be always identical.
trace_id is the transaction code generated from the vcoin server and that will be referencing the transaction detail. The app can use this reference to look up the transaction detail.
handle is the key to specify what kind of transaction procedure to be taken when the app started to scan the code and the use that app. 
handle code
explain
0
Simple Redemption: Scan QR code on user device and then transact
1
Scan on the QR on the product and it also requires customer to input extra label.
2
Scan the QR code the product from the device and then transact

Programming Guide

















15. General Errors
Common Errors and Handling Formats
There are login error differ from the regular API request error. These errors will be specified only each login related error response. Otherwise, error will be using the regular common defined format and structure.

The login related failure response are shown as below:
response json{
status:[string | error]
error: [string | the reason to support to the error]
}

General API error or failure will shown as below:
response json{
	msg:[string | the reason]
	result:[int | the error code]
	timestamp:-1
	status:failure
	data:[empty string]
}

error code
message
1001
missing value
1002
missing value
1003
missing value
1004
missing value
1031
the old password is not presented.
1032
the password does not match
1079
missing vcion account uuid from vcoin server side
1020
missing vcion account uuid from the auth server side
1504
token is required for authentication
1505
Invalid authentication token. Use the `generate_token` Auth API method
1506
Unknown error - <authenticated_user_id>
1507
This token is currently expired. Use the `generate_token` Auth API method
1508
Unmatched App Key, please go back and double check
1509
app key is needed
1059
comment id is not exist
1058
user id is not exist
1057
reference id is not exist
1056
remove comment not allowed
1051
missing comment id 
1052
missing reference id
1071
This redemption is not available to you or it has been redeemed, please try to check out our redemption products first.
1070
extra note code is missing
1069
the QR code is missing
10788
user ID is missing
1063
This redemption product is not available to you, please try to check out our redemption products first.
1061
process step is missing.
1062
QR code is missing
1051
user id is missing
1064
the trace ID is missing
1068
redemption data is not verified or found
1066
this redemption has been claimed
1067
the offer is expired
1669
the mac address is missing
1667
step val is invalid
1668
failure to update the claim record, technical issue:

16. WebView
WebView Support for Native Development

Title and content
URL English
URL Chinese
URL Japanese
Feedback Form
http://devlogin.vcoinapp.com/feedback-form/
http://devlogin.vcoinapp.com/feedback-form-cn/
http://devlogin.vcoinapp.com/feedback-form-ja/
Privacy Policy
http://devlogin.vcoinapp.com/privacy-policy/
http://devlogin.vcoinapp.com/privacy-policy-cn/
http://devlogin.vcoinapp.com/privacy-policy-ja/
Support
http://devlogin.vcoinapp.com/support
http://devlogin.vcoinapp.com/support-cn/
 http://devlogin.vcoinapp.com/support-ja/
T&C
http://devlogin.vcoinapp.com/tc/
http://devlogin.vcoinapp.com/tc-cn/
http://devlogin.vcoinapp.com/tc-ja/ ‎
User member registration
http://devlogin.vcoinapp.com/user_registration_mobile/
http://devlogin.vcoinapp.com/user_registration_mobile_cn/?lang=cn
http://devlogin.vcoinapp.com/user_registration_mobile_ja/?lang=ja

Production Information
High-level information for the service are covered below, including service endpoints, HTTP headers and URL parameters, naming conventions, and versioning scheme.
Service Endpoints—The Related Items Management API has unique gateway URLs (service endpoints) for the Production environment and the Sandbox environment. The service endpoint includes the service version (e.g., v1). When updating to a new major version of the service, you must update to a new service endpoint as well.
Naming conventions—The naming conventions for the Related Items Management API are slightly different than the Trading API. Most notably, call names and fields in the Related Items Management API begin with lowercase letters.
HTTP headers and URL parameters—The Related Items Management API uses eBay's Service Oriented Architecture (SOA) framework and requires that an eBay authorization token is passed in through a (X-EBAY-SOA-SECURITY-TOKEN) header or (SECURITY-TOKEN) URL parameter.

Versioning scheme—The version numbering scheme for the Related Items Management API is different from the scheme used by the eBay Shopping and Trading APIs. The Related Items Management API version consists of three digits (e.g., 1.2.3): 
The first digit indicates the major release version. Major releases are not backward compatible. eBay supports the two most recent major versions of the service. The service endpoints and target namespace include the major version of the service.
The second digit indicates the minor release version. Minor releases consist of feature additions or behavior changes that are backward compatible.
The third digit indicates the maintenance, or micro release version. Maintenance releases are used to correct minor problems. Maintenance releases have minimal impact on the features or functionality of the API. These changes may or may not have associated schema changes.


