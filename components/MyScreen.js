import React from 'react';
import { View } from 'react-native';
import SearchablePicker from './SearchablePicker';

export const MyScreen = () => {
  const data = [
    { label: 'Aman', value: 'option1' },
    { label: 'Ram', value: 'option2' },
    { label: 'Jhon', value: 'option3' },
    { label: 'Suraj', value: 'option4' },
  ];

  return (
    <View>
      <SearchablePicker data={data} placeholder="Select an option" />
    </View>
  );
};

