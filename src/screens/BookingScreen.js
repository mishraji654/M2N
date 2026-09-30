import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BookingForm from '../components/booking/BookingForm';
import { COLORS } from '../theme/colors';

export default function BookingScreen({ route, navigation }) {
  const hotel = route.params?.hotel;
  const room = route.params?.room;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Book Your Stay</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BookingForm
          selectedHotel={hotel}
          selectedRoom={room}
          navigation={navigation}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: COLORS.background,
    ...Platform.select({
      web: {
        maxWidth: 480,
        width: '100%',
        marginHorizontal: 'auto',
        minHeight: '100vh'
      }
    })
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3
  },
  page: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: COLORS.background
  },
  content: {
    width: '100%',
    minWidth: '100%',
    alignItems: 'stretch',
    paddingBottom: 40
  }
});
