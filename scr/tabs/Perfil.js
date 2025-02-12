import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Perfil = ({ navigation, route }) => {
  const { idCliente } = route.params || {};

  const [nomeCliente, setNomeCliente] = useState('');
  const [fotoCliente, setFotoCliente] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClienteData = async () => {
      try {
        const token = await AsyncStorage.getItem('useToken');
        if (!token) {
          throw new Error('Token não encontrado');
        }

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

        setNomeCliente(resposta.data.nomeCliente);
        setFotoCliente(resposta.data.fotoCliente);
      } catch (error) {
        console.error('Erro ao buscar os dados do Cliente:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (idCliente) {
      fetchClienteData();
    }
  }, [idCliente]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34495e" />
      </SafeAreaView>
    );
  }

  const fotoUrl = `http://127.0.0.1:8000/assets/img-user/${fotoCliente}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: fotoUrl }} style={styles.logo} />
          <Text style={styles.logoText}>{nomeCliente}</Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MeuPerfil')}
          >
            <Icon name='user' size={20} color='#34495e' />
            <Text style={styles.menuText}>Meu perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Historico')}
          >
            <Icon name='history' size={20} color='#34495e' />
            <Text style={styles.menuText}>Meu histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Favoritos')}
          >
            <Icon name='heart' size={20} color='#34495e' />
            <Text style={styles.menuText}>Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Agendamento')}
          >
            <Icon name='calendar' size={20} color='#34495e' />
            <Text style={styles.menuText}>Agendamento</Text>
          </TouchableOpacity>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495e',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#34495e',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default Perfil;
