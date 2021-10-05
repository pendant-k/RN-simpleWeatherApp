import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { Fontisto } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

// 원칙적으로 API KEY는 application에 위치하면 안됨.
const API_KEY = "64489df3908f930142d910384a877a56";

// const icons = {
//     Clouds: "cloudy",
// };

export default () => {
    // state 저장
    const [City, setCity] = useState("loading..");
    // daily 날씨 state 저장
    const [days, setDays] = useState([]);
    // permission 상태
    const [ok, setOk] = useState(true);
    // 날씨 정보 api에서 가져오는 async 함수
    const getWeather = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
        }
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({
            accuracy: 5,
        });
        const [{ city }] = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            { useGoogleMaps: false }
        );
        // location 정보를 받아서 useState를 활용해 City 변수에 저장한다.
        setCity(city);

        // weather info를 받아온다.
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
        );
        const json = await response.json();
        setDays(json.daily);
    };
    useEffect(() => {
        getWeather();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{City}</Text>
            </View>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weather}
            >
                {days.length == 0 ? (
                    <View style={styles.day}>
                        <ActivityIndicator
                            color="white"
                            size="large"
                            style={{ marginTop: 10 }}
                        />
                    </View>
                ) : (
                    // 모든 day 데이터 마다 뷰 만들기
                    days.map((day, index) => (
                        // list items -> unique key 값 가져야함
                        <View key={index} style={styles.day}>
                            <Text style={styles.temp}>
                                {parseFloat(day.temp.day).toFixed(1)}
                            </Text>
                            <Text style={styles.description}>
                                {day.weather[0].main}
                            </Text>
                            <Text style={styles.detail}>
                                {day.weather[0].description}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "tomato",
    },
    city: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    cityName: {
        fontSize: 68,
        fontWeight: "500",
    },
    weather: {},
    day: {
        width: WIDTH,
        alignItems: "center",
    },
    temp: {
        marginTop: 50,
        fontSize: 150,
    },
    description: {
        marginTop: -20,
        fontSize: 60,
    },
    detail: { fontSize: 20 },
});
