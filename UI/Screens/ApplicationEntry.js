import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HeaderImage, headerStyles} from "../Components/Header";
import {Teachers} from "./Teachers";
import {Classroom} from "./Classroom";
import {Subjects} from "./Subjects";
import Main from "./Home";
import {ReloadButton} from "../Components/ReloadButton";
import {useDispatch} from "react-redux";
import Timetable from "./Timetable";
import StudentPortal from "./StudentPortal";
import LoginScreen from "./Login";
import {useFonts} from "expo-font";

const Stack = createNativeStackNavigator();

export default function ApplicationEntry() {
  const [fontLoaded] = useFonts({
    'pilow': require("../../assets/Fonts/Pilowlava-Regular.otf")
  })
  const StateDispatcher = useDispatch();
  return (
      <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerRight: () => <HeaderImage/>,
            headerTitleStyle: [{fontFamily: 'pilow'}, headerStyles.title],
            animation: "slide_from_right",
          }}
      >
        <Stack.Screen
            name="Home"
            component={Main}
            options={{
              headerLeft: () => <></>,
              headerRight: () => <ReloadButton StateDispatcher={StateDispatcher}/>,
            }}
        />
        <Stack.Screen name="Teachers" component={Teachers}/>
        <Stack.Screen name="Classrooms" component={Classroom}/>
        <Stack.Screen name="Subjects" component={Subjects}/>
        <Stack.Screen name={"Timetable"} component={Timetable}/>
        <Stack.Screen name={"Portal"} component={StudentPortal}/>
        <Stack.Screen name={"Login"} component={LoginScreen}/>
      </Stack.Navigator>
  );
}
