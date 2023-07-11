import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Modal } from 'react-native';

const SearchablePicker = ({ data, placeholder }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = text => {
    setSearchText(text);
    const filteredItems = data.filter(item =>
      item.label.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredItems);
  };

  const handleItemPress = item => {
    setSelectedItem(item);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          style={{ borderWidth: 1, padding: 10 }}
          placeholder={placeholder}
          value={selectedItem ? selectedItem.label : ''}
          editable={false}
        />
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <TextInput
            style={{ borderWidth: 1, padding: 10 }}
            placeholder="Search..."
            onChangeText={handleSearch}
            value={searchText}
          />
          <FlatList
            data={filteredData}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ padding: 10, borderBottomWidth: 1 }}
                onPress={() => handleItemPress(item)}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', padding: 10 }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default SearchablePicker;
