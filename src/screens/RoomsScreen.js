import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import RoomCard from '../components/rooms/RoomCard';
import { rooms } from '../data/siteData';
import { COLORS } from '../theme/colors';

export default function RoomsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rooms & Suites</Text>
        <Text style={styles.headerSubtitle}>Designed for tranquility, comfort and luxury</Text>
      </View>

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onPress={() => navigation.navigate('RoomDetail', { room })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  page: {
    flex: 1
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110
  }
});
