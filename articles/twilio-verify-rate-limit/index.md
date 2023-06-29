---
title: Twilio Verify Rate Limiting
description: Buckets of fun with Twilio Verify API  rate limiting for mobile verification requests
date: 2023-03-29
image: joshua-hoehne-TsdelDFTP6Y-unsplash.jpg
thumb: thumb.jpg
imageAlt: Speed limit sign
tags:
  - code
  - programming
  - ruby
  - twilio
  - api
---

Twilio `rate limits` are used to apply limits to a category of requests.

## Twilio Client Auth

Before interacting with the Twilio API, you will need to require the `twilio-ruby` gem and instantiate a `@client` using your account credentials.

```ruby
require 'twilio-ruby'
account_sid = ENV['TWILIO_ACCOUNT_SID']
auth_token = ENV['TWILIO_AUTH_TOKEN']
@client = Twilio::REST::Client.new(account_sid, auth_token)
```

---

## Creating Rate Limits

A rate limit is created with a `unique_name` (such as `"account_rate_limit"`) and this unique name is used to reference the `rate limit` later.

```ruby
rate_limit = @client.verify
  .v2
  .services(service_sid)
  .rate_limits
  .create(
    description: 'Account rate limit',
    unique_name: 'account_rate_limit'
  )
puts "Created Rate Limit"
puts rate_limit.sid
```

Within each `rate limit` category, limits are applied using `buckets`.
A `bucket` is created to set a maximum number of requests over a period, using the format `{ max: N, period: S }` for `N` maximum requests over a period of `S` seconds.
Multiple rate limit `buckets` can be created for a `rate limit` which would each be applied to the requests within this `rate limit` group.

```ruby
bucket = @client.verify
  .v2
  .services(service_sid)
  .rate_limits(rate_limit.sid)
  .buckets
  .create(
    max: 2,
    interval: 600 # 10 minutes
  )
puts "Created Rate Limit Bucket"
puts bucket.sid
```

> Without creating a `bucket`, no rate limiting will be applied to the `rate limit`

---

## Using Rate Limits

After a `rate limit` with zero or more `buckets` has been configured, requests will need to be associated with this `rate limit` when they are being created. The `rate limit` is referenced using the `unique_name` and a `rate limit key`.

```ruby
verification = @client.verify
  .v2
  .services(service_sid)
  .verifications
  .create(
    to: user.mobile,
    channel: 'sms',
    rate_limits: {
      unique_name: rate_limit_key
    }
  )
```

The `rate limit key` should be a unique identifier on which the rate limit bucket rules should apply.

> Multiple rate limits could also be applied to a request, such as per account, per country, or per group of digits within the recipient's mobile number.

```ruby
.create(
  to: user.mobile,
  channel: 'sms',
  rate_limits: {
    account_rate_limit: user.id,
    country_rate_limit: user.country,
    # trim last 3 digits to get a block of phone numbers
    number_group: number_group(user.mobile)
  }
)
```

## Rate Limit Error Codes

* If a `unique_name` rate limit has not been correctly configured, the API will respond with a **60200** error.
* If a request has been blocked by the `buckets` within a `rate limit`, the API will respond with a **20429** error.

---

## References

Check the docs
* [Service Rate Limits](https://www.twilio.com/docs/verify/api/service-rate-limits)
* [Service Rate Limit Buckets](https://www.twilio.com/docs/verify/api/service-rate-limit-buckets)
* [Create a verification](https://www.twilio.com/docs/verify/api/verification#start-new-verification)