import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, Card} from 'react-native-paper';
import React from 'react';

const MatchCard = ({item, onPress}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.matchcard}>
        <Card.Content>
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.itemtype}>{item.type}</Text>
              <Text>Venue : {item.venue}</Text>
              <Text>Arrival Time : {item.arrive}</Text>
              <Text>Start Time : {item.startTime}</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Avatar.Text label="🏐" backgroundColor="#9fafca" size={80} />
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default MatchCard;
