import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function MeuPerfil({ navigation, route }) {
  const { idCliente } = route.params || {};
  // console.log("ID do Cliente:", idCliente);

  const [nomeCliente, setNomeCliente] = useState("");
  const [foneCliente, setFoneCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [fotoCliente, setFotoCliente] = useState("");
  const [senhaCliente, setSenhaCliente] = useState("");
  const [error, setError] = useState(null);
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmSenhaCliente, setConfirmSenhaCliente] = useState("");

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const token = await AsyncStorage.getItem("useToken");
        if (!token) {
          throw new Error("Token não encontrado");
        }
        console.log("Token:", token);

        const response = await axios.get(
          `http://127.0.0.1:8000/api/cliente/${idCliente}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`Erro: ${response.status}`);
        }

        console.log("Resposta da API:", response.data);

        setNomeCliente(response.data.nomeCliente);
        setFoneCliente(response.data.telefoneCliente);
        setEmailCliente(response.data.emailCliente);
        setSenhaCliente(response.data.senhaCliente);
        setFotoCliente(response.data.fotoCliente);
      } catch (error) {
        console.error("Erro ao buscar os dados do Cliente:", error);
        setError(error.message);
      }
    };

    if (idCliente) {
      fetchCliente();
    }
  }, [idCliente]);

  useEffect(() => {
    console.log("Valor de fotoCliente:", fotoCliente);
  }, [fotoCliente]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da permissão para acessar suas fotos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFotoCliente(result.assets[0].uri);
    }
  };

  const salvar = async () => {
    const token = await AsyncStorage.getItem("useToken");
    if (!token) {
      Alert.alert('Erro', 'Token de autenticação não encontrado. Faça login novamente.');
      return;
    }
  
    if (senhaCliente !== confirmSenhaCliente) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
  
    const dadosCliente = {
      nomeCliente,
      telefoneCliente: foneCliente,
      emailCliente,
      senhaCliente,
      senhaCliente_confirmation: confirmSenhaCliente,
      fotoCliente,
    };
  
    try {
      const response = await axios({
        method: 'patch',
        url: `http://127.0.0.1:8000/api/cliente/${idCliente}`,
        data: dadosCliente,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      Alert.alert('Sucesso', 'Dados do cliente atualizados com sucesso.');
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao atualizar os dados do cliente:", error);
      Alert.alert('Erro', error.message);
    }
  };
  
  const fotoUrl = `http://127.0.0.1:8000/assets/img-user/${fotoCliente}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: fotoUrl }} // Use a URL correta da imagem do perfil do usuário
              style={styles.profileImage}
              onError={(e) => console.log("Erro ao carregar a imagem:", e.nativeEvent.error)}
            />
            <TouchableOpacity style={styles.editImageButton} onPress={handlePickImage}>
              <Icon name="edit" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Cliente"
            value={nomeCliente}
            onChangeText={setNomeCliente}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={emailCliente}
            onChangeText={setEmailCliente}
          />
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={foneCliente}
            onChangeText={setFoneCliente}
          />

<Text style={styles.label}>Senha</Text>
<View style={styles.senhaContainer}>
  <TextInput
    style={[styles.input, styles.inputSenha]}
    placeholder="Senha"
    secureTextEntry={!senhaVisivel}
    value={senhaCliente}
    onChangeText={setSenhaCliente}
  />
  <TouchableOpacity
    style={styles.iconeVisibilidade}
    onPress={() => setSenhaVisivel(!senhaVisivel)}
  >
    <Icon name={senhaVisivel ? "visibility" : "visibility-off"} size={24} color="#000" />
  </TouchableOpacity>
</View>
<Text style={styles.label}>Confirmar Senha</Text>
<View style={styles.senhaContainer}>
  <TextInput
    style={[styles.input, styles.inputSenha]}
    placeholder="Confirmar Senha"
    secureTextEntry={!senhaVisivel}
    value={confirmSenhaCliente}
    onChangeText={setConfirmSenhaCliente}
  />
</View>


          <TouchableOpacity style={styles.saveButton} onPress={salvar}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 20,
  },
  container: {
    flex: 1,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#59848e',
    borderRadius: 12,
    padding: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  inputSenha: {
    flex: 1,
    borderWidth: 0, // Remove a borda duplicada
  },
  iconeVisibilidade: {
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#59848e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
