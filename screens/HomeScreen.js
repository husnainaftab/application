import React, { useContext, useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { getSavedReports } from "../api/savedReports";
import { AuthenticatedUserContext } from "../providers";

const Item = ({ item }) => {
	return (
		<View style={styles.item}>
			<Image
				source={{
					uri: item.image,
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
					{item.firstName} {item.lastName} ( {item.gender} )
				</Text>
				<Text>Level : {item.predictionLevel}</Text>
			</View>
		</View>
	);
};

export const HomeScreen = () => {
	const { user } = useContext(AuthenticatedUserContext);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getSavedReports(user)
			.then((d) => {
				setData(d);
				console.log(d);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator />
			</View>
		);
	}

	const renderItem = (item) => <Item {...item} />;

	return (
		// <ScrollView style={styles.scrollView}>
		<FlatList
			data={data}
			renderItem={renderItem}
			keyExtractor={(item) => item.id || Math.random() * 10000000000}
			style={{
				paddingTop: 4,
			}}
		/>
		// </ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	item: {
		flexDirection: "row",
		backgroundColor: "white",
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 8,
		// justifyContent: "space-between",
	},
	itemTitleDesc: {
		paddingLeft: 10,
	},
});
