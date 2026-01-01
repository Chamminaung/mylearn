import { system, cpu } from 'systeminformation';
import { networkInterfaces as _networkInterfaces } from 'os'; // MAC Address ကို Node ရဲ့ built-in module နဲ့လည်း ရနိုင်သည်

async function getHardwareInfo() {
    console.log('--- 🖥️ စနစ်၏ အဓိက Hardware အချက်အလက်များ ---');

    // 1. စနစ် (System) ၏ Serial Number ကို ရယူခြင်း
    try {
        const systemInfo = await system();
        console.log(`\n**[စနစ် အချက်အလက်]**`);
        console.log(`Serial Number (နံပါတ်စဉ်): ${systemInfo.serial || 'N/A'}`);
        console.log(`UUID: ${systemInfo.uuid || 'N/A'}`);
    } catch (e) {
        console.error('System Info ရယူရာတွင် အမှားဖြစ်သည်:', e.message);
    }

    // 2. CPU အချက်အလက်နှင့် Processor ID ကို ရယူခြင်း
    // (Note: CPU ID ဟာ Platform အားလုံးမှာ အမြဲတမ်း ရနိုင်ချင်မှ ရနိုင်ပါလိမ့်မယ်။ VendorID ကို အသုံးပြုနိုင်သည်)
    try {
        const cpuInfo = await cpu();
        console.log(`\n**[CPU အချက်အလက်]**`);
        console.log(`Processor (Brand): ${cpuInfo.manufacturer} ${cpuInfo.brand}`);
        console.log(`Physical Cores (ရုပ်ပိုင်းဆိုင်ရာ Core အရေအတွက်): ${cpuInfo.physicalCores}`);
        console.log(`CPU Flags (Processor ID/Feature): ${cpuInfo.flags.substring(0, 50)}...`); // flags ထဲမှာ အသေးစိတ် ID တွေ ပါနိုင်တယ်
        // Windows/Linux မှာ ProcessorID ကို si.cpu() ထဲကနေ တိုက်ရိုက်ရနိုင်ပေမယ့် macOS မှာတော့ မရနိုင်ပါဘူး။
    } catch (e) {
        console.error('CPU Info ရယူရာတွင် အမှားဖြစ်သည်:', e.message);
    }

    // 3. MAC Address ကို ရယူခြင်း (Built-in `os` module ဖြင့်)
    // MAC Address ကို Network Interface အလိုက် ရရှိမည်
    try {
        const networkInterfaces = _networkInterfaces();
        console.log(`\n**[MAC Address များ]**`);
        
        // Network Interface တစ်ခုချင်းစီကို လှည့်ပတ်ပြီး MAC Address တွေကို ထုတ်ပြသည်
        for (const interfaceName in networkInterfaces) {
            const iface = networkInterfaces[interfaceName];
            for (const details of iface) {
                if (details.mac && details.mac !== '00:00:00:00:00:00' && !details.internal) {
                    console.log(`Interface: ${interfaceName}`);
                    console.log(`MAC Address: **${details.mac}**`);
                }
            }
        }
    } catch (e) {
        console.error('MAC Address ရယူရာတွင် အမှားဖြစ်သည်:', e.message);
    }
}

getHardwareInfo();