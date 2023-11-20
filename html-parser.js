import axios from "axios";

const tdStartTag = "<td>";
const tdEndTag = "</td>";
const recordsMaxNumber = 1000;
const tBodyStartTag = "<tbody>";
const tBodyEndTag = "</tbody>";
const trStartTag = "<tr>";
const trEndTag = "</tr>";

export class HtmlParser {
    constructor(sourceUrl) {
        let url = new URL(sourceUrl);
        this.host = url.host;
        this.htmlSourceUrl = url.toString();
    }

    getTableAsJson = async function () {
        await axios.get(this.htmlSourceUrl).then((res) => {
            // find main table body start & end
            let startIndex =
                res.data.indexOf(tBodyStartTag) + tBodyStartTag.length;
            let endIndex = res.data.indexOf(tBodyEndTag);

            //get only the main table as string
            let mainTable = res.data.substring(startIndex, endIndex);

            //split by <tr> tag and collect top n rows only where n is recordsMaxNumber
            let rowCollection = mainTable.split(trStartTag, recordsMaxNumber); // recordsMaxNumber will ensure that a huge table is not going to slow down the process

            //loop through the records and convert every row into a json object
            let jsonArray = [];
            rowCollection.forEach((row) => {
                if (row === "") return;
                jsonArray.push(this.getJsonObject(row));
            });

            console.log(jsonArray);
            return jsonArray;
        }).catch(error => console.error(error));
    };

    //TODO: pass the column names as another parameter and use those as keys of the json object
    getJsonObject = function (htmlRecord) {
        if (htmlRecord === "") return;
        let records = htmlRecord.split(tdStartTag);
        let jsonObj = {
            expenseName: this.getHyperlinkText(
                this.extractPropertyValue(records[1])
            ),
            expenseDetailsUrl: this.getHyperlink(
                this.extractPropertyValue(records[1])
            ),
            isEligible: this.extractPropertyValue(records[2]) === "Eligible",
            prescriptionNeeded:
                this.extractPropertyValue(records[3]).toLowerCase() === "yes",
            certificationNeeded:
                this.extractPropertyValue(records[4]).toLowerCase() === "yes",
            formT2201Needed:
                this.extractPropertyValue(records[5]).toLowerCase() === "yes",
        };
        return jsonObj;
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
