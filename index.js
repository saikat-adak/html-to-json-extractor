import { HtmlParser } from "./html-parser.js";
import pkgExpress from "express";
const express = pkgExpress;

const app = express();
const port = 8000;

app.get("/", async (req, res) => {
    let url =
        "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/lines-33099-33199-eligible-medical-expenses-you-claim-on-your-tax-return.html";


    let parser = new HtmlParser(url);
    let jsonResponse = await parser.getTableAsJson();
    console.log(jsonResponse);
    res.send(jsonResponse);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
