import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Appbar, Menu, Provider, Card} from 'react-native-paper';
import React, {useState, useEffect} from 'react';
import {auth, db} from '../../../firebase';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButtons/CustomButton';

const EventCard = ({route}) => {
  const accessCodeData = route.params;
  //console.log('accessCodeData', accessCodeData);

  const eventCardData = route.params.eventData;
  //console.log('eventCardData', eventCardData);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const targetUsername = auth.currentUser?.email;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceCollection = db.collection('Attendance');
        const snapshot = await attendanceCollection.get();

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAttendanceData(data);

        const filteredItems = data.filter(
          item => item.username === targetUsername,
        );
        setFilteredData(filteredItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // use effect for reading in event comments

  const [EventComments, setEventComments] = useState([]);

  useEffect(() => {
    const eventCommentsCollection = db.collection('EventComments');

    const unsubscribe = eventCommentsCollection.onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEventComments(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //console.log('EventComments', EventComments);

  const [comment, setComment] = useState('');

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

  const handleResponses = eventid => {
    navigation.navigate('Responses', eventid);
  };

  const handleAttendance = (eventid, confrimedAttendance) => {
    db.collection('Attendance')
      .add({
        event_id: eventid,
        username: auth.currentUser?.email,
        attendanceStatus: confrimedAttendance,
      })
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch(error => {
        console.error('Error updating document: ', error);
      });
  };

  const handleAbsence = (eventid, confrimedAbsence) => {
    db.collection('Attendance')
      .add({
        event_id: eventid,
        username: auth.currentUser?.email,
        attendanceStatus: confrimedAbsence,
      })
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch(error => {
        console.error('Error updating document: ', error);
      });
  };

  const handleCommentSubmit = (messageNumber, eventid) => {
    db.collection('EventComments')
      .add({
        event_id: eventid,
        username: auth.currentUser?.email,
        messageNumber: messageNumber,
        Comment: comment,
      })
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch(error => {
        console.error('Error updating document: ', error);
      });

    setComment('');
  };

  //for the appbar
  // Declare a state variable to track the visibility of the menu
  const [isMenuVisible, setMenuVisible] = useState(false);

  // Function to handle menu item selection
  const handleMenuPress = () => setMenuVisible(true);

  // Function to handle menu dismissal
  const handleMenuDismiss = () => setMenuVisible(false);

  const [matchInfo, setMatchInfo] = useState(null);

  useEffect(() => {
    // Reference to the Firestore collection
    const matchInfoRef = db.collection('Match_Info');

    // Attach a snapshot listener
    const unsubscribe = matchInfoRef.onSnapshot(snapshot => {
      // empty array to store event data
      const eventDataArray = [];

      // Loop through the snapshot
      snapshot.forEach(doc => {
        const eventData = doc.data();
        eventDataArray.push(eventData);
      });

      // Update the state
      setMatchInfo(eventDataArray);
    });

    // Unsubscribe from the listener
    return () => unsubscribe();
  }, []);

  if (matchInfo === null) {
    return <Text>Loading...</Text>;
  }

  if (eventCardData.type === 'match') {
    const selectedOpponent = eventCardData.opponent;
    const filteredMatch = matchInfo.find(
      match => match.opponent === selectedOpponent,
    );
    const eventid = filteredMatch.event_id;

    const teamList = filteredMatch.team.split(' '); // Splitting the team members into a list
    const updates = filteredMatch.updates;

    const teamWithNumbers = teamList.map((member, index) => ({
      player: `Player ${index + 1}`,
      name: member,
    }));

    
    const opponentToFind = accessCodeData.eventData.opponent;
    //console.log('opponentToFind', opponentToFind);
    const matchingDoc = matchInfo.find(doc => doc.opponent === opponentToFind);

    
    const event_idMatches = filteredData.some(
      item => item.event_id === matchingDoc.event_id,
    );

    //for teamsheet
    const showTeamSheet = eventCardData.type === 'match';

    //for the attendance buttons
    const confrimedAttendance = 'confirmed';
    const confrimedAbsence = 'absent';

    //for the comments section
    const targetEvent = matchingDoc.event_id;

   //console.log('targetEvent', targetEvent);

    const filteredComments = EventComments.filter(
      comment => comment.event_id === targetEvent,
    );

    // Sort filtered comments by comment_number
    const sortedComments = filteredComments.sort(
      (a, b) => parseInt(a.comment_number) - parseInt(b.comment_number),
    );

   // console.log('sortedComments', sortedComments);

    //the length tog et the mesage number
    const messageNumber = sortedComments.length + 1;

    //the beginning of the render
    return (
      <Provider>
        <ScrollView>
          <View style={styles.container}>
           <Appbar.Header style={styles.header}>

             <View style={styles.titleContainer}>
              <Text style={styles.title}>
              Event Information                 
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

            <Card>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>{eventCardData.type}</Text>
              </View>
              <Card.Content>
                <View style={styles.card}>
                  <Text>Arrival Time : {eventCardData.arrive}</Text>
                  <Text>Start Time : {eventCardData.startTime}</Text>
                  <Text>Venue : {eventCardData.venue}</Text>
                </View>
              </Card.Content>
            </Card>

            {!event_idMatches && (
              <React.Fragment>
                <View style={styles.buttonContainer}>
                  <CustomButton
                    text="Confirm Attendance"
                    onPress={() =>
                      handleAttendance(eventid, confrimedAttendance)
                    }
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

            <View style={styles.buttonView}>
              <CustomButton
                style={styles.root}
                text="See who's going ->"
                onPress={() => handleResponses(eventid)}
                type="PRIMARY"
              />
            </View>

            {showTeamSheet && (
              <React.Fragment>
                <Text style={styles.updatesTitle}>Team Sheet :</Text>
                {teamWithNumbers.map(({player, name}) => (
                  <Text style={styles.teamSheet} key={player}>
                    {player} - {name}
                  </Text>
                ))}
              </React.Fragment>
            )}

            {/* updates section */}
            <Text></Text>
            <Text style={styles.updatesTitle}>Session Updates :</Text>
            <Text style={styles.updates}>{updates}</Text>

            {/* Comments section */}
            <Card style={styles.commentsCard}>
              <View>
                <Text style={styles.cardHead}>Comments</Text>
              </View>
              <Card.Content>
                {sortedComments.map(comment => (
                  <View style={styles.comments} key={comment.id}>
                    <Text>{comment.username}</Text>
                    <Text>-- {comment.Comment}</Text>
                  </View>
                ))}

                <CustomInput
                  placeholder="Add a comment"
                  value={comment}
                  setValue={setComment}
                />

                <View style={styles.buttonView}>
                  <CustomButton
                    text="Post Comment"
                    onPress={() => handleCommentSubmit(messageNumber, eventid)}
                    type="PRIMARY"
                  />
                </View>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </Provider>
    );
  } else {
    if (filteredData.length > 0 && matchInfo.length > 0) {
      
      // console.log('filteredData', filteredData);
      // console.log('matchInfo', matchInfo);
      // console.log('datekey', accessCodeData.eventData.dateKey);

      const filteredMatch = matchInfo.find(
        match => match.date === accessCodeData.eventData.dateKey,
      );

     // console.log('filteredMatch', filteredMatch);
      const eventid = filteredMatch.event_id;
      const trainingInfoParts = filteredMatch.trainingInfo.split(', ');

      //console.log('eventid', eventid);

      const event_idMatches = filteredData.some(
        item => item.event_id === eventid,
      );
      //console.log('event_idMatches', event_idMatches);

      // const filteredMatch = matchInfo.find(match => match.opponent.toLowerCase() === selectedOpponent.toLowerCase());
      const session_updates = matchInfo.find(
        match => match.type === 'training',
      ).updates;
      //console.log('session updates', session_updates);

      //for the attendance buttons
      const confrimedAttendance = 'confirmed';
      const confrimedAbsence = 'absent';

      //for the comments section

      const filteredComments = EventComments.filter(
        comment => comment.event_id === eventid,
      );

      // Sort filtered comments by comment_number
      const sortedComments = filteredComments.sort(
        (a, b) => parseInt(a.comment_number) - parseInt(b.comment_number),
      );

      //the length tog et the mesage number
      const messageNumber = sortedComments.length + 1;

     // console.log('sortedComments', sortedComments);
     // console.log('messageNumber', messageNumber);

      return (
        <Provider>
          <ScrollView>
            <View>
            <Appbar.Header style={styles.header}>

           <View style={styles.titleContainer}>
             <Text style={styles.title}>
               Event Information           
             </Text>
           </View> 


           <View style={styles.menuContainer}>
           <Menu
            visible={isMenuVisible}
            onDismiss={handleMenuDismiss}
            anchor={<CustomButton text="☰" type="MENU"  onPress={handleMenuPress} />}
>
              <Menu.Item onPress={() => {}} title="Home" />
              {/* <Menu.Item onPress={handleResponses} title="Responses" /> */}
              <Menu.Item onPress={handleHome} title="Sign Out" />
              </Menu>
             </View>
            </Appbar.Header>
            </View>

            <Card>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>{eventCardData.type}</Text>
              </View>
              <Card.Content>
                <View style={styles.card}>
                  <Text>Arrival Time : {eventCardData.arrive}</Text>
                  <Text>Start Time : {eventCardData.startTime}</Text>
                  <Text>Venue : {eventCardData.venue}</Text>
                  <Text></Text>
                  <Text></Text>

                  <Text style={styles.trainingInfoHeader}>Training Info:</Text>
                  {trainingInfoParts.map((part, index) => (
                    <Text key={index} style={styles.trainingInfo}>
                      {part}
                    </Text>
                  ))}
                </View>
              </Card.Content>
            </Card>

            {!event_idMatches && (
              <React.Fragment>
                <View style={styles.buttonContainer}>
                  <CustomButton
                    text="Confirm Attendance"
                    onPress={() =>
                      handleAttendance(eventid, confrimedAttendance)
                    }
                    type="SECONDARY"
                    style={styles.buttonContainer}
                  />
                  <CustomButton
                    text="Confirm Absence"
                    onPress={() => handleAbsence(eventid, confrimedAbsence)}
                    type="TERTIARY"
                    style={styles.buttonContainer}
                  />
                </View>
              </React.Fragment>
            )}
            <View style={styles.buttonView}>
              <CustomButton
                text="See who's going ->"
                onPress={() => handleResponses(eventid)}
                type="PRIMARY"
              />
            </View>

            <Text></Text>
            <Text style={styles.updatesTitle}>Session Updates :</Text>
            <Text style={styles.updates}>{session_updates}</Text>

            {/* Comments section */}
            <Card style={styles.commentsCard}>
              <View>
                <Text style={styles.cardHead}>Comments</Text>
              </View>
              <Card.Content>
                {sortedComments.map(comment => (
                  <View style={styles.comments} key={comment.id}>
                    <Text>{comment.username}</Text>
                    <Text>-- {comment.Comment}</Text>
                  </View>
                ))}

                <CustomInput
                  placeholder="Add a comment"
                  value={comment}
                  setValue={setComment}
                />

                <View style={styles.buttonView}>
                  <CustomButton
                    text="Post Comment"
                    onPress={() => handleCommentSubmit(messageNumber, eventid)}
                    type="PRIMARY"
                  />
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </Provider>
      );
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  cardHeader: {
    backgroundColor: '#3B71F3',
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    margin: 10,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    textTransform: 'uppercase',
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 5,
    fontSize: 18,
    // Add margin to the card to create space between the card and the edge of the screen
    // Set marginTop to 0 to place the card right below the appbar
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  updates: {
    fontSize: 18,
    paddingLeft: 10,
    paddingBottom: 15,
  },
  updatesTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    textDecorationLine: 'underline',
    paddingLeft: 10,
  },
  customButton: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 20,
  },
  buttonView: {
    flexDirection: 'column', // Change flexDirection to 'column'
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    paddingHorizontal: 20, // Add horizontal padding for better spacing
    paddingBottom: 10,
  },
  commentsCard: {
    backgroundColor: '#D5D0C7',
    // D5D0C7
  },
  comments: {
    backgroundColor: '#ffffff',
    padding: 20,
  },
  cardHead: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    textTransform: 'uppercase',
    color: '#ffffff',
  },
  teamSheet: {
    fontSize: 18,
    paddingLeft: 15,
  },
  trainingInfo: {
    fontSize: 18,
  },
  trainingInfoHeader: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 18,
  },
  header: {
    backgroundColor: '#DFF9FF',
    borderBottomWidth: 2,
    borderColor: '#BCE6F0',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 16,
  },
});

export default EventCard;
