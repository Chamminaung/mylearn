import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
// StyleSheet ကို ဖယ်ရှားပြီး Tailwind CSS classes များဖြင့် အစားထိုးထားသည်။
// (ဤပတ်ဝန်းကျင်သည် Tailwind CSS utility များကို className prop မှတစ်ဆင့် ထောက်ပံ့ပေးသည်ဟု ယူဆသည်)

/**
 * ဝယ်ယူရန်အတွက် ခလုတ် Component (BuyButton)
 * အသုံးပြုရန်: ဈေးနှုန်း (price) နှင့် နှိပ်လိုက်သောအခါ လုပ်ဆောင်မည့် function (onPress) ကို လက်ခံသည်။
 */
export const BuyButton = ({ price, onPress }) => {
  // ဈေးနှုန်းကို $ ပုံစံဖြင့် ပြောင်းလဲဖော်ပြခြင်း
  // const formattedPrice = new Intl.NumberFormat('en-US', {
  //   style: 'currency',
  //   currency: 'USD',
  //   minimumFractionDigits: 0,
  //   maximumFractionDigits: 0,
  // }).format(price);


const formattedPrice = new Intl.NumberFormat('my-MM', {
  style: 'currency',
  currency: 'MMK',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(price);

  return (
    <TouchableOpacity
      // buyButtonContainer
      className="w-full max-w-xs rounded-xl overflow-hidden shadow-xl shadow-[#4F46E5]/30"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View 
        // buyButtonInner
        className="flex-row items-stretch bg-indigo-600"
      >
        {/* ဈေးနှုန်းပြသသည့် အပိုင်း */}
        <View 
          // priceTag
          className="bg-indigo-800 py-3 px-4 rounded-l-xl justify-center"
        >
          <Text 
            // priceText
            className="text-white text-lg font-extrabold"
          >
            {formattedPrice}
          </Text>
        </View>

        {/* ဝယ်ယူရန် စာသား */}
        <View 
          // buyTextContainer
          className="flex-1 py-3 px-4 justify-center items-center"
        >
          <Text 
            // buyText
            className="text-white text-base font-bold uppercase"
          >
            ဝယ်ယူရန်
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};