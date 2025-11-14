import React, { useState } from "react";
import {
  View, Text, TextInput, Pressable, ActivityIndicator,
  Alert, Platform, Modal, TouchableOpacity, ScrollView
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const CURSOS = [
  "Ciência da Computação",
  "Engenharia de Software",
  "Sistemas de Informação",
  "Análise e Desenvolvimento de Sistemas",
  "Ciência de Dados",
  "Engenharia de Computação",
  "Redes de Computadores",
] as const;

// --- Schema atualizado com matrícula ---
const signUpSchema = z.object({
  nomeCompleto: z.string().min(3, "Digite seu nome completo."),
  dataNascimento: z.date({ required_error: "Selecione sua data de nascimento." })
    .refine((d) => d <= new Date(), { message: "Data inválida." }),
  email: z.string().email("E-mail inválido."),
  matricula: z.string()
    .min(5, "Matrícula deve ter pelo menos 5 dígitos.")
    .regex(/^\d+$/, "Matrícula deve conter apenas números."),
  curso: z.enum(CURSOS, { errorMap: () => ({ message: "Selecione um curso." }) }),
  senha: z.string().min(6, "Senha deve ter 6+ caracteres."),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCursoModal, setShowCursoModal] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<SignUpForm>({
      defaultValues: {
        nomeCompleto: "",
        dataNascimento: undefined as unknown as Date,
        email: "",
        matricula: "",
        curso: undefined as unknown as SignUpForm["curso"],
        senha: "",
      },
      resolver: zodResolver(signUpSchema),
      mode: "onChange",
    });

  const dataNascimento = watch("dataNascimento");
  const cursoSelecionado = watch("curso");

  function formatDate(d?: Date) {
    if (!d) return "Selecionar";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  async function onSubmit(data: SignUpForm) {
    try {
      setSubmitting(true);
      await new Promise((res) => setTimeout(res, 800));
      Alert.alert(
        "Cadastro criado!",
        `Nome: ${data.nomeCompleto}\nMatrícula: ${data.matricula}\nCurso: ${data.curso}`
      );
    } catch {
      Alert.alert("Erro", "Não foi possível concluir o cadastro.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Cabeçalho */}
      <View style={{
        backgroundColor: "#facc15",
        paddingTop: 24, paddingBottom: 24,
        alignItems: "center", justifyContent: "center",
        shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8
      }}>
        <Text style={{ fontSize: 40 }}>📘</Text>
        <Text style={{
          fontSize: 24, fontWeight: "800", color: "#111827", letterSpacing: 1
        }}>CADASTRO</Text>
      </View>

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <View style={{
          backgroundColor: "#fff", borderRadius: 12, padding: 16,
          borderWidth: 1, borderColor: "#e5e7eb",
          shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6
        }}>

          {/* DADOS PESSOAIS */}
          <Text style={{ fontWeight: "800", marginBottom: 8, color: "#111827" }}>DADOS PESSOAIS</Text>

          <Text style={{ fontWeight: "600", marginTop: 4 }}>Nome completo</Text>
          <Controller
            control={control}
            name="nomeCompleto"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Seu nome completo"
                autoCapitalize="words"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{
                  borderWidth: 1,
                  borderColor: errors.nomeCompleto ? "#ef4444" : "#e5e7eb",
                  borderRadius: 12, padding: 12, marginTop: 6
                }}
              />
            )}
          />
          {errors.nomeCompleto && (
            <Text style={{ color: "#ef4444", marginTop: 4 }}>{errors.nomeCompleto.message}</Text>
          )}

          {/* Data de nascimento */}
          <Text style={{ fontWeight: "600", marginTop: 14 }}>Data de nascimento</Text>
         <Pressable
  onPress={() => setShowDatePicker(true)}
  style={{
    borderWidth: 1,
    borderColor: errors.dataNascimento ? "#ef4444" : "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    backgroundColor: "#f9fafb",
  }}
>
  <Text style={{ color: dataNascimento ? "#111827" : "#9ca3af" }}>
    {formatDate(dataNascimento)}
  </Text>
</Pressable>

          {errors.dataNascimento && (
            <Text style={{ color: "#ef4444", marginTop: 4 }}>{errors.dataNascimento.message}</Text>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={dataNascimento || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) setValue("dataNascimento", date, { shouldValidate: true });
              }}
              maximumDate={new Date()}
            />
          )}

          {/* CONTATO */}
          <Text style={{ fontWeight: "800", marginTop: 20, marginBottom: 8, color: "#111827" }}>CONTATO</Text>
          <Text style={{ fontWeight: "600" }}>E-mail</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="voce@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{
                  borderWidth: 1,
                  borderColor: errors.email ? "#ef4444" : "#e5e7eb",
                  borderRadius: 12, padding: 12, marginTop: 6
                }}
              />
            )}
          />
          {errors.email && (
            <Text style={{ color: "#ef4444", marginTop: 4 }}>{errors.email.message}</Text>
          )}

          {/* ACADÊMICO */}
          <Text style={{ fontWeight: "800", marginTop: 20, marginBottom: 8, color: "#111827" }}>ACADÊMICO</Text>

          {/* MATRÍCULA */}
          <Text style={{ fontWeight: "600" }}>Matrícula</Text>
          <Controller
            control={control}
            name="matricula"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Digite sua matrícula"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{
                  borderWidth: 1,
                  borderColor: errors.matricula ? "#ef4444" : "#e5e7eb",
                  borderRadius: 12, padding: 12, marginTop: 6
                }}
              />
            )}
          />
          {errors.matricula && (
            <Text style={{ color: "#ef4444", marginTop: 4 }}>{errors.matricula.message}</Text>
          )}

          {/* CURSO */}
          <Text style={{ fontWeight: "600", marginTop: 14 }}>Curso</Text>
          <Pressable
            onPress={() => setShowCursoModal(true)}
            style={{
              borderWidth: 1,
              borderColor: errors.curso ? "#ef4444" : "#e5e7eb",
              borderRadius: 12, padding: 12, marginTop: 6
            }}
          >
            <Text style={{ color: cursoSelecionado ? "#111827" : "#9ca3af" }}>
              {cursoSelecionado || "Selecionar curso"}
            </Text>
          </Pressable>
          {errors.curso && <Text style={{ color: "#ef4444", marginTop: 4 }}>{errors.curso.message}</Text>}

          {/* Modal de seleção de curso */}
          <Modal
            visible={showCursoModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowCursoModal(false)}
          >
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" }}>
              <View style={{ backgroundColor: "#fff", borderTopRightRadius: 16, borderTopLeftRadius: 16, padding: 16 }}>
                <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 8 }}>Selecione o curso</Text>
                <Picker
                  selectedValue={cursoSelecionado}
                  onValueChange={(val) =>
                    setValue("curso", val as SignUpForm["curso"], { shouldValidate: true })
                  }
                >
                  <Picker.Item label="Selecionar curso" value={undefined as unknown as SignUpForm["curso"]} />
                  {CURSOS.map((c) => (
                    <Picker.Item key={c} label={c} value={c} />
                  ))}
                </Picker>
                <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 8 }} onPress={() => setShowCursoModal(false)}>
                  <Text style={{ fontWeight: "700", color: "#2563eb" }}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* SENHA */}
          <Text style={{ fontWeight: "800", marginTop: 20, marginBottom: 8, color: "#111827" }}>SEGURANÇA</Text>
          <Text style={{ fontWeight: "600" }}>Senha</Text>
          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="••••••"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{
                  borderWidth: 1,
                  borderColor: errors.senha ? "#ef4444" : "#e5e7eb",
                  borderRadius: 12, padding: 12, marginTop: 6
                }}
              />
            )}
          />
          {errors.senha && <Text style={{ color: "#ef4444", marginTop: 4 }}>{errors.senha.message}</Text>}

          {/* BOTÃO */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={submitting}
            style={{
              backgroundColor: "#facc15",
              opacity: submitting ? 0.6 : 1,
              paddingVertical: 14, borderRadius: 12, alignItems: "center",
              marginTop: 20, borderWidth: 1, borderColor: "#eab308"
            }}
          >
            {submitting
              ? <ActivityIndicator />
              : <Text style={{ color: "#111827", fontWeight: "800" }}>CADASTRE-SE</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
