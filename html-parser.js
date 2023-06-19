import axios from "axios";

const tdStartTag = "<td>";
const tdEndTag = "</td>";
const recordsMaxNumber = 1000;
const tBodyStartTag = "<tbody>";
const tBodyEndTag = "</tbody>";
const trStartTag = "<tr>";
const trEndTag = "</tr>";

//https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/lines-33099-33199-eligible-medical-expenses-you-claim-on-your-tax-return.html
export class HtmlParser {
    constructor(sourceUrl) {
        let url = new URL(sourceUrl);
        this.host = url.host;
        this.htmlSourceUrl = url.toString();
    }

    toJson = async function () {
        await axios.get(this.htmlSourceUrl).then((res) => {
            // main table body start & end
            let startIndex =
                res.data.indexOf(tBodyStartTag) + tBodyStartTag.length;
            let endIndex = res.data.indexOf(tBodyEndTag);
            let mainTable = res.data.substring(startIndex, endIndex);

            let records = mainTable.split(trStartTag, recordsMaxNumber); // recordsMaxNumber will ensure that a huge table is not going to slow down the process
            let medicalExpenses = [];
            records.forEach((record) => {
                if (record === "") return;
                medicalExpenses.push(this.getMedicalExpense(record));
            });

            console.log(medicalExpenses);
            return medicalExpenses;
        });
    };

    getMedicalExpense = function (htmlRecord) {
        if (htmlRecord === "") return;
        let records = htmlRecord.split(tdStartTag);
        let medicalExpense = {
            expenseName: this.getHyperlinkText(this.extractPropertyValue(records[1])),
            expenseDetailsUrl: this.getHyperlink(this.extractPropertyValue(records[1])),
            isEligible:
                this.extractPropertyValue(records[2]) === "Eligible" ? true : false,
            prescriptionNeeded:
                this.extractPropertyValue(records[3]).toLowerCase() === "yes"
                    ? true
                    : false,
            certificationNeeded:
                this.extractPropertyValue(records[4]).toLowerCase() === "yes"
                    ? true
                    : false,
            formT2201Needed:
                this.extractPropertyValue(records[5]).toLowerCase() === "yes"
                    ? true
                    : false,
        };
        return medicalExpense;
    };

    extractPropertyValue = function (htmlRecord) {
        let propertyValue = htmlRecord.substring(
            0,
            htmlRecord.indexOf(tdEndTag)
        );
        return propertyValue;
    };

    getHyperlinkText = function (aTag) {
        let tokens = aTag.split(/<|>/);
        return tokens.length >= 3 ? tokens[2] : tokens[0];
    };
    getHyperlink = function (aTag) {
        if (aTag.indexOf("<a href") == -1) return null;
        let tokens = aTag.split('"');

        return `${this.host}${tokens[1]}`;
    };
}