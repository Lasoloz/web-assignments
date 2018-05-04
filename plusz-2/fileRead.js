"use strict";

const fs = require("fs");

// test file reading:
function readForm(filename) {
    try {
        const content = fs.readFileSync(filename, "utf-8");
        console.log("Read file!");

        const formObj = JSON.parse(content);
        console.log("Parsed file!");

        let form = [];
        for (let field in formObj) {
            try {
                let obj = {};
                if (field[0] == 'n') {
                    const name = field.slice(1, field.length - 4);
                    const num1 = parseInt(
                        field.slice(field.length - 4, field.length - 2)
                    );
                    const num2 = parseInt(field.slice(field.length - 2));
                    obj.name = name;
                    obj.type = "dropdown";
                    obj.items = [];
                    for (let i = num1; i <= num2; ++i) {
                        obj.items.push(i.toString());
                    }
                } else if (field[0] == 's') {
                    if (field.slice(-8) == "Question") {
                        continue;
                    } else {
                        const name = field.slice(1);
                        obj.name = name;
                        obj.type = "text";
                        obj.label = formObj[field];
                    }
                } else if (field[0] == 'i') {
                    const name = field.slice(1);
                    obj.name = name;
                    obj.type = "dropdown";
                    obj.items = formObj[("as" + name + "List")];
                } else if (field[0] == 'b') {
                    const name = field.slice(1);
                    obj.name = name;
                    obj.type = "question";
                    obj.question = formObj['s' + name + "Question"];
                } else if (field.slice(0, 2) == "ab") {
                    if (field.slice(-3) == "chk") {
                        const name = field.slice(2, field.length - 3);
                        obj.name = name;
                        obj.type = "checkbox";
                        obj.items = [];

                        let poss = formObj[field];
                        let vals = formObj[("ab" + name + "chk1")];
                        for (let i = 0; i < poss.length; ++i) {
                            obj.items.push({ name: poss[i], value: vals[i] });
                        }
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
                form.push(obj);
            } catch (ex) {
                console.error("Failure in row!");
            }
        }

        return form;
    } catch (err) {
        console.error("Failed to read or parse file: ", err.message);
        return null;
    }
}


// // Test:
// (() => {
//     const form = readForm("form.json");
//     console.log(form);
// })();


module.exports = readForm;
