import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MyAulas = ({ navigation }) => {
  const aulas = [
    {
      data: "03/04/2024",
      horarios: [
        { hora: "16:00", aula: "Zumba" },
        { hora: "18:00", aula: "Pilates" },
      ],
    },
    {
      data: "04/04/2024",
      horarios: [
        { hora: "16:00", aula: "Dança" },
        { hora: "17:00", aula: "Luta" },
      ],
    },
    {
      data: "10/04/2024",
      horarios: [
        { hora: "15:00", aula: "Luta" },
        { hora: "16:00", aula: "Zumba" },
        { hora: "18:00", aula: "Pilates" },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>AULAS</Text>
      </View>
      <ScrollView style={styles.conteudo}>
        {aulas.map((dia, index) => (
          <View key={index} style={styles.dia}>
            <Text style={styles.data}>{dia.data}</Text>
            {dia.horarios.map((item, idx) => (
              <View key={idx} style={styles.aulaItem}>
                <Text style={styles.hora}>{item.hora}</Text>
                <Text style={styles.aula}>{item.aula}</Text>
                <Ionicons name="create-outline" size={18} color="#00BFA6" />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.botaoAgendar}
        onPress={() => navigation.navigate("Matricula")}
      >
        <Text style={styles.botaoAgendarTexto}>Matricular novas Aulas</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#34495E",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  conteudo: {
    padding: 16,
  },
  dia: {
    marginBottom: 24,
  },
  data: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#34495E",
  },
  aulaItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  hora: {
    fontSize: 16,
    color: "#333",
  },
  aula: {
    fontSize: 16,
    color: "#34495E",
    marginLeft: 16,
    flex: 1,
  },
  botaoAgendar: {
    backgroundColor: "#34495E",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  botaoAgendarTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyAulas;
