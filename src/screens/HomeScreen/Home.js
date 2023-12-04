import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButtons/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {auth, db} from '../../../firebase';
import {Agenda} from 'react-native-calendars';
import {Avatar, Card} from 'react-native-paper';
import {Appbar, Menu, Provider} from 'react-native-paper';
import React, {useState, useEffect} from 'react';
import MatchCard from '../../components/MatchCard';
import TrainingCard from '../../components/TrainingCard';
import firestore from '@react-native-firebase/firestore';
import {addDays, startOfMonth} from 'date-fns';
import {FontAwesomeIcon} from 'react-native-vector-icons/FontAwesome';

//for the calendar
const timeToString = time => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

//to return event data
const fetchMatch = () => {
  const userRef = db.collection('Events');

  // Return a Promise to be able to use async/await outside the function
  return new Promise((resolve, reject) => {
    // Attach a snapshot listener to the collection
    const unsubscribe = userRef.onSnapshot(
      querySnapshot => {
        const usersData = [];
        querySnapshot.forEach(doc => {
          usersData.push(doc.data());
        });
        resolve(usersData); // Resolve the Promise with updated data
      },
      error => {
        reject(error); // Reject the Promise if there's an error
      },
    );
  });
};

//to return current user data
const fetchCurrentUser = async () => {
  const userRef = db.collection('Users');
  const querySnapshot = await userRef.get();

  const usersData = [];
  querySnapshot.forEach(doc => {
    usersData.push(doc.data());
  });
  return usersData;
};

const Home = () => {
  //for the appbar
  // Declare a state variable to track the visibility of the menu
  const [isMenuVisible, setMenuVisible] = useState(false);

  // Function to handle menu item selection
  const handleMenuPress = () => setMenuVisible(true);

  // Function to handle menu dismissal
  const handleMenuDismiss = () => setMenuVisible(false);

  const navigation = useNavigation();

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

  const handleHome = () => {
    navigation.navigate('Home');
  };

  //setting the 'items' ideally want to retrieve events from the firestore
  const [items, setItems] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the authenticated user's email
        const userEmail = auth.currentUser?.email;
        const allUsers = await fetchCurrentUser();
        setData(allUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const currentUserAccessCode = data.find(
        item => item.user_email === auth.currentUser?.email,
      )?.access_code;

      // Assuming fetchMatch is defined
      const fetchData = async () => {
        try {
          const allUsersData = await fetchMatch();
          //  console.log("ALLUSERSDATA ln108", allUsersData);

          // Assuming 'arrival_time' and 'start_time' are Firebase Timestamp objects
          const updatedItems = allUsersData.reduce((acc, curr) => {
            const {arrival_time, start_time, venue, type, access_code} = curr;

            // Arrival time date and time
            const dateKey = arrival_time.toDate().toISOString().slice(0, 10);
            const arrive = arrival_time.toDate().toISOString().slice(11, 16);

            // Throw-In date and time
            const startTime = start_time.toDate().toISOString().slice(11, 16);

            if (currentUserAccessCode === access_code) {
              if (acc[dateKey]) {
                acc[dateKey].push({
                  dateKey,
                  arrive,
                  venue,
                  startTime,
                  type,
                  access_code,
                });
              } else {
                acc[dateKey] = [
                  {dateKey, arrive, venue, startTime, type, access_code},
                ];
              }
            }

            return acc;
          }, {});

          const currentDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30);

          const hardcodedItems = {};
          for (
            let date = currentDate;
            date <= endDate;
            date.setDate(date.getDate() + 1)
          ) {
            const dateKey = date.toISOString().slice(0, 10);
            const arrive = '18:00';
            const startTime = '17:45';
            const access_code = '12345';
            const type = 'null';
            const venue = 'Rossa P';
            const opponent = '';

            const item = {access_code, arrive, type};
            hardcodedItems[dateKey] = [];
          }
          const mergedItems = allUsersData.reduce((acc, curr) => {
            const {
              opponent,
              arrival_time,
              start_time,
              venue,
              type,
              access_code,
            } = curr;
            const dateKey = arrival_time.toDate().toISOString().slice(0, 10);
            const arrive = arrival_time.toDate().toISOString().slice(11, 16);
            const startTime = start_time.toDate().toISOString().slice(11, 16);

            if (currentUserAccessCode === access_code) {
              if (acc[dateKey]) {
                acc[dateKey].push({
                  opponent,
                  dateKey,
                  arrive,
                  venue,
                  startTime,
                  type,
                  access_code,
                });
              } else {
                acc[dateKey] = [
                  {
                    opponent,
                    dateKey,
                    arrive,
                    venue,
                    startTime,
                    type,
                    access_code,
                  },
                ];
              }
            }
            return acc;
          }, hardcodedItems);

          //change to merged
          setItems(mergedItems);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [data]);

  const renderItem = (item, currentUserAccessCode) => {
    if (item.type === 'match' && item.arrive.length > 0) {
      return (
        <MatchCard
          onPress={() => {
            navigation.navigate('EventCard', {
              eventData: item,
            });
          }}
          item={item}
        />
      );
    } else {
      if (item.type === 'training') {
        return (
          <TrainingCard
            onPress={() => {
              navigation.navigate('EventCard', {
                eventData: item,
              });
            }}
            item={item}
          />
        );
      } else {
        if (item.type != 'match' && item.type != 'training') {
          return <Text>Nothing</Text>;
        }
      }
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        {/* App Bar */}
        <Appbar.Header style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>See Who's Going</Text>
          </View>

          <View style={styles.menuContainer}>
            <Menu
              visible={isMenuVisible}
              onDismiss={handleMenuDismiss}
              anchor={
                <CustomButton text="☰" type="MENU" onPress={handleMenuPress} />
              }>
              <Menu.Item onPress={handleHome} title="Home" />
              {/* <Menu.Item onPress={handleResponses} title="Responses" /> */}
              <Menu.Item onPress={handleSignOut} title="Sign Out" />
            </Menu>
          </View>
        </Appbar.Header>

        {/* This is the calendar */}
        <Agenda items={items} renderItem={renderItem} />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 30,
  },
  header: {
    backgroundColor: '#DFF9FF',
    borderBottomWidth: 2,
    borderColor: '#BCE6F0',
  },
  Logo: {
    width: '60%',
    maxWidth: 300,
    height: '60%',
    maxHeight: 200,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    flexShrink: 0,
  },
  trainingcard: {
    backgroundColor: '#BCE6F0',
    borderWidth: 1,
    borderColor: '#ADAFB5',
  },
  matchcard: {
    backgroundColor: '#6099EF',
    borderWidth: 1,
    borderColor: '#ADAFB5',
  },
  itemtype: {
    fontSize: 26,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  textContainer: {
    color: '#F3F0F0',
  },
});

export default Home;
