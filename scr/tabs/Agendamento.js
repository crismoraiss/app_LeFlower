import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import Collapsible from "react-native-collapsible";
import Modal from 'react-native-modal';
import { Calendar } from "react-native-calendars";
import {
  buscarEspecialidades,
  buscarServicos,
  buscarHorarios,
  criarAgendamento,
} from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const { width } = Dimensions.get("window");

const PaginaAgendamento = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horariosSelecionados, setHorariosSelecionados] = useState({});
  const [horarios, setHorarios] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [isCategoriaCollapsed, setIsCategoriaCollapsed] = useState(true);
  const [isServicoCollapsed, setIsServicoCollapsed] = useState(true);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [dadosAgendamento, setDadosAgendamento] = useState(null);
  const [semHorarios, setSemHorarios] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    const listarEspecialidades = async () => {
      try {
        const dadosEspecialidades = await buscarEspecialidades();
        setEspecialidades(dadosEspecialidades);
        setCategoriaSelecionada(dadosEspecialidades[0]?.especialidade || "");
      } catch (error) {
        Alert.alert("Erro", "Erro ao buscar especialidades.");
      }
    };

    listarEspecialidades();
  }, []);

  useEffect(() => {
    const listarServicos = async () => {
      if (categoriaSelecionada) {
        try {
          const dadosServicos = await buscarServicos(categoriaSelecionada);
          setServicos(dadosServicos);
          setServicoSelecionado(dadosServicos[0]?.idServico || "");
        } catch (error) {
          Alert.alert("Erro", "Erro ao buscar serviços.");
        }
      }
    };

    listarServicos();
  }, [categoriaSelecionada]);

  useEffect(() => {
    const listarHorarios = async () => {
      if (servicoSelecionado && dataSelecionada) {
        try {
          const dadosHorarios = await buscarHorarios(
            categoriaSelecionada,
            servicoSelecionado,
            dataSelecionada
          );
          const mapaFuncionarios = new Map();
          dadosHorarios.forEach((horario) => {
            if (horario.idFuncionario) {
              if (!mapaFuncionarios.has(horario.idFuncionario)) {
                mapaFuncionarios.set(horario.idFuncionario, {
                  idFuncionario: horario.idFuncionario,
                  nomeFuncionario: horario.nomeFuncionario,
                  cargoFuncionario: horario.cargoFuncionario,
                  horarios: [],
                });
              }
              mapaFuncionarios
                .get(horario.idFuncionario)
                .horarios.push(horario.horario);
            }
          });

          const dadosFuncionarios = Array.from(mapaFuncionarios.values());
          setHorarios(dadosHorarios);
          setFuncionarios(dadosFuncionarios);
          setSemHorarios(dadosFuncionarios.length === 0);
        } catch (error) {
          Alert.alert("Erro", "Erro ao buscar horários.");
        }
      }
    };

    listarHorarios();
  }, [servicoSelecionado, dataSelecionada]);

  const formatarHorario = (horario) => {
    const [horas, minutos] = horario.split(":");
    return `${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}`;
  };

  const formatarHorarioExibicao = (horario) => {
    if (!horario) return ''; // Adiciona verificação de segurança
    const [horas, minutos] = horario.split(":");
    return `${horas}:${minutos}`;
  };

  const selecionarHorario = (funcionarioId, horario) => {
    setHorariosSelecionados({
      [funcionarioId]: horario,
    });
  };

  const confirmarAgendamento = async () => {
    try {
        const idCliente = await AsyncStorage.getItem("idCliente");

        if (!idCliente) {
            setErrorMessage("ID do cliente não encontrado.");
            setErrorModalVisible(true);
            return;
        }

        const funcionarioId = Object.keys(horariosSelecionados)[0];
        const horario = horariosSelecionados[funcionarioId];

        if (!horario) {
            setErrorMessage("Por favor, selecione um horário.");
            setErrorModalVisible(true);
            return;
        }

        const horarioFormatado = formatarHorario(horario);

        const dadosAgendamento = {
            data: dataSelecionada,
            especialidade: categoriaSelecionada,
            horario: horarioFormatado,
            idCliente: parseInt(idCliente, 10),
            idFuncionario: funcionarioId,
            idServico: servicoSelecionado,
        };

        setConfirmModalVisible(true);
        setDadosAgendamento(dadosAgendamento);
    } catch (error) {
        let mensagemErro;
        if (error.message.includes('split')) {
            mensagemErro = "Por favor, selecione um horário.";
        } else if (error.message === 'Você já possui um agendamento para esse horário.') {
            mensagemErro = error.message;
        } else {
            mensagemErro = `Erro ao criar agendamento: ${error.message}`;
        }
        setErrorMessage(mensagemErro);
        setErrorModalVisible(true);
    }
};

const agendar = async () => {
  try {
      await criarAgendamento(dadosAgendamento);
      setConfirmModalVisible(false);

      // Mostrar modal de sucesso
      setSuccessModalVisible(true);

      // Limpar estados
      setCategoriaSelecionada('');
      setServicoSelecionado('');
      setDataSelecionada('');
      setHorariosSelecionados({});
      setHorarios([]);
      setFuncionarios([]);
      setDadosAgendamento(null);
      setSemHorarios(false);
  } catch (error) {
      let mensagemErro;
      if (error.response && error.response.data && error.response.data.message) {
          mensagemErro = error.response.data.message;
      } else {
          mensagemErro = `Erro ao criar agendamento: ${error.message}`;
      }
      setErrorMessage(mensagemErro);
      setErrorModalVisible(true);
      setConfirmModalVisible(false);
  }
};

  const DesabilitarDia = (day) => {
    const today = moment().startOf("day");
    const selectedDay = moment(day.dateString);
    const threeMonthsLater = moment().add(3, "months").endOf("day");
    return selectedDay.isBefore(today) || selectedDay.isAfter(threeMonthsLater);
  };

  const formatarDuracaoServico = (duracao) => {
    const [horas, minutos] = duracao.split(":");
    if (parseInt(horas, 10) > 0) {
      return `${parseInt(horas, 10)}h ${parseInt(minutos, 10)}min`;
    }
    return `${parseInt(minutos, 10)} min`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            {/* Ícone de volta */}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AGENDAMENTO</Text>
        </View>

        <Text style={styles.label}>Selecione a categoria:</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            onPress={() => setIsCategoriaCollapsed(!isCategoriaCollapsed)}
          >
            <Text style={styles.picker}>
              {categoriaSelecionada || "Selecione uma categoria"}
            </Text>
          </TouchableOpacity>
          <Collapsible collapsed={isCategoriaCollapsed}>
            {especialidades.map((especialidade) => (
              <TouchableOpacity
                key={especialidade.especialidade}
                onPress={() => {
                  setCategoriaSelecionada(especialidade.especialidade);
                  setIsCategoriaCollapsed(true);
                }}
                style={styles.serviceItem}
              >
                <Text style={styles.serviceText}>
                  {especialidade.especialidade}
                </Text>
              </TouchableOpacity>
            ))}
          </Collapsible>
        </View>

        <Text style={styles.label}>Selecione o Serviço:</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            onPress={() => setIsServicoCollapsed(!isServicoCollapsed)}
          >
            <Text style={styles.picker}>
              {servicoSelecionado
                ? servicos.find((s) => s.idServico === servicoSelecionado)
                    ?.nomeServico
                : "Selecione um serviço"}
            </Text>
          </TouchableOpacity>
          <Collapsible collapsed={isServicoCollapsed}>
            {servicos.map((servico) => (
              <TouchableOpacity
                key={servico.idServico}
                onPress={() => {
                  setServicoSelecionado(servico.idServico);
                  setIsServicoCollapsed(true);
                }}
                style={styles.serviceItem}
              >
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceText}>{`${
                    servico.nomeServico
                  } | ${formatarDuracaoServico(servico.duracaoServico)}`}</Text>
                  <Text
                    style={styles.servicePrice}
                  >{`R$${servico.valorServico}`}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Collapsible>
        </View>

        <Calendar
          onDayPress={(day) =>
            !DesabilitarDia(day) && setDataSelecionada(day.dateString)
          }
          markedDates={{
            [dataSelecionada]: { selected: true, selectedColor: "#59848e" },
          }}
          theme={{
            todayTextColor: "#59848e",
            arrowColor: "#59848e",
          }}
          minDate={moment().format("YYYY-MM-DD")}
          maxDate={moment().add(3, "months").format("YYYY-MM-DD")}
          style={styles.calendar}
        />

        {semHorarios ? (
          <Text style={styles.noHorarios}>
            No momento não há horários disponíveis.
          </Text>
        ) : (
          funcionarios.map((funcionario) => (
            <View
              key={funcionario.idFuncionario}
              style={styles.professionalCard}
            >
              <View style={styles.professionalInfo}>
                <Text style={styles.professionalName}>
                  {funcionario.nomeFuncionario}
                </Text>
                <Text style={styles.professionalRole}>
                  {funcionario.cargoFuncionario}
                </Text>
                <View style={styles.timeSlots}>
                  {funcionario.horarios.map((horario, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeSlotButton,
                        horariosSelecionados[funcionario.idFuncionario] ===
                        horario
                          ? styles.selectedTimeSlotButton
                          : {},
                      ]}
                      onPress={() =>
                        selecionarHorario(funcionario.idFuncionario, horario)
                      }
                    >
                      <Text style={styles.timeSlotText}>
                        {formatarHorarioExibicao(horario)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmarAgendamento}
        >
          <Text style={styles.confirmButtonText}>Agendar</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal isVisible={confirmModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalDetals} >
          <Text style={styles.modalTitle}>Confirmar Agendamento?</Text>
          <Text style={styles.modalText}>Categoria: {categoriaSelecionada}</Text>
          <Text style={styles.modalText}>Serviço: {servicos.find((s) => s.idServico === servicoSelecionado)?.nomeServico}</Text>
          <Text style={styles.modalText}>Data: {dataSelecionada}</Text>
          <Text style={styles.modalText}>Horário: {formatarHorarioExibicao(Object.values(horariosSelecionados)[0])}</Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelModalButton} onPress={() => setConfirmModalVisible(false)}>
              <Text style={styles.ModalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmModalButton} onPress={agendar}>
              <Text style={styles.ModalButtonText}>Agendar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={errorModalVisible} onBackdropPress={() => setErrorModalVisible(false)}>
        <View style={styles.errorModalContainer}>
          <Text style={styles.errorModalTitle}>ATENÇÃO!</Text>
          <Text style={styles.errorModalMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.errorModalButton} onPress={() => setErrorModalVisible(false)}>
            <Text style={styles.errorModalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={successModalVisible} onBackdropPress={() => setSuccessModalVisible(false)}>
        <View style={styles.successModalContainer}>
          <Image
            source={require('../../assets/logo5.png')} // Certifique-se de ter a imagem correta
            style={styles.lotusImage}
          />
          <Text style={styles.successModalTitle}>Sucesso!</Text>
          <Text style={styles.successModalMessage}>Seu agendamento foi realizado com sucesso. </Text>
          <Text style={styles.successModalMessage}>Um email com os detalhes foi enviado.</Text>
          <TouchableOpacity style={styles.successModalButton} onPress={() => setSuccessModalVisible(false)}>
            <Text style={styles.successModalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#59848e",
  },
  label: {
    fontSize: 16,
    color: "#324b5c",
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e4b48d",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#59848e",
    padding: 15,
  },
  serviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e4b48d',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceText: {
    color: '#59848e',
  },
  servicePrice: {
    color: '#59848e',
    fontWeight: 'bold',
  },
  calendar: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e4b48d",
  },
  noFuncionarios: {
    fontSize: 16,
    color: "#34495e",
    textAlign: "center",
    marginVertical: 10,
  },
  noHorarios: {
    fontSize: 16,
    color: "#34495e",
    textAlign: "center",
    marginVertical: 10,
  },
  professionalCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e4b48d",
  },
  professionalInfo: {
    flex: 1,
    justifyContent: "center",
  },
  professionalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  professionalRole: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  timeSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  timeSlotButton: {
    backgroundColor: "#e4b48d",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedTimeSlotButton: {
    backgroundColor: "#59848e",
  },
  timeSlotText: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#59848e",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  //Modal de erro
  errorModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },


  errorModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#59848e',
  },
  errorModalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorModalButton: {
    backgroundColor: '#59848e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  errorModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  //Modal de confirmação
  modalContainer: {
    backgroundColor: 'white',
    // padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalDetals:{
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#59848e',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmModalButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 15,
    // borderRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    // marginRight: 5,
  },
   cancelModalButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 15,
    // borderRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    // marginLeft: 5,
  },
  ModalButtonText: {
    color: "#59848e",
    fontSize: 16,
    fontWeight: "bold",
  },
  //Modal de sucesso
  successModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lotusImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#59848e',
  },
  successModalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  successModalButton: {
    backgroundColor: '#e4b48d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  successModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaginaAgendamento;
