import { CommonActions } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Image, Picker, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { setSavedReport } from "../api/savedReports";
import { Button, FormErrorMessage, TextInput } from "../components";
import { Colors } from "../config";
import { AuthenticatedUserContext } from "../providers";
import { userFormValidationSchema } from "../utils";

export const UserDetailsScreen = ({ route, navigation }) => {
	const params = route.params;
	const { user } = useContext(AuthenticatedUserContext);
	const [errorState, setErrorState] = useState("");

	useEffect(() => {
		console.log(params);
		if (!params.image) {
			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: "Upload" }],
				})
			);
		}
	}, []);

	const onSubmit = (values) => {
		setSavedReport(user, {
			...values,
			image: params.image,
			predictionLevel: params.predictionLevel,
		}).then(() => {
			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: "Saved Results" }],
				})
			);
		});
	};

	return (
		<View isSafe style={styles.container}>
			<KeyboardAwareScrollView enableOnAndroid={true}>
				{params ? (
					<Image
						source={{
							uri: params.image,
						}}
						style={{
							height: 300,
						}}
					/>
				) : undefined}

				<Text
					style={{
						paddingTop: 15,
						fontSize: 24,
						paddingBottom: 15,
					}}
				>
					Predicted Level : {params.predictionLevel}
				</Text>

				<Formik
					initialValues={{
						firstName: "",
						lastName: "",
						gender: "male",
					}}
					validationSchema={userFormValidationSchema}
					onSubmit={onSubmit}
				>
					{({
						values,
						touched,
						errors,
						handleChange,
						handleSubmit,
						handleBlur,
					}) => (
						<>
							<Text>First Name:</Text>

							{/* Input fields */}
							<TextInput
								name="firstName"
								placeholder="Enter First Name"
								autoCapitalize="words"
								autoFocus={true}
								value={values.firstName}
								onChangeText={handleChange("firstName")}
								onBlur={handleBlur("firstName")}
							/>

							<FormErrorMessage
								error={errors.firstName}
								visible={touched.firstName}
							/>
							<Text>Last Name:</Text>

							<TextInput
								name="lastName"
								placeholder="Enter Last Name"
								autoCapitalize="words"
								value={values.lastName}
								onChangeText={handleChange("lastName")}
								onBlur={handleBlur("lastName")}
							/>
							<FormErrorMessage
								error={errors.lastName}
								visible={touched.lastName}
							/>
							<Text>Gender:</Text>
							<Picker
								name="gender"
								selectedValue={values.gender}
								onValueChange={handleChange("gender")}
							>
								<Picker.Item label="Male" value="male" />
								<Picker.Item label="Female" value="female" />
							</Picker>

							{console.log(errors)}

							{/* Display Screen Error Mesages */}
							{errorState !== "" ? (
								<FormErrorMessage error={errorState} visible={true} />
							) : null}
							{/* Login button */}
							<Button style={styles.button} onPress={handleSubmit}>
								<Text style={styles.buttonText}>Save</Text>
							</Button>
						</>
					)}
				</Formik>
				{/* Button to navigate to SignupScreen to create a new account */}

				<Button
					style={styles.borderlessButtonContainer}
					borderless
					title={"Back"}
					onPress={() => navigation.navigate("Upload")}
				/>
			</KeyboardAwareScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
		paddingHorizontal: 12,
	},
	screenTitleContainer: {
		alignItems: "center",
	},
	screenTitle: {
		fontSize: 32,
		fontWeight: "300",
		color: Colors.black,
		paddingTop: 50,
		paddingBottom: 50,
	},
	button: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
		backgroundColor: Colors.orange,
		padding: 10,
		borderRadius: 8,
	},
	buttonText: {
		fontSize: 20,
		color: Colors.white,
		fontWeight: "700",
	},
	borderlessButtonContainer: {
		marginTop: 16,
		alignItems: "center",
		justifyContent: "center",
	},
});
