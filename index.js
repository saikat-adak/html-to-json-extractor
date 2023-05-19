import axios from "axios";

const host = "https://www.canada.ca";
let htmlSourceUrl =
    `${host}/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/lines-33099-33199-eligible-medical-expenses-you-claim-on-your-tax-return.html`;

const tdStartTag = "<td>";
const tdEndTag = "</td>";
const recordsMaxNumber = 1000;
const tBodyStartTag = "<tbody>";
const tBodyEndTag = "</tbody>";
const trStartTag = "<tr>";
const trEndTag = "</tr>";

axios.get(htmlSourceUrl).then((res) => {
    // main table body start & end
    let startIndex = res.data.indexOf(tBodyStartTag) + tBodyStartTag.length;
    let endIndex = res.data.indexOf(tBodyEndTag);
    let mainTable = res.data.substring(startIndex, endIndex);

    let records = mainTable.split(trStartTag, recordsMaxNumber); // recordsMaxNumber will ensure that a huge table is not going to slow down the process
    let medicalExpenses = [];
    records.forEach((record) => {
        if (record === "") return;
        medicalExpenses.push(getMedicalExpense(record));
    });

    console.log(medicalExpenses);
});

function getMedicalExpense(htmlRecord) {
    if (htmlRecord === "") return;
    let records = htmlRecord.split(tdStartTag);
    let medicalExpense = {
        expenseName: getHyperlinkText(extractPropertyValue(records[1])),
        expenseDetailsUrl: getHyperlink(extractPropertyValue(records[1])),
        isEligible: extractPropertyValue(records[2]) === "Eligible" ? true : false,
        prescriptionNeeded: extractPropertyValue(records[3]).toLowerCase()==="yes" ? true : false,
        certificationNeeded: extractPropertyValue(records[4]).toLowerCase()==="yes" ? true : false,
        formT2201Needed: extractPropertyValue(records[5]).toLowerCase()==="yes" ? true : false,
    };
    return medicalExpense;
}

function extractPropertyValue(htmlRecord) {
    let propertyValue = htmlRecord.substring(0,htmlRecord.indexOf(tdEndTag));
    return propertyValue;
}

function getHyperlinkText(aTag) {
    let tokens = aTag.split(/<|>/);
    return tokens.length >= 3 ? tokens[2] : tokens[0];
}
function getHyperlink(aTag) {
    if (aTag.indexOf("<a href") == -1) return null;
    let tokens = aTag.split('"');

    return `${host}${tokens[1]}`;
}