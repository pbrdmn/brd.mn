---
title: Ruby-on-Rails Conditional Validation
description: How to apply validation in a Ruby-on-Rails model when you don't always want it
date: 2023-02-10
image: invalid.webp
imageAlt: Orange diamond sign featuring a black exclamation point
tags:
  - ruby-on-rails
  - validation
  - code
---

Looking to implement a new feature within our codebase, we were looking at adding some new fields and applying validation for these, which seemed simple enough.

However when working with legacy codebases there will always be considerations for existing requirements and ensuring that a new change does not cause a regression. Having a reliable set of tests here is great, because they can point out these regressions before your users do.

---

In a Ruby-on-Rails model, a validation for the [presence](https://guides.rubyonrails.org/active_record_validations.html#presence) of `firstname` and `lastname` can be added with:

```ruby
class User < ApplicationRecord
  validates :firstname, presence: true
  validates :surname, presence: true
end
```

However, if this is being added to an existing model which is already in use and contains records _without_ these fields. The business logic of the application may also require that creating and updating these `User` models without requiring either of the name fields.

In this case the validation may only be required if the user of the system has begun adding one of these fields, ensuring that if either one fields has a value, then the validation should be run. This is where [conditional validation](https://guides.rubyonrails.org/active_record_validations.html#conditional-validation) would apply.

With conditional validation, we can define the circumstances in which the validation rules should be applied. E.g. to ensure both `firstname` and `surname` are present if one has value, this could be added with:

```ruby
class User < ApplicationRecord
  validates :firstname, presence: true, if: :has_name?
  validates :surname, presence: true, if: :has_name?

  def has_name?
    firstname.present? || surname.present?
  end
end
```

Here, the two validation rules are only conditionally applied if the `has_name` block is evaluated to *true*. In this case, the block evaluates to *true* if either `firstname` or `surname` is *present*.

Alternately, the validation can be [handled as a group](https://guides.rubyonrails.org/active_record_validations.html#grouping-conditional-validations) within a conditional block:

```ruby
class User < ApplicationRecord
  with_options if: :has_name? do |user|
    user.validates :firstname, presence: true
    user.validates :surname, presence: true
  end

  def has_name?
    firstname.present? || surname.present?
  end
end
```

With these validations in place, a `User` record will be value with either both fields empty or both fields present, but invalid if only one of the fields is present.