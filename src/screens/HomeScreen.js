import React, { useState } from "react";
import { View, Text, FlatList, Button, TextInput, ActivityIndicator } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import styles from "../styles/styles";
import { getPeople, deletePerson } from "../servers/peopleCrud";

function CardPersonal({ item, navigation, refresh }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>
      <View>
        <Button title="Editar" onPress={() => navigation.navigate("AddEdit", { person: item })} />
        <Button title="Deletar" onPress={async () => {
          await deletePerson(item.id);
          refresh();
        }} />
      </View>
    </View>
  )
}

export default function HomeScreen({ navigation }) {
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadPeople() {
    try {
      setLoading(true);
      setError(false);
      const data = await getPeople();
      setPeople(data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }

  }

  useFocusEffect(React.useCallback(() => {
    loadPeople();
  }, []));
  /* estava tendo um problema com sempre que adiciona alguém essa pessoa demorava para aparecer,
  descobri esse hook 'useFocusEffect' que toda vez que a tela é focada ele executa uma função,
  no caso loadPeople,
  e assim a pessoa aparece na hora */

  const filteredPeople = people.filter((person) =>
    (person.firstName || "").toLowerCase().includes(search.toLowerCase()) ||
    (person.lastName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pessoas</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar"
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      <Button title="Adicionar Pessoa" onPress={() => navigation.navigate("AddEdit")} />
      {loading ? (<ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />) : error ? (
        <Text style={styles.error}>Erro ao carregar pessoas</Text>
      ) : (
        <FlatList
          data={filteredPeople}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CardPersonal item={item} navigation={navigation} refresh={loadPeople} />
          )}
        />
      )}

    </View>
  );
}
