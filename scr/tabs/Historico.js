import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfettiCannon from 'react-native-confetti-cannon';

const HistoricoPage = ({ navigation, route }) => {
  const { idCliente } = route.params || {};
  const [HistoricoDados, setHistoricoDados] = useState([]);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [error, setError] = useState(null);

  const confettiRef = useRef(null);

  useEffect(() => {
    fetchAgendamentos();
  }, [idCliente]);

  const fetchAgendamentos = async () => {
    try {
      const token = await AsyncStorage.getItem("useToken");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/cliente/agendamentos/${idCliente}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Erro: ${response.status}`);
      }

      setHistoricoDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados dos agendamentos:", error);
      setError(error.message);
    }
  };

  const handleConfirmar = async (idAgendamento) => {
    const token = await AsyncStorage.getItem("useToken");
    if (!token) {
      Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/agendamentos/${idAgendamento}/confirmar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setModalVisible(false);
        setConfettiVisible(true);
        setShowCongrats(true);
        setTimeout(() => {
          setConfettiVisible(false);
          setShowCongrats(false);
          fetchAgendamentos();
        }, 3000);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  const handleCancelar = async (idAgendamento) => {
    const token = await AsyncStorage.getItem("useToken");
    if (!token) {
      Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/agendamentos/${idAgendamento}/cancelar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setModalVisible(false);
        setShowCancel(true);
        setTimeout(() => {
          setShowCancel(false);
          fetchAgendamentos();
        }, 3000);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  const openModal = (item) => {
    const agendamentoDate = new Date(item.dataAgendamento);
    const currentDate = new Date();
    const dayBefore = new Date(agendamentoDate);
    dayBefore.setDate(dayBefore.getDate() - 1);

    if (currentDate >= dayBefore && currentDate < agendamentoDate) {
      setSelectedAgendamento(item);
      setModalVisible(true);
    } else {
      Alert.alert("Aviso", "O botão de confirmação só estará disponível 24 horas antes do agendamento.");
    }
  };

  const HistoricoCard = ({ item }) => {
    return (
      <View style={styles.historyCard}>
        <View style={styles.iconContainer}>
          <Icon name="cut" size={30} color="#e4b48d" />
        </View>
        <View style={styles.historyInfo}>
          <Text style={styles.historyTitle}>{item.servico.nomeServico}</Text>
          <Text style={styles.historyDetail}>Data: {item.dataAgendamento}</Text>
          <Text style={styles.historyDetail}>Hora: {item.data_hora_inicial}</Text>
          <Text style={styles.historyDetail}>Categoria: {item.categoriaAgendamento}</Text>
          <Text style={styles.historyDetail}>Funcionário: {item.funcionario.nomeFuncionario}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={item.statusAgendamento === "pendente" ? styles.statusPending : styles.statusDone}>
            {item.statusAgendamento}
          </Text>
          {item.statusAgendamento === "pendente" && (
            <TouchableOpacity style={styles.plusButton} onPress={() => openModal(item)}>
              <Icon name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <FlatList
          data={HistoricoDados}
          keyExtractor={(item) => item.idAgendamento?.toString() || Math.random().toString()}
          renderItem={({ item }) => <HistoricoCard item={item} />}
          contentContainerStyle={styles.historyList}
        />
      </ScrollView>
      {selectedAgendamento && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Confirmar Agendamento?</Text>
              <Text style={styles.modalDetail}>Categoria: {selectedAgendamento.categoriaAgendamento}</Text>
              <Text style={styles.modalDetail}>Serviço: {selectedAgendamento.servico.nomeServico}</Text>
              <Text style={styles.modalDetail}>Data: {selectedAgendamento.dataAgendamento}</Text>
              <Text style={styles.modalDetail}>Horário: {selectedAgendamento.data_hora_inicial}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handleCancelar(selectedAgendamento.idAgendamento)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.agendarButton]}
                  onPress={() => handleConfirmar(selectedAgendamento.idAgendamento)}
                >
                  <Text style={styles.modalButtonText}>Agendar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {confettiVisible && (
        <ConfettiCannon
          count={200}
          origin={{x: -10, y: 0}}
          fadeOut={true}
          ref={confettiRef}
        />
      )}
      {showCongrats && (
        <View style={styles.congratsContainer}>
          <Text style={styles.congratsText}>Parabéns! Agendamento Confirmado!</Text>
        </View>
      )}
      {showCancel && (
        <View style={styles.cancelContainer}>
          <Text style={styles.cancelText}>Agendamento Cancelado!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    padding: 10,
  },
  historyList: {
    paddingBottom: 20,
  },
  historyCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#e4ebf1",
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#59848e",
    marginBottom: 5,
  },
  historyDetail: {
    fontSize: 15,
    color: "#34495e",
    marginBottom: 5,
  },
  statusContainer: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  statusPending: {
    color: "#e4b48d",
    fontWeight: "bold",
  },
  statusDone: {
    color: "#59848e",
    fontWeight: "bold",
  },
  plusButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#59848e",
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: '#e4b48d',
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#e4b48d",
    marginHorizontal: 5,
    alignItems: "center",
  },
  agendarButton: {
    backgroundColor: "#59848e",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  congratsContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -25 }],
    backgroundColor: 'rgba(89, 132, 142, 0.74)',
    padding: 20,
    borderRadius: 10,
    width: 300, // Ajuste a largura conforme necessário
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -25 }],
    backgroundColor: 'rgba(89, 132, 142, 0.74)',
    padding: 20,
    borderRadius: 10,
    width: 300, // Ajuste a largura conforme necessário
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HistoricoPage;
