const fs = require("fs");
const path = require("path");

// Detect diretory ./source and ./output
const source = "./source";
const output = "./output";
if (!fs.existsSync(source)) fs.mkdirSync(source);
if (!fs.existsSync(output)) fs.mkdirSync(output);

// Filer type judgement regex
const regexP = /Programme Code/gi;
const regexM = /Module code/gi;
const outputFileExtension = ".json";

// Read files list in source directory
const files = fs.readdirSync(source);

// Loop through files
files.forEach((file) => {
  // Read file content
  const data = fs.readFileSync(path.join(source, file), "utf-8");
  let object = {};
  const lines = data.split("\r\n");
  // Judge file type
  console.log("ℹ️  Processing file: " + file + " ...");
  if (regexP.test(lines[0])) {
    // PROGRAMME STATISTIC CONVERTER
    regexP.lastIndex = 0; // Reset regex position
    const titles = lines[0]
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g)
      .map((field) => field.trim().replace(/^"|"$/g, ""));
    lastCode = "";
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g)
        .map((field) => field.trim().replace(/^"|"$/g, ""));
      if (line[0]) {
        lastCode = line[0];
        object[line[0]] = {};
        for (let j = 1; j < line.length - 9; j++) {
          object[line[0]][titles[j]] = line[j];
        }
        object[line[0]][titles[line.length - 9]] = {};
        object[line[0]][titles[line.length - 9]][line[line.length - 9]] = {};
        for (let j = line.length - 8; j < line.length; j++) {
          object[line[0]][titles[line.length - 9]][line[line.length - 9]][
            titles[j]
          ] = line[j];
        }
      } else {
        object[lastCode][titles[line.length - 9]][line[line.length - 9]] = {};
        for (let j = line.length - 8; j < line.length; j++) {
          object[lastCode][titles[line.length - 9]][line[line.length - 9]][
            titles[j]
          ] = line[j];
        }
      }
    }
  } else if (regexM.test(lines[0])) {
    // MODULE STATISTIC CONVERTER
    regexM.lastIndex = 0; // Reset regex position
    const titles = lines[0]
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g)
      .map((field) => field.trim().replace(/^"|"$/g, ""));
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g)
        .map((field) => field.trim().replace(/^"|"$/g, ""));
      object[line[0]] = {};
      for (let j = 1; j < 7; j++) {
        object[line[0]][titles[j]] = line[j];
      }
      object[line[0]]["Grade Distribution"] = {};
      for (let j = 7; j < line.length; j = j + 2) {
        if (j === line.length - 1) {
          object[line[0]][titles[line.length - 1]] = line[line.length - 1];
          break;
        }
        object[line[0]]["Grade Distribution"][titles[j]] = {};
        object[line[0]]["Grade Distribution"][titles[j]]["No."] = line[j];
        object[line[0]]["Grade Distribution"][titles[j]]["Percentage"] =
          line[j + 1];
      }
    }
  } else {
    // UNKNOWN FILE TYPE
    console.error(
      "   ⛔️ Unknown file type: " +
        file +
        ", please check the file type and try again."
    );
    return;
  }
  fs.writeFileSync(
    path.join(
      output,
      path.basename(path.join(source, file)) + outputFileExtension
    ),
    JSON.stringify(object),
    "utf-8"
  );
  console.log("   ✅ File " + file + " has been processed successfully.");
});
