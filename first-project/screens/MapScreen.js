//import { StatusBar } from 'expo-status-bar';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { StatusBar, Platform, Dimensions, Touchable } from 'react-native';
import { TouchableOpacity, StyleSheet, Text, View, Button, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

now_lat = 0
now_long = 0

function MapScreen({navigation}) {
  const [city, setCity] = useState("Loading...")
  const [region, setRegion] = useState(null);
  const [district, setDistrict] = useState(null);
  const [lat, setLat] = useState(37.5665);
  const [long, setLong] = useState(126.9780);

  const ask = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const { coords: {latitude, longitude} } = await Location.getCurrentPositionAsync({accuracy: 5});
    setLat(latitude)
    setLong(longitude)
    now_lat = latitude
    now_long = longitude
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
    setRegion(location[0].region);
    setDistrict(location[0].district);
  };

  useEffect(() => {
    ask();
  }, []);

  return(
    <View style={styles.container}>
      <View style={styles.headerStyle}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View padding='1%' style={{justifyContent: 'flex-start', paddingLeft: 20, paddingBottom: 10}}>
                <TouchableOpacity activeOpacity={0.8} hitSlop={{left: 30, right:30}} style={styles.button_white} 
                    onPress={() => navigation.pop()}>
                    <Text style={{color: '#ffce57', textAlign: 'center',
                        fontSize: 17, fontWeight: 'bold',}}>이전</Text>
                </TouchableOpacity>
            </View>
            <View padding='1%' style={{justifyContent: 'flex-end', paddingRight: 20, paddingBottom: 10}}>        
                <TouchableOpacity activeOpacity={0.8} hitSlop={{left: 30, right:30}} style={styles.button_yellow} 
                    onPress={() => positioning()}>
                <Text style={styles.text}>위치 저장</Text>
                </TouchableOpacity>
            </View>
        </View>
      <MapView 
        style={styles.map}
        region={{
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
        provider={PROVIDER_GOOGLE}
      > 
    	<Marker
            coordinate={{
            latitude: lat,
            longitude: long,
          }}
            pinColor="#2D63E2"
            // title="현재 위치"
            description="현재 위치"
          />
      {/* <Marker
            coordinate={{
              latitude: lat,
              longitude: long,
            }}
            description="저장 위치"
            /> */}
      </MapView>
      <View style={styles.bottom}>
        <Text style={styles.title}> 현재 위치 </Text>
        <Text style={styles.locate}>{region} {city} {district}</Text>
      </View>
    </View>
  );
}

const positioning = () => {
  Alert.alert(
    '위치 저장',
    '현재 위치로 저장하겠습니까?',
    [
      {
        text: '네',
        onPress: () => {
          Alert.alert('저장되었습니다.')
          /* DB에 now_lat, now_long 저장 */
          /* OK 누르면 메인 화면으로 전환*/
        }
      },
      {
        text: '아니요',
        onPress: () => {
          Alert.alert('다시 설정해주세요.')
        }
      }
    ],
    {
      cancelable: true,
      onDismiss: () => {},
    },
  );
};

const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center'
  },
  map: {
    width: '100%',
    height: '81%'
  },
  headerStyle: {
    height: StatusBarHeight,
  },
  button_yellow: {
    width: 80,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffce57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_white: {
    width: 80,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#ffce57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffce57',
    paddingBottom: 5,
  },
  locate: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
  },
  bottom: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  }
});

export default MapScreen;