import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Button,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { server } from "../config/server";

export const UploadScreen = ({ navigation }) => {
	const [activityDescription, setActivityDescription] = useState("");
	useEffect(() => {
		(async () => {
			if (Constants.platform.ios) {
				const cameraRollStatus =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (cameraRollStatus.status !== "granted") {
					alert("Sorry, we need these permissions to make this work!");
				}
			}
		})();
	}, []);

	const pickImage = async () => {
		setActivityDescription("");

		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});
		if (!result.cancelled) {
			try {
				setActivityDescription("Fetching server");
				let { name: awsImage, url: signedUrl } = await axios
					.get(server.ENDPOINT + server.GET_SIGNED_URL_PATH)
					.then((res) => res.data);
				const img = await fetchImageFromUri(result.uri);
				setActivityDescription("Uploading image");
				await fetch(signedUrl, {
					method: "PUT",
					body: img,
				});
				console.log(awsImage);
				setActivityDescription("Fetching Results");
				let predicion = await axios
					.post(server.ENDPOINT + server.GET_RESULTS, {
						image_path: server.IMAGE_BASE_URL + awsImage,
					})
					.then((res) => res.data);
				console.log(predicion);

				navigation.dispatch(
					CommonActions.reset({
						index: 0,
						routes: [
							{
								name: "User Details",
								params: {
									predictionLevel: predicion,
									image: server.IMAGE_BASE_URL + awsImage,
								},
							},
						],
					})
				);
			} catch (e) {
				console.log(e);
				Alert.alert("Failed to get results", "", [
					{ text: "OK", onPress: () => console.log("OK Pressed") },
				]);
			}
		}
		setActivityDescription("");
	};
	const fetchImageFromUri = async (uri) => {
		const response = await fetch(uri);
		const blob = await response.blob();
		return blob;
	};

	return (
		<View style={styles.container}>
			{activityDescription ? (
				<View>
					<ActivityIndicator size="large" />
					<Text>{activityDescription}</Text>
				</View>
			) : (
				<Button title="Upload" onPress={pickImage} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
