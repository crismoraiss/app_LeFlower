import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  View,
  ImageBackground,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Servico from "./scr/tabs/Servico";
import Agendamento from "./scr/tabs/Agendamento";
import Perfil from "./scr/tabs/Perfil";
import Home from "./scr/tabs/Home";
import MyAulas from "./scr/tabs/MyAulas"; // Mantido
import Matricula from "./scr/tabs/Matricula";
import Favoritos from "./scr/tabs/Favoritos";
import Historico from "./scr/tabs/Historico";
import MeuPerfil from "./scr/tabs/MeuPerfil";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#59848e",
  },
  imageContainer: {
    flex: 2,
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "start",
    width: "100%",
    paddingBottom: 10,
    marginLeft: 15,
  },
  img: {
    width: "60%",
    resizeMode: "contain",
  },
  text: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "55%",
    height: 50,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    color: "#fff",
    textAlign: "center",
  },
  focusedInput: {
    borderColor: "#FFD700",
  },
  btn: {
    width: "55%",
    height: 40,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 25,
    overflow: "hidden",
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#e4b48d",
    fontWeight: "bold",
    fontSize: 18,
  },
  resetSenha: {
    color: "#e4b48d",
    marginTop: 5,
    letterSpacing: 1,
  },

  // ESTILO 
  bottomContainer: {
    flex: 7,
    alignItems: "center",
    paddingTop: 30,
  },
curvedContainer: {
    flex: 3, // 30% da altura total
    backgroundColor: "#59848e",
    marginTop: -30, // Ajustar para que o verde cubra a parte branca
  },
  backText: {
    fontSize: 20,
    color: "#000",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  title: {
    fontSize: 18,
    color: "#e4b48d",
    marginBottom: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
btnTextEsqueci: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },

  topContainerEsqueci: {
    flex: 3, // 70% da altura total
    backgroundColor: "#e4b48d",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30, // Borda inferior esquerda curvada
    borderBottomRightRadius: 30, // Borda inferior direita curvada
    zIndex: 1, // Garantir que o contêiner superior fique sobreposto
  },

});

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack({ route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        initialParams={{ idCliente: route.params?.idCliente }}
      />
      <Stack.Screen
        name="MyAulas"
        component={MyAulas}
        initialParams={{ idCliente: route.params?.idCliente }}
        options={{ title: "Minhas Aulas" }} // Mantido
      />
      <Stack.Screen name="Matricula" component={Matricula} />
    </Stack.Navigator>
  );
}

function ServicoStack({ route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Servico"
        component={Servico}
        initialParams={{ idCliente: route.params?.idCliente }}
        options={{ title: "Serviços" }}
      />
    </Stack.Navigator>
  );
}

function AgendamentoStack({ route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Agendamento"
        component={Agendamento}
        initialParams={{ idCliente: route.params?.idCliente }}
      />
    </Stack.Navigator>
  );
}

function PerfilStack({ route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Perfil"
        component={Perfil}
        initialParams={{ idCliente: route.params?.idCliente }}
      />
      <Stack.Screen
        name="Favoritos"
        component={Favoritos}
        initialParams={{ idCliente: route.params?.idCliente }}
        options={{ title: "Favoritos" }}
      />
      <Stack.Screen
        name="Historico"
        component={Historico}
        initialParams={{ idCliente: route.params?.idCliente }}
        options={{ title: "Histórico" }}
      />
      <Stack.Screen
        name="MeuPerfil"
        component={MeuPerfil}
        initialParams={{ idCliente: route.params?.idCliente }}
        options={{ title: "Meu Perfil" }}
      />
    </Stack.Navigator>
  );
}

function MyTabs({ route }) {
  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: "rgba(89, 132, 142, 0.842)" }}
      activeColor="#e4b48d"
      inactiveColor="#ffffff"
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: "rgba(89, 132, 142, 0.842)" },
        tabBarActiveTintColor: "#3498db",
        tabBarInactiveTintColor: "#e4b48d",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        initialParams={{ idCliente: route.params?.idCliente }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Servico"
        component={ServicoStack}
        initialParams={{ idCliente: route.params?.idCliente }}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list-ul" size={26} color={color} />
          ),
          tabBarLabel: "Serviços",
        }}
      />
      <Tab.Screen
        name="Agendamento"
        component={AgendamentoStack}
        initialParams={{ idCliente: route.params?.idCliente }}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={24} color={color} />
          ),
          tabBarLabel: "Agendamento",
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilStack}
        initialParams={{ idCliente: route.params?.idCliente }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" color={color} size={30} />
          ),
          tabBarLabel: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
}

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      setErrorModalVisible(true);
      return;
    }

    try {
      const resposta = await axios.post("http://127.0.0.1:8000/api/login", {
        emailUsuario: email,
        senhaUsuario: senha,
      });
      if (resposta.data) {
        const cliente = resposta.data;
        if (cliente) {
          const idCliente = cliente.user.dados_cliente.idCliente;
          const token = cliente.access_token;

          // Armazenando o token na memória do APP (AsyncStorage)
          await AsyncStorage.setItem("useToken", token);
          await AsyncStorage.setItem("idCliente", idCliente);

          navigation.navigate("Main", { idCliente });
        }
      }
    } catch (error) {
      console.error("Erro ao verificar email e a senha", error);
      setErrorModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={require("./assets/fundoo.png")} // Substitua pelo link da sua imagem
          style={styles.image}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Image style={styles.img} source={require("./assets/logoo.png")} />
          </View>
        </ImageBackground>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isFocused && styles.focusedInput]}
          placeholder="Digite seu e-mail:"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#fff"
        />
        <TextInput
          secureTextEntry={true}
          style={[styles.input, isFocused && styles.focusedInput]}
          placeholder="Digite sua senha:"
          value={senha}
          onChangeText={setSenha}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#fff"
        />
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>ENTRAR</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Reset")}>
          <Text style={styles.resetSenha}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={errorModalVisible}
        onBackdropPress={() => setErrorModalVisible(false)}
      >
        <View style={styles.errorModalVisible}>
          <Text style={styles.errorModalTitle}>Erro</Text>
          <Text style={styles.errorModalMessage}>
            Email ou Senha incorretos. Tente Novamente.
          </Text>
          <TouchableOpacity onPress={() => setErrorModalVisible(false)}>
            <Text style={styles.errorModalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ResetScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainerEsqueci}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Image
          style={styles.imgEsqueci}
          source={require("./assets/logo.png")}
          resizeMode="contain"
        />
      </View>
      <View style={styles.curvedContainer}>
        <View style={styles.bottomContainer}>
          <Text style={styles.title}>PREENCHA SEUS DADOS</Text>
          <TextInput
            style={styles.input}
            placeholder="Email:"
            placeholderTextColor="#000000"
          />
          <TextInput
            style={styles.input}
            placeholder="Data de Nasc:"
            placeholderTextColor="#000000"
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone:"
            placeholderTextColor="#000000"
          />
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>CONFIRMAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MyTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Reset" component={ResetScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
