import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { signOut } from "firebase/auth";
import * as React from "react";
import { auth } from "../config";
import { HomeScreen } from "../screens";
import { TestCasesScreen } from "../screens/TestCases";
import { UploadScreen } from "../screens/UploadScreen";
import { UserDetailsScreen } from "../screens/UserDetailsForm";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
	const handleLogout = () => {
		signOut(auth).catch((error) => console.log("Error logging out: ", error));
	};
	return (
		<DrawerContentScrollView {...props}>
			<DrawerItemList {...props} />
			<DrawerItem label="Log out" onPress={handleLogout} />
		</DrawerContentScrollView>
	);
}

export const AppStack = () => {
	return (
		<Drawer.Navigator
			initialRouteName="Saved Results"
			drawerContent={(props) => <CustomDrawerContent {...props} />}
		>
			<Drawer.Screen name="Saved Results" component={HomeScreen} />
			<Drawer.Screen name="Upload" component={UploadScreen} />
			<Drawer.Screen name="Test Cases" component={TestCasesScreen} />
			<Drawer.Screen
				name="User Details"
				component={UserDetailsScreen}
				options={{
					drawerItemStyle: { display: "none" },
				}}
			/>
		</Drawer.Navigator>
		// <Stack.Navigator>
		//   <Stack.Screen name='Home' component={HomeScreen} />
		// </Stack.Navigator>
	);
};
