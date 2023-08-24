import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import {
  GetClassNames,
  GetClassRooms,
  GetDataSyncDate,
  GetSubjectNames,
  GetTeacherNames,
  GetTimeSlots,
  GetUsers,
} from "./SQLiteSearchFunctions";
import { setTeacherNames } from "../Redux/TeacherSlice";
import { setClassRoom } from "../Redux/ClassRoomSlice";
import { setSubjectNames } from "../Redux/SubjectSlice";
import { setTimeslot } from "../Redux/TimeslotSlice";
import {
  createDataSyncDateTable,
  createUserCredentialsTable,
  createTimetableDataTable,
  insertOrUpdateTimetableData,
  insertOrUpdateDataSyncDate,
} from "./SQLiteFunctions";
import { shouldReloadData } from "./Helpers";
import { setClassNames } from "../Redux/SectionSlice";
import { setRegistration } from "../Redux/StudentCredentialsSlice";
import { setFreeslots } from "../Redux/FreeslotsSlice";
import { RemoveLabData } from "../UI/Functions/UIHelpers";

const Timetable_API_URL = "https://timetable-scrapper.onrender.com/timetable";
const FreeSlots_API_URL = "https://timetable-scrapper.onrender.com/freeslots";

async function FetchTimetableDataFromMongoDB() {
  try {
    const res = await axios.get(Timetable_API_URL);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function FetchFreeslotsDataFromMongoDB(
  StateDispatcher,
  setLoadingText,
  FreeSlotsAvailable
) {
  if (setLoadingText === undefined) {
    setLoadingText = (text) => {};
  }
  try {
    if (FreeSlotsAvailable) {
      setLoadingText("FreeSlots up-to-date!");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
    setLoadingText("Fetching freeslots ...");
    const res = await axios.get(FreeSlots_API_URL);
    const freeslots = RemoveLabData(res.data);
    setLoadingText("Updating Freeslots ...");
    StateDispatcher(setFreeslots(freeslots));
    setLoadingText("Updated Freeslots✅");
  } catch (e) {
    setLoadingText("Error Occurred ⛔");
    alert(
      "Error Occurred while fetching freeslots from server ⛔\n Please check your internet connection"
    );
  }
}

async function PopulateGlobalState(
  setLoadingText,
  StateDispatcher,
  FreeSlotsAvailable
) {
  if (FreeSlotsAvailable === undefined) {
    FreeSlotsAvailable = false;
  }
  try {
    await createDataSyncDateTable();
    await createTimetableDataTable();
    await createUserCredentialsTable();
    const DataSyncDate = await GetDataSyncDate();
    const shouldReload = shouldReloadData(DataSyncDate);
    if (!shouldReload) {
      await FetchDataFromSQLite(setLoadingText, StateDispatcher, "Local Cache");
      await FetchFreeslotsDataFromMongoDB(
        StateDispatcher,
        setLoadingText,
        FreeSlotsAvailable
      );
      return;
    }
    const isConnected = (await NetInfo.fetch()).isInternetReachable;
    if (!isConnected) {
      setLoadingText("No Internet Connection😢");
      await FetchDataFromSQLite(setLoadingText, StateDispatcher, "Local Cache");
      return;
    }
    setTimeout(() => {
      setLoadingText("Hold On ...");
    }, 4000);
    setTimeout(() => {
      setLoadingText("Request is being processed ...");
    }, 10000);
    setTimeout(() => {
      setLoadingText("Just a moment ...");
    }, 15000);
    setLoadingText("Fetching Data ...");
    const data = await FetchTimetableDataFromMongoDB();
    for (const element of data) {
      await insertOrUpdateTimetableData(element);
    }
    await insertOrUpdateDataSyncDate(new Date().toJSON());
    await FetchDataFromSQLite(setLoadingText, StateDispatcher, "Remote Server");
    await FetchFreeslotsDataFromMongoDB(StateDispatcher, setLoadingText);
  } catch (error) {
    console.error(error);
    setLoadingText("Error Occurred⛔");
    throw error;
  }
}

async function UpdateUserCredentialsState(StateDispatcher, setLoadingText) {
  try {
    let users = await GetUsers();
    if (users.length === 0) {
      setLoadingText
        ? setLoadingText("Getting some things Ready...Users❌")
        : null;
      StateDispatcher(setRegistration([{ label: "null", image: "null" }]));
      return;
    }
    setLoadingText
      ? setLoadingText("Getting some things Ready...Users✅")
      : null;
    let usernames = [];

    for (let i = 0; i < users.length; i++) {
      let singleUserModel = {
        label: users[i].label,
        image: users[i].image,
      };
      usernames.push(singleUserModel);
    }
    StateDispatcher(setRegistration(usernames));
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}

async function FetchDataFromSQLite(setLoadingText, StateDispatcher, Mode) {
  try {
    setLoadingText("Getting some things Ready...");

    const classRooms = await GetClassRooms();
    StateDispatcher(setClassRoom(classRooms));
    setLoadingText("Getting some things Ready...Classrooms✅");

    const timeSlots = await GetTimeSlots();
    StateDispatcher(setTimeslot(timeSlots));
    setLoadingText("Getting some things Ready...Timeslots✅");

    const teacherNames = await GetTeacherNames();
    StateDispatcher(setTeacherNames(teacherNames));
    setLoadingText("Getting some things Ready...Teachers✅");

    const subjectNames = await GetSubjectNames();
    StateDispatcher(setSubjectNames(subjectNames));
    setLoadingText("Getting some things Ready...Subjects✅");

    const sectionNames = await GetClassNames();
    StateDispatcher(setClassNames(sectionNames));
    setLoadingText("Getting some things Ready...Sections✅");

    await UpdateUserCredentialsState(StateDispatcher, setLoadingText);

    setLoadingText(`Data Updated from ${Mode}`);
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}

export {
  PopulateGlobalState,
  FetchDataFromSQLite,
  UpdateUserCredentialsState,
  FetchFreeslotsDataFromMongoDB,
};
