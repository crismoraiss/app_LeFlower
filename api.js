import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'http://127.0.0.1:8000/api';

const createAxiosInstance = async () => {
  const token = await AsyncStorage.getItem('useToken');
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Função para obter especialidades
export const buscarEspecialidades = async () => {
  const api = await createAxiosInstance();
  try {
    const response = await api.get('/agendamento');
    return response.data.especialidades;
  } catch (error) {
    console.error('Erro ao buscar especialidades:', error);
    throw error;
  }
};

// Função para obter serviços de uma especialidade
export const buscarServicos = async (especialidade) => {
  const api = await createAxiosInstance();
  try {
    const response = await api.get('/agendamento/servicos', {
      params: { especialidade },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    throw error;
  }
};

// Função para obter horários disponíveis de um serviço numa data específica
export const buscarHorarios = async (especialidade, tipoServico, data) => {
  const api = await createAxiosInstance();
  try {
    const response = await api.get('/agendamento/horarios', {
      params: { especialidade, tipoServico, data },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    throw error;
  }
};

// Função para criar um agendamento
export const criarAgendamento = async (dadosAgendamento) => {
  const api = await createAxiosInstance();
  try {
    const response = await api.post('/agendar', dadosAgendamento);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error(error.response.data.error);
    } else {
      throw error;
    }
  }
};

export default createAxiosInstance;
