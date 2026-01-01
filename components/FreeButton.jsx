import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
/**
 * အခမဲ့အတွက် ခလုတ် Component (FreeButton)
 * အသုံးပြုရန်: နှိပ်လိုက်သောအခါ လုပ်ဆောင်မည့် function (onPress) ကို လက်ခံသည်။
 */
export const FreeButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      // freeButtonContainer
      className="w-full max-w-xs rounded-xl border-2 border-emerald-500 bg-white shadow-md shadow-emerald-500/15"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View 
        // freeButtonInner
        className="py-3 px-5 justify-center items-center"
      >
        {/* အခမဲ့ စာသား (Free Text) */}
        <Text 
          // freeText
          className="text-emerald-500 text-base font-bold uppercase"
        >
          အခမဲ့ စတင်ပါ
        </Text>
      </View>
    </TouchableOpacity>
  );
};