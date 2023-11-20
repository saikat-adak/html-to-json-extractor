# html-to-json-extractor

A utility class for extracting tabular data from html content fetched from a given URL and returning it as json object. This works only on websites with simple table and tbody tags. Tables generated dynamically via javascript are not supported.

Sample usage:
```javascript
let url = "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/lines-33099-33199-eligible-medical-expenses-you-claim-on-your-tax-return.html";

let parser = new HtmlParser(url);
let jsonResponse = parser.getTableAsJson();
console.log(jsonResponse);
```

# How to run
Clone the project and open in VSCode. Open  terminal and run the following command:
```
node .
```
It should run the server and start listening to port 8000.
Now open a browser and hit http://localhost:8000/ which should return the json object array.