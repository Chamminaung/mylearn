// OCR text နမူနာများ
const ocrSamples = [
`AYA PAY
E-Receipt
Transaction Canal Plus Online
Name Merchant Payment
Transaction 240586029025
Code
Transaction done
Status
Date and Time 15 August 2025, 1:27 PM
Sender Name CHAM MIN AUNG
Sender Phone 09798702049
Amount 6,000 MMK
Remarks 09798702049
Powered by AYA Bank`,
`-5,300.00 «s
လုပ်ဆောင်သော အချိန် 06/11/2025 09:21:18
လုပ်ဆောင်မှုအမှတ် 01003962090921556959
လုပ်ဆောင်မှုအမျိုးအစား ငွေလွှဲ
ငွေလွှဲမည် သို့ Thinzar Win (******4067)
ငွေပမာဏ -5,300.00 Ks
မှတ်ချက် One`
];

// Myanmar -> English key mapping
const keyMap = {
  "Date and Time": "date",
  "လုပ်ဆောင်သော အချိန်": "date",
  "Transaction": "transaction",
  "လုပ်ဆောင်မှုအမှတ်": "transaction",
  "Sender Name": "party",
  "ငွေလွှဲမည် သို့": "party",
  "Sender Phone": "phone",
  "Amount": "amount",
  "ငွေပမာဏ": "amount",
  "Remarks": "remarks",
  "မှတ်ချက်": "remarks",
  "Status": "status",
  "လုပ်ဆောင်မှုအမျိုးအစား": "type"
};

export function parseOCRRobust(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const data = {};
  let currentKey = null;

  lines.forEach(line => {
    let matched = false;

    for (let key in keyMap) {
      if (line.startsWith(key)) {
        const value = line.replace(key, '').trim();
        data[keyMap[key]] = value || null;
        currentKey = keyMap[key];
        matched = true;
        break;
      } else {
        const regex = new RegExp(`${key}\\s*(.*)`);
        const match = line.match(regex);
        if (match) {
          data[keyMap[key]] = match[1].trim() || null;
          currentKey = keyMap[key];
          matched = true;
          break;
        }
      }
    }

    // Handle multi-line values: if previous key exists and current line didn't match any key
    if (!matched && currentKey) {
      if (data[currentKey]) {
        data[currentKey] += ' ' + line; // append new line
      } else {
        data[currentKey] = line;
      }
    }
  });

  return data;
}

// Test all OCR samples
// ocrSamples.forEach((text, i) => {
//   console.log(`\nOCR Sample ${i + 1}:`, parseOCRRobust(text));
// });
