---
title: Writing Code with AI Examples
description: Having a conversation with ChatGPT can be fun, but it will quite often tell you confidently something you know to be gibberish
date: 2023-03-10
image: stephen-dawson-qwtCeJ5cLYs-unsplash.jpg
thumb: thumb.jpg
imageAlt: Screen with charts and numbers
tags:
  - ai
  - code
  - programming
  - ruby
---

Having a conversation with ChatGPT can be fun, but it will quite often tell you confidently something you know to be gibberish. This means when it comes to writing software, it could provide something that _looks_ reasonable, but fails horribly.

In preparation for a task, I decided to see what opportunity AI would provide in assistance by asking "How would I convert a SVB formatted payment file to ACH".

To which ChatGPT responded with it's usual confidence and structure

> To convert a SVB formatted payment file to ACH, you will need to perform the following steps:
> 1. Obtain the necessary information from the SVB payment file. This may include the company name, account number, routing number, and transaction amount.
> 2. Format the information according to the ACH standard. ACH uses a specific file format, which includes a header record, detail records, and a trailer record. You will need to format the information from the SVB payment file into this structure.
> 3. Convert the routing number. SVB uses a different routing number format than ACH, so you will need to convert the routing number to the ACH format. This typically involves adding a leading zero and removing the check digit.
> 4. Validate the ACH file. Before submitting the ACH file, you will need to validate it to ensure that it meets the ACH standard. This typically involves using a validation tool to check for errors and ensure that the file contains all the required information.
> 5. Submit the ACH file. Once the ACH file has been validated, you can submit it to the appropriate financial institution for processing.
> It is important to note that the specific steps and requirements for converting a SVB formatted payment file to ACH may vary depending on the financial institution and payment system being used. It is recommended that you consult with a financial professional or your bank for guidance on the specific process and requirements for your situation.

But when I asked a follow up question of "Can you give me some example code in Ruby?", I was able to see some example code which _looked_ like it might help solve the problem.

```ruby
require 'csv'

# Define the path to the SVB payment file
svb_file_path = '/path/to/svb/payment/file.csv'

# Define the path to the output ACH file
ach_file_path = '/path/to/output/ach/file.txt'

# Define the ACH routing number format
ach_routing_number_format = '0%08d'

# Define the ACH file header and trailer records
ach_header_record = '101 012345678 012345678 2001010101A094101YourCompany           '
ach_trailer_record = '901000100000001000000000000000000000000000000000000000000000000000000000000000'

# Open the SVB payment file and read its contents
svb_file = CSV.read(svb_file_path)

# Initialize an empty array to store the ACH payment records
ach_records = []

# Loop through each payment record in the SVB file
svb_file.each do |record|
  # Extract the necessary information from the SVB payment record
  account_number = record[0]
  routing_number = record[1]
  transaction_amount = record[2]

  # Convert the routing number to the ACH format
  ach_routing_number = sprintf(ach_routing_number_format, routing_number)

  # Format the payment record according to the ACH standard
  ach_record = "5200#{ach_routing_number}#{account_number}   27              #{transaction_amount}0000000000000#{transaction_amount}0000000000000YourCompany           0000000000000000000000000"

  # Add the payment record to the array of ACH payment records
  ach_records << ach_record
end

# Combine the ACH header record, payment records, and trailer record into a single string
ach_file_contents = "#{ach_header_record}\n#{ach_records.join("\n")}\n#{ach_trailer_record}"

# Write the ACH file to disk
File.write(ach_file_path, ach_file_contents)
```

Now hopefully you would simply run this script blindly, just like you wouldn't want to copy and paste from [StackOverflow](https://stackoverflow.com), but it has done the legwork of file structuring and scaffolding to allow us to focus on the details.