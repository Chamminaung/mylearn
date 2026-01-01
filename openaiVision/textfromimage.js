// //import axios from "axios";
// //import fs from "fs";
// import OpenAI from "openai";
// import { OPENAI_API_KEY } from "../api/keys.js";

// const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY,
// });

// export async function extractTextFromImage(base64Image) {
//   try {
//     const response = await openai.responses.create({
//       model: "gpt-4.1-mini",
//     input: [
//         {
//             role: "user",
//             content: [
//                 { type: "input_text", text: `
//       You are an expert financial data extractor. The user provides a payment success screenshot.
//       From this image, extract the following data and return ONLY a JSON object that strictly adheres to the schema:
//       - "transaction_no" (The value of 'Transaction No.')
//       - "transfer_to" (The value of 'Transfer To')
//       - "amount_ks" (The numeric value of 'Amount', e.g., 5300.00)
//       - "transaction_status" (The value of 'Payment Successful' or similar status text)
//     ` },
//                 {
//                     type: "input_image",
//                     image_url: `data:image/jpeg;base64,${base64Image}`,
//                 },
//             ],
//         },
//     ],
// });
//     console.log(response.output_text);
//     return response.output_text;
//   } catch (error) {
//     console.log("🔥 OPENAI OCR ERROR:", error?.response?.data ?? error.message);
//     return null;
//   }
// }
