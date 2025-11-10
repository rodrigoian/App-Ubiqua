import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { styles } from "./style";

export default function LoginScreen() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    if (matricula === "123" && senha === "123") {
      alert("Login realizado com sucesso!");
    } else {
      alert("Matrícula ou senha incorreta!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image
          source={require("../../assets/ubiqua_logo.png")} // ajuste o caminho
          style={styles.logo}
        />
        <Text style={styles.title}>UBÍQUA</Text>
      </View>
      <Text style={styles.subtitle}>Acessar</Text>

      <View style={styles.contentBox}>
        <Text style={{ color: "#002855", marginBottom: 5 }}>Matrícula</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua matrícula"
          value={matricula}
          onChangeText={setMatricula}
        />

        <Text style={{ color: "#002855", marginBottom: 5 }}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
