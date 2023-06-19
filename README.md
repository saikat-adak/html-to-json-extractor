# html-to-json-extractor

A utility class to fetch html content from a given URL, extract tabular data, and return json object.

Sample usage:
```javascript
let url = "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/lines-33099-33199-eligible-medical-expenses-you-claim-on-your-tax-return.html";

let parser = new HtmlParser(url);
let jsonResponse = parser.toJson();
console.log(jsonResponse);
```