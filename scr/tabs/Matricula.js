import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Picker,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br"); // Configura o moment para português

// Configuração de local para o calendário
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

const classSchedules = {
  Zumba: ["08:00", "10:00", "16:00"],
  Yoga: ["07:00", "09:00", "18:00"],
  Pilates: ["06:00", "12:00", "17:00"],
};

export default function Matricula({ navigation }) {
  const [selectedClass, setSelectedClass] = useState("Zumba");
  const [selectedTime, setSelectedTime] = useState(classSchedules["Zumba"][0]);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  ); // Data atual
  const [modalVisible, setModalVisible] = useState(false);

  const onDateChange = (day) => {
    setSelectedDate(day.dateString);
  };

  const onClassChange = (itemValue) => {
    setSelectedClass(itemValue);
    setSelectedTime(classSchedules[itemValue][0]);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    alert(
      `Matriculado na aula de ${selectedClass} no dia ${selectedDate} às ${selectedTime}!`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>MATRICULAR</Text>

        <View style={styles.pickerContainer}>
          <Text style={[styles.label, styles.HorarioLabel]}>Aula:</Text>
          <Picker
            selectedValue={selectedClass}
            style={styles.picker}
            onValueChange={onClassChange}
          >
            <Picker.Item label="Zumba" value="Zumba" />
            <Picker.Item label="Yoga" value="Yoga" />
            <Picker.Item label="Pilates" value="Pilates" />
          </Picker>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.label}>Horário:</Text>
          <Picker
            selectedValue={selectedTime}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedTime(itemValue)}
          >
            {classSchedules[selectedClass].map((time) => (
              <Picker.Item key={time} label={time} value={time} />
            ))}
          </Picker>
        </View>

        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "#34495E",
            textAlign: "center",
            margin: 10,
          }}
        >
          Selecione a Data
        </Text>

        <Calendar
          style={styles.calendar}
          current={selectedDate}
          onDayPress={onDateChange}
          monthFormat={"MMMM yyyy"}
          hideExtraDays={true}
          firstDay={1}
          showWeekNumbers={true}
          markedDates={{
            [selectedDate]: {
              selected: true,
              marked: true,
              selectedColor: "#34495E",
            },
          }}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#34495E",
            selectedDayBackgroundColor: "#34495E",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#F1C40F",
            dayTextColor: "#34495E",
            textDisabledColor: "#d9e1e8",
            dotColor: "#F1C40F",
            selectedDotColor: "#ffffff",
            arrowColor: "#F1C40F",
            monthTextColor: "#34495E",
            indicatorColor: "#34495E",
            textDayFontFamily: "monospace",
            textMonthFontFamily: "monospace",
            textDayHeaderFontFamily: "monospace",
            textDayFontWeight: "300",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "300",
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.confirmButtonText}>CONFIRMAR</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Deseja confirmar a matrícula para a aula de {selectedClass} no dia{" "}
              {selectedDate} às {selectedTime}?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmModalButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    color: "#333",
  },
  HorarioLabel: {
    marginRight: 20,
  },

  picker: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  calendar: {
    marginVertical: 20,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: "#48C9B0",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#34495E",
    padding: 10,
    borderRadius: 5,
  },
  confirmModalButton: {
    backgroundColor: "#F1C40F",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "justify",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
});
