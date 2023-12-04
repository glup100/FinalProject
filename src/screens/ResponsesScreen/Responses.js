import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Appbar, Menu, Provider, Card, Avatar} from 'react-native-paper';
import React, {useState, useEffect} from 'react';
import {auth, db} from '../../../firebase';
import CustomButton from '../../components/CustomButtons/CustomButton';

const Responses = ({route}) => {
  //to get the current eventid
  const eventid = route.params;
  //console.log(eventid);

  const [AbsentUserData, setAbsentUserData] = useState([]);
  const [AttendingUserData, setAttendingUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const targetEventId = eventid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceCollection = db.collection('Attendance');
        const snapshot = await attendanceCollection.get();

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredItems = data.filter(
          item => item.event_id === targetEventId,
        );
        setFilteredData(filteredItems);

        if (filteredItems.length > 0) {
          const attenidng = 'confirmed';
          const absent = 'absent';

          const filterAttending = filteredItems.filter(
            item => item.attendanceStatus === attenidng,
          );
          const filterAbsent = filteredItems.filter(
            item => item.attendanceStatus === absent,
          );

          setAttendingUserData(filterAttending);
          setAbsentUserData(filterAbsent);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // Attach a listener to the attendance collection to listen for updates
    const unsubscribe = db.collection('Attendance').onSnapshot(snapshot => {
      const updatedData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const updatedFilteredItems = updatedData.filter(
        item => item.event_id === targetEventId,
      );
      setFilteredData(updatedFilteredItems);

      if (updatedFilteredItems.length > 0) {
        const attenidng = 'confirmed';
        const absent = 'absent';

        const updatedAttending = updatedFilteredItems.filter(
          item => item.attendanceStatus === attenidng,
        );
        const updatedAbsent = updatedFilteredItems.filter(
          item => item.attendanceStatus === absent,
        );

        setAttendingUserData(updatedAttending);
        setAbsentUserData(updatedAbsent);
      }
    });

    // Return a cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [targetEventId]);

  // console.log('FilteredData', filteredData);
  // console.log('AttendingUserData', AttendingUserData);
  // console.log('AbsentUserData', AbsentUserData);

  const [UserData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCollection = db.collection('Users');
        const snapshot = await userCollection.get();

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  //console.log("USERDATA", UserData);

  const navigation = useNavigation();

  const handleHome = () => {
    navigation.navigate('Home');
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('SignIn');
      })
      .catch(error => alert(error.message));
  };

  const handleResponses = () => {
    navigation.navigate('Responses');
  };

  const [showButtons, setShowButtons] = useState(false);

  const handleEditButtonClick = () => {
    setShowButtons(!showButtons);
  };

  const handleAttendance = (eventid, confrimedAttendance) => {
    const username = auth.currentUser?.email;

    if (username) {
      // Find the document with the matching username
      db.collection('Attendance')
        .where('username', '==', username)
        .where('event_id', '==', eventid)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;

            // Update the attendanceStatus field
            docRef
              .update({attendanceStatus: confrimedAttendance})
              .then(() => {
                console.log('Document successfully updated!');
              })
              .catch(error => {
                console.error('Error updating document: ', error);
              });
          } else {
            console.log('No matching document found.');
          }
        })
        .catch(error => {
          console.error('Error querying document: ', error);
        });
    } else {
      console.log('User not signed in.');
    }
  };

  const handleAbsence = (eventid, confrimedAbsence) => {
    const username = auth.currentUser?.email;

    if (username) {
      // Find the document with the matching username
      db.collection('Attendance')
        .where('username', '==', username)
        .where('event_id', '==', eventid)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;

            // Update the attendanceStatus field
            docRef
              .update({attendanceStatus: confrimedAbsence})
              .then(() => {
                console.log('Document successfully updated!');
              })
              .catch(error => {
                console.error('Error updating document: ', error);
              });
          } else {
            console.log('No matching document found.');
          }
        })
        .catch(error => {
          console.error('Error querying document: ', error);
        });
    } else {
      console.log('User not signed in.');
    }
  };

  //for the appbar
  // Declare a state variable to track the visibility of the menu
  const [isMenuVisible, setMenuVisible] = useState(false);

  // Function to handle menu item selection
  const handleMenuPress = () => setMenuVisible(true);

  // Function to handle menu dismissal
  const handleMenuDismiss = () => setMenuVisible(false);

  const confrimedAttendance = 'confirmed';
  const confrimedAbsence = 'absent';

  //for the flatlist

  headerComponent1 = () => {
    return (
      <Text style={styles.listHeader}>
        Attending ({AttendingUserData.length})
      </Text>
    );
  };

  headerComponent2 = () => {
    return (
      <Text style={styles.listHeader}>Absentees ({AbsentUserData.length})</Text>
    );
  };

  itemSeparator = () => {
    return (
      <View style={styles.separatorContainer}>
        <View style={styles.separator}></View>
      </View>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
      <Appbar.Header style={styles.header}>

       <View style={styles.titleContainer}>
         <Text style={styles.title}>
           See Who's Going                
         </Text>
       </View> 


        <View style={styles.menuContainer}>
          <Menu
            visible={isMenuVisible}
            onDismiss={handleMenuDismiss}
            anchor={<CustomButton text="☰" type="MENU"  onPress={handleMenuPress} />}
>
          <Menu.Item onPress={handleHome} title="Home" />
          {/* <Menu.Item onPress={handleResponses} title="Responses" /> */}
          <Menu.Item onPress={handleSignOut} title="Sign Out" />
          </Menu>
         </View>
       </Appbar.Header>

        <View>
          <FlatList
            ListHeaderComponentStyle={styles.listHeader}
            ListHeaderComponent={headerComponent1}
            data={AttendingUserData.map(item => ({key: item.username}))}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <Avatar.Text label="✔️" backgroundColor="#FFFFFF" size={50} />
                <Text style={styles.item}>{item.key}</Text>
              </View>
            )}
            ItemSeparatorComponent={itemSeparator}
            ListEmptyComponent={
              <Text style={styles.item}>
                Be the first to say they're going!
              </Text>
            }
          />
        </View>

        <View>
          <FlatList
            ListHeaderComponentStyle={styles.listHeader}
            ListHeaderComponent={headerComponent2}
            data={AbsentUserData.map(item => ({key: item.username}))}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <Avatar.Text label="❌" backgroundColor="#FFFFFF" size={50} />
                <Text style={styles.item}>{item.key}</Text>
              </View>
            )}
            ItemSeparatorComponent={itemSeparator}
            ListEmptyComponent={<Text style={styles.item}>No Absentees!</Text>}
          />
        </View>

        <View style={styles.buttonView}>
          <CustomButton
            text="Edit your response"
            onPress={handleEditButtonClick}
            type="PRIMARY"
          />
        </View>

        {showButtons && (
          <React.Fragment>
            <View style={styles.buttonContainer}>
              <CustomButton
                text="Confirm Attendance"
                onPress={() => handleAttendance(eventid, confrimedAttendance)}
                type="SECONDARY"
              />
              <CustomButton
                text="Confirm Absence"
                onPress={() => handleAbsence(eventid, confrimedAbsence)}
                type="TERTIARY"
              />
            </View>
          </React.Fragment>
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  item: {
    padding: 10,
    fontSize: 20,
    height: 50,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#DFF9FF',
    borderBottomWidth: 2,
    borderColor: '#BCE6F0',
  },
  buttonContainer: {
    flexDirection: 'row', // Display children side by side
    justifyContent: 'space-between', // Add space between the buttons
    paddingHorizontal: 20, // Add horizontal padding for better spacing
    paddingTop: 10,
    paddingBottom: 10,
  },

  buttonView: {
    flexDirection: 'column', // Change flexDirection to 'column'
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    paddingHorizontal: 20, // Add horizontal padding for better spacing
    paddingBottom: 10,
    paddingTop: 30,
  },
  listHeader: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  separator: {
    height: 2,
    width: '80%',
    backgroundColor: '#ACACAC',
  },
  separatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row', // Arrange avatar and text horizontally
    alignItems: 'center', 
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 16,
  },
});
export default Responses;
