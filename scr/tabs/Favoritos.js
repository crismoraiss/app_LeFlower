import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Certifique-se de instalar a biblioteca react-native-vector-icons

const historyData = [
  {
    id: '1',
    title: 'Nail designer',
    address: 'Avenida Marechal Tito',
    distance: '21km',
    rating: 4.0,
    image: 'https://example.com/path/to/image.jpg', // Substitua pelo URL real da imagem
  },
  // Adicione mais itens conforme necessário
];

const HistoryCard = ({ item }) => {
  return (
    <View style={styles.historyCard}>
      <Image source={{ uri: item.image }} style={styles.historyImage} />
      <View style={styles.historyInfo}>
        <Text style={styles.historyTitle}>{item.title}</Text>
        <Text style={styles.historyAddress}>{item.address}</Text>
        <View style={styles.historyDetails}>
          <Text style={styles.historyRating}>{item.rating.toFixed(1)}</Text>
          <View style={styles.ratingStars}>
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="star"
                size={15}
                color={index < Math.floor(item.rating) ? '#ffd700' : '#ccc'}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.historyButton}>
            <Text style={styles.historyButtonText}>Reagendar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.historyDistance}>{item.distance}</Text>
    </View>
  );
};

const HistoryPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favoritos</Text>
        </View>
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard item={item} />}
          contentContainerStyle={styles.historyList}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4b48d',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  historyList: {
    paddingBottom: 20,
  },
  historyCard: {
    flexDirection: 'row',
    backgroundColor: '#dce3e7',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  historyImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6347',
  },
  historyAddress: {
    fontSize: 14,
    color: '#34495e',
  },
  historyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  historyRating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495e',
    marginRight: 5,
  },
  ratingStars: {
    flexDirection: 'row',
  },
  historyButton: {
    backgroundColor: '#e4b48d',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 'auto',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  historyDistance: {
    fontSize: 14,
    color: '#ff6347',
    fontWeight: 'bold',
  },
});

export default HistoryPage;
