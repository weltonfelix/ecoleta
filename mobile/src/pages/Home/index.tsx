import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Select from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface UfAndCityList {
  value: string;
  key: string;
  label: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<UfAndCityList[]>([]);
  const [cities, setCities] = useState<UfAndCityList[]>([]);

  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');

  const navigation =useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
    .then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      
      const ufsList = ufInitials.map(uf => (
        {
          value: String(uf),
          key: String(uf),
          label: String(uf),
        }
      ))

      setUfs(ufsList);
    })
  }, [])

  useEffect(() => {
    if (uf === '0' ) {
      setCities([]);
    }
    
    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
      .then(response => {
        const citiesName = response.data.map(city => city.nome);
        
        const citiesList = citiesName.map(city => (
          {
            value: String(city),
            key: String(city),
            label: String(city),
          }
        ))

        setCities(citiesList);
      })
  }, [uf]);


  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf,
      city,
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
            <View>
                  <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>
          </View>

        <View style={styles.footer}>
          <View style={styles.select}>
            <Select
              onValueChange={uf => {
                setUf(uf);
              }}
              placeholder={{label: "Selecione uma UF", value: "0", color: '#bbbbbb'}}
              items={ufs}
              value={uf}
            />
          </View>
          
          <View style={styles.select}>
            <Select
              onValueChange={city => {
                setCity(city);
              }}
              placeholder={{label: "Selecione uma Cidade", value: "0", color: '#bbbbbb'}}
              items={cities}
              value={city}
            />
          </View>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
    
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,marginBottom: 8,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});