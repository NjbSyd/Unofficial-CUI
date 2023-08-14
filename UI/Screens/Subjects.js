import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { List } from "../Components/List";
import { GetSubjectsSchedule } from "../../BackEnd/SQLiteSearchFunctions";
import NoResults from "../Components/NoResults";
import { useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import BannerAds from "../../Ads/BannerAd";

export function Subjects() {
  const subjectNames = useSelector((state) => state.SubjectSlice.subject);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubjectData, setSelectedSubjectData] = useState([]);
  const dropdownRef = useRef(null);

  const openDropDown = () => {
    setTimeout(() => {
      dropdownRef.current.open();
    }, 100);
  };
  return (
    <View style={styles.container}>
      {selectedSubject !== null ? (
        <TouchableOpacity
          style={styles.slotSelectorPlaceholder}
          onPress={() => {
            setSelectedSubject(null);
            setSelectedSubjectData([]);
            openDropDown();
          }}
        >
          <Text style={styles.selectedClassText}>
            Teachers for: {"\n" + selectedSubject.label}
          </Text>
          <FontAwesome5 name="edit" size={15} color="#4a6cef" />
        </TouchableOpacity>
      ) : (
        <Dropdown
          ref={dropdownRef}
          style={styles.slotSelector}
          inputSearchStyle={styles.slotSearch}
          containerStyle={styles.slotOptionsContainer}
          keyboardAvoiding={true}
          data={subjectNames}
          labelField="label"
          valueField="value"
          onChange={(item) => {
            setSelectedSubject(item);
            GetSubjectsSchedule(item.value).then((res) => {
              setSelectedSubjectData(res);
            });
          }}
          placeholder={"Select a Subject"}
          value={selectedSubject}
          search={true}
          searchPlaceholder="Enter a Subject name to search"
          autoScroll={false}
        />
      )}
      <ScrollView style={styles.scrollView}>
        {selectedSubjectData.length === 0 ? (
          <NoResults />
        ) : (
          <List data={selectedSubjectData} type={"Subject"} />
        )}
      </ScrollView>
      <BannerAds />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
  },
  scrollView: {
    width: "90%",
    margin: 20,
    maxHeight: "80%",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    alignSelf: "flex-start",
    marginLeft: "6%",
  },
  slotSelector: {
    width: "95%",
    padding: 10,
    marginTop: 10,
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
  },
  slotOptionsContainer: {
    borderColor: "#000",
    borderWidth: 0.3,
    borderRadius: 5,
  },
  slotSearch: {
    backgroundColor: "#000",
    color: "#fff",
    letterSpacing: 1,
    borderRadius: 5,
    height: 60,
  },
  slotSelectorPlaceholder: {
    marginVertical: 10,
    marginHorizontal: 20,
    width: "auto",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#4a6cef",
    borderStyle: "dashed",
  },
  selectedClassText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 1,
    marginRight: 20,
  },
});
