import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

const services = [
  {
    id: '1',
    title: 'Corte Feminino',
    category: 'Cabelo',
    description: 'Adaptado às preferências individuais de cada cliente.',
    price: '100,00',
    image: 'assets/corteFem.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '2',
    title: 'Manicure',
    category: 'Unhas',
    description: 'Começamos com uma consulta para entender as preferências e necessidades.',
    price: '85,00',
    image: 'assets/manicure.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '3',
    title: 'Design',
    category: 'Maquiagem',
    description: 'Utilizando técnicas precisas de maquiagem e modelagem, nossos especialistas em',
    price: '70,00',
    image: 'assets/design.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '4',
    title: 'Skin Care',
    category: 'Pele',
    description: 'Tratamento que pode incluir limpeza profunda, esfoliação suave, máscaras',
    price: '110,00',
    image: 'assets/skinCare.webp', // Substitua pelo URL real da imagem
  },
  {
    id: '5',
    title: 'Massagem Relaxante',
    category: 'Corpo',
    description: 'Alivie o estresse e relaxe com nossa massagem especial.',
    price: '150,00',
    image: 'assets/massagem.webp', // Substitua pelo URL real da imagem
  },
  {
    id: '6',
    title: 'Pedicure',
    category: 'Unhas',
    description: 'Cuide dos seus pés com nosso serviço de pedicure profissional.',
    price: '90,00',
    image: 'assets/pedicure.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '7',
    title: 'Penteado',
    category: 'Cabelo',
    description: 'Estilize seu cabelo para qualquer ocasião com nossos especialistas.',
    price: '120,00',
    image: 'assets/penteado.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '8',
    title: 'Limpeza de Pele',
    category: 'Pele',
    description: 'Deixe sua pele limpa e renovada com nossa limpeza de pele profunda.',
    price: '100,00',
    image: 'assets/limpezaDePele.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '9',
    title: 'Depilação',
    category: 'Corpo',
    description: 'Serviço de depilação para uma pele suave e livre de pelos.',
    price: '70,00',
    image: 'assets/depilacao.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '10',
    title: 'Sobrancelha',
    category: 'Maquiagem',
    description: 'Design de sobrancelhas para realçar sua expressão facial.',
    price: '50,00',
    image: 'assets/sobrancelha.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '11',
    title: 'Enfeites para cabelo',
    category: 'Cabelo',
    description: 'Corte de cabelo masculino e barbearia clássica.',
    price: '80,00',
    image: 'assets/enfeites.webp', // Substitua pelo URL real da imagem
  },
  {
    id: '12',
    title: 'Hidratação Capilar',
    category: 'Cabelo',
    description: 'Tratamento profundo para revitalizar os fios.',
    price: '95,00',
    image: 'assets/hidrata.jpeg', // Substitua pelo URL real da imagem
  },
  {
    id: '13',
    title: 'Maquiagem para Eventos',
    category: 'Maquiagem',
    description: 'Maquiagem profissional para ocasiões especiais.',
    price: '150,00',
    image: 'assets/makeEvent.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '14',
    title: 'Peeling Facial',
    category: 'Pele',
    description: 'Tratamento para renovação celular da pele do rosto.',
    price: '200,00',
    image: 'assets/peelingFacial.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '15',
    title: 'Massagem Terapêutica',
    category: 'Corpo',
    description: 'Massagem focada no alívio de tensões musculares.',
    price: '160,00',
    image: 'assets/massagemTerapeutica.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '16',
    title: 'Alongamento de Unhas',
    category: 'Unhas',
    description: 'Alongamento com gel ou acrílico para unhas perfeitas.',
    price: '120,00',
    image: 'assets/alongamentoUnhas.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '17',
    title: 'Bronzeamento Artificial',
    category: 'Corpo',
    description: 'Conquiste um bronzeado natural e saudável.',
    price: '100,00',
    image: 'assets/bronze.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '18',
    title: 'Reflexologia',
    category: 'Corpo',
    description: 'Massagem nos pés que alivia tensões e melhora o bem-estar.',
    price: '130,00',
    image: 'assets/reflexologia.webp', // Substitua pelo URL real da imagem
  },
  {
    id: '19',
    title: 'Tintura Capilar',
    category: 'Cabelo',
    description: 'Tintura profissional para mudar a cor dos cabelos.',
    price: '110,00',
    image: 'assets/tinturaCapilar.jpg', // Substitua pelo URL real da imagem
  },
  {
    id: '20',
    title: 'Esfoliação Corporal',
    category: 'Corpo',
    description: 'Tratamento que remove células mortas e deixa a pele renovada.',
    price: '120,00',
    image: 'assets/esfoliacaoCorporal.jpeg', // Substitua pelo URL real da imagem
  },
  // Adicione mais serviços conforme necessário
];

const ServiceCard = ({ service }) => {
  return (
    <View style={styles.serviceCard}>
      <Image source={{ uri: service.image }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle}>{service.title}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>
        <Text style={styles.servicePrice}>R${service.price}</Text>
      </View>
    </View>
  );
};

const ServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Popular');

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === 'Popular' || service.category === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
    
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
        />
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'Popular' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('Popular')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'Popular' && styles.filterButtonTextActive]}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'Cabelo' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('Cabelo')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'Cabelo' && styles.filterButtonTextActive]}>Cabelo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'Unhas' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('Unhas')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'Unhas' && styles.filterButtonTextActive]}>Unhas</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'Maquiagem' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('Maquiagem')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'Maquiagem' && styles.filterButtonTextActive]}>Maquiagem</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'Pele' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('Pele')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'Pele' && styles.filterButtonTextActive]}>Pele</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'Corpo' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('Corpo')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'Corpo' && styles.filterButtonTextActive]}>Corpo</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ServiceCard service={item} />}
          style={styles.serviceList}
          contentContainerStyle={styles.serviceListContent}
        />
        <TouchableOpacity style={styles.scheduleButton}>
          <Text style={styles.scheduleButtonText}>AGENDAR</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    // Adicione o estilo do ícone de volta aqui
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#789',
    padding: 10,
    borderRadius: 5,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'center', // Centraliza os botões horizontalmente
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 8,
    borderWidth: 1,
    borderColor: '#789',
  },
  filterButtonActive: {
    backgroundColor: '#789',
  },
  filterButtonText: {
    color: '#789',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  serviceList: {
    marginBottom: 20,
  },
  serviceListContent: {
    paddingBottom: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  serviceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e4b48d',
    marginTop: 5,
  },
  scheduleButton: {
    backgroundColor: '#e4b48d',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ServicesPage;
