import axios from "axios";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Button,
	FlatList,
	Image,
	Modal,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { server } from "../config/server";

const data = [
	"level0-10_left.jpeg",
	"level0-10_right.jpeg",
	"level0-13_left.jpeg",
	"level0-13_right.jpeg",
	"level0-17_left.jpeg",
	"level1-114_left.jpeg",
	"level1-15_left.jpeg",
	"level1-17_right.jpeg",
	"level1-30_left.jpeg",
	"level1-36_left.jpeg",
	"level2-15_right.jpeg",
	"level2-30_right.jpeg",
	"level2-40_left.jpeg",
	"level2-51_left.jpeg",
	"level2-54_left.jpeg",
	"level3-163_left.jpeg",
	"level3-163_right.jpeg",
	"level3-328_right.jpeg",
	"level3-99_left.jpeg",
	"level3-99_right.jpeg",
	"level4-16_left.jpeg",
	"level4-16_right.jpeg",
	"level4-217_left.jpeg",
	"level4-217_right.jpeg",
	"level4-294_left.jpeg",
]
	.reverse()
	.map((el, i) => ({
		id: el,
		title: el,
		img: server.IMAGE_BASE_URL + "test-cases/" + el,
		level: el[5],
	}));

const Item = ({ title, img, level }) => {
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [prediction, setPrediction] = useState();
	return (
		<View style={styles.item} key={title}>
			<Image
				source={{
					uri: img,
				}}
				style={{ width: 60, height: 60 }}
			/>
			<View style={styles.itemTitleDesc}>
				<Text
					style={{
						fontSize: 16,
						fontWeight: "bold",
					}}
				>
					{title}
				</Text>
				<Text>Level : {level}</Text>
			</View>
			<Button
				title={"Run"}
				loading={true}
				onPress={async () => {
					setLoading(true);
					setVisible(true);
					await axios
						.post(server.ENDPOINT + server.GET_RESULTS, {
							image_path: img,
						})
						.then((res) => res.data)
						.then((prediction) => {
							setPrediction(prediction);
						})
						.catch((e) => {
							console.log(e);
							Alert.alert("Failed to get results", "", [
								{ text: "OK", onPress: () => console.log("OK Pressed") },
							]);
						})
						.finally(() => {
							setLoading(false);
						});
				}}
			/>
			<Modal visible={visible}>
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{loading ? (
						<ActivityIndicator color="black" />
					) : (
						<View>
							<Text style={{ fontSize: 18 }}>
								Prediction from server: {prediction}
							</Text>
							<Text style={{ fontSize: 18 }}>Actual Prediction: {level}</Text>

							<View
								style={{
									flexDirection: "row",
									backgroundColor: +prediction === +level ? "green" : "red",
									padding: 20,
									borderRadius: 10,
									marginTop: 30,
									alignContent: "center",
									justifyContent: "center",
								}}
							>
								<Text
									style={{
										color: "white",
										fontSize: 24,
										fontWeight: "bold",
									}}
								>
									{+prediction === +level ? "Success" : "Failed"}
								</Text>
							</View>

							<View
								style={{
									paddingTop: 30,
								}}
							>
								<Button
									title="Close"
									style={{}}
									onPress={() => setVisible(false)}
								/>
							</View>
						</View>
					)}
				</View>
			</Modal>
		</View>
	);
};

export const TestCasesScreen = () => {
	const renderItem = ({ item }) => (
		<Item
			title={item.title}
			key={item.title}
			level={item.level}
			img={item.img}
		/>
	);
	return (
		// <ScrollView style={styles.scrollView}>
		<FlatList
			data={data}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
		/>
		// </ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: StatusBar.currentHeight,
	},
	scrollView: {
		marginHorizontal: 10,
	},

	item: {
		flexDirection: "row",
		backgroundColor: "white",
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 8,
		justifyContent: "space-between",
	},
	itemTitleDesc: {
		paddingLeft: 10,
	},
});
