import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5"
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  name: {
    fontSize: 14
  },
  email: {
    fontSize: 10
  },
  phone: {
    fontSize: 10
  },
  button: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  activityIndicator: {
    marginTop: 20
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20
  }
});
