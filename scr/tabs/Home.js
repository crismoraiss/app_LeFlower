import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import axios from "axios"; // Faz requisição HTTP para a API
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');

const banners = [
  {
    id: '1',
    text: '15% em cortes',
    code: 'USE: APPFLOWER',
    image: 'assets/bannerP2.webp', // Substitua pelo URL real da imagem
  },
  {
    id: '2',
    text: '20% em produtos',
    code: 'USE: BEAUTY20',
    image: 'assets/bannerPrincipal.webp ', // Substitua pelo URL real da imagem
  },
  // Adicione mais banners conforme necessário
];

const services = [
  {
    id: '1',
    image: 'assets/cabeloIcon2.png', // Substitua pelo URL real da imagem
  },
  {
    id: '2',
    image: 'assets/unhasIcon.png', // Substitua pelo URL real da imagem
  },
  {
    id: '3',
    image: 'assets/makeIcon.png', // Substitua pelo URL real da imagem
  },
  {
    id: '4',
    image: 'assets/DesignIcon.png', // Substitua pelo URL real da imagem
  },
  {
    id: '4',
    image: 'assets/rostoIcon.png', // Substitua pelo URL real da imagem
  },
];

const specificServices = [
  {
    id: '1',
    category: 'UNHAS',
    title: 'Nail Art',
    rating: 4.0,
    image: 'assets/nailArt.webp', // Substitua pelo URL real da imagem
  },
  {
    id: '2',
    category: 'CABELO',
    title: 'Corte e Escova',
    rating: 4.5,
    image: 'assets/corteEscoa.png', // Substitua pelo URL real da imagem
  },
  {
    id: '3',
    category: 'ROSTO',
    title: 'Limpeza de Pele',
    rating: 4.8,
    image: 'assets/limpezaDePele.webp', // Substitua pelo URL real da imagem
  },
  {
    id: '4',
    category: 'MAKE',
    title: 'Maquiagem Completa',
    rating: 4.7,
    image: 'assets/make.jpg', // Substitua pelo URL real da imagem
  },
  // Adicione mais serviços específicos conforme necessário
];

function WelcomeMessage({ name, imageUrl }) {
  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.welcomeTextContainer}>
        <Text style={styles.welcomeText}>
          OLÁ, <Text style={styles.nameText}>{name}</Text>
        </Text>
        <Text style={styles.subText}>Bem vindo (a)</Text>
      </View>
      <Image source={{ uri: imageUrl }} style={styles.profileImage} />
    </View>
  );
}

function BannerCarousel() {
  const flatListRef = useRef(null);

  return (
    <FlatList
      ref={flatListRef}
      data={banners}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.banner}>
          <Image source={{ uri: item.image }} style={styles.bannerImage} />
        </View>
      )}
    />
  );
}

function ServiceCarousel() {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % services.length;
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <FlatList
      ref={flatListRef}
      data={services}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.service}>
          <Image source={{ uri: item.image }} style={styles.serviceImage} />
          <Text style={styles.serviceText}>{item.name}</Text>
        </View>
      )}
    />
  );
}

function SpecificService({ category, title, rating, image }) {
  return (
    <View style={styles.specificServiceContainer}>
      <Image source={{ uri: image }} style={styles.specificServiceImage} />
      <View style={styles.specificServiceInfo}>
        <Text style={styles.specificServiceCategory}>{category}</Text>
        <Text style={styles.specificServiceTitle}>{title}</Text>
        <Text style={styles.specificServiceRating}>{rating.toFixed(1)} ★★★★☆</Text>
      </View>
    </View>
  );
}

export default function Home({ navigation, route }) {
  const { idCliente } = route.params || {};

  console.log("Código do Cliente:", idCliente);
  console.log(route.params);

  const [nomeCliente, setNomeCliente] = useState("");
  const [tipoPlano, setTipoPlano] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClienteData = async () => {
      try {
        const token = await AsyncStorage.getItem("useToken");
        if (!token) {
          throw new Error("Token não encontrado");
        }
        console.log("Token:", token);

        const resposta = await axios.get(
          `http://127.0.0.1:8000/api/cliente/${idCliente}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (resposta.status !== 200) {
          throw new Error(`Erro: ${resposta.status}`);
        }

        console.log("Resposta da API:", resposta.data);

        setNomeCliente(resposta.data.nomeCliente);
        setTipoPlano(resposta.data.planoCliente);
      } catch (error) {
        console.error("Erro ao buscar os dados do Cliente:", error);
        setError(error.message);
      }
    };

    if (idCliente) {
      fetchClienteData();
    }
  }, [idCliente]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.block}>
          <WelcomeMessage name={nomeCliente} imageUrl="./assets/fundoo.png" />
        </View>
        <View style={styles.block}>
          <BannerCarousel />
        </View>
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          <ServiceCarousel />
        </View>
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Serviços Específicos</Text>
          {specificServices.map(service => (
            <SpecificService
              key={service.id}
              category={service.category}
              title={service.title}
              rating={service.rating}
              image={service.image}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 10,
  },
  block: {
    marginBottom: 20,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    backgroundColor: '#e4f5ff',
    borderRadius: 10,
  },
  welcomeTextContainer: {
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: 20,
    color: '#333',
  },
  nameText: {
    fontWeight: 'bold',
    color: '#000',
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  banner: {
    width: width * 0.8,
    marginHorizontal: width * 0.1,
    alignItems: 'center',
    padding: 20,
  },
  bannerImage: {
    width: 350,
    height: 200,
    borderRadius: 10,
  },
  service: {
    width: 100,
    height: 100, // Definindo altura para garantir um bloco quadrado
    alignItems: 'center',
    justifyContent: 'center', // Centralizando o conteúdo
    marginHorizontal: 10,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 2,
    shadowRadius: 10,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50, // Fazendo a imagem circular para cobrir todo o bloco
  },
  serviceText: {
    position: 'absolute',
    bottom: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Adicionando fundo semi-transparente para melhor legibilidade
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  specificServiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  specificServiceImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  specificServiceInfo: {
    marginLeft: 10,
  },
  specificServiceCategory: {
    fontSize: 12,
    color: '#666',
  },
  specificServiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  specificServiceRating: {
    fontSize: 14,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
});
