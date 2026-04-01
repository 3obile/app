import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

const MOCK_STORIES = [
  { id: '1', name: 'قصتك', avatar: '' },
  { id: '2', name: 'سارة', avatar: '' },
  { id: '3', name: 'محمد', avatar: '' },
  { id: '4', name: 'فاطمة', avatar: '' },
  { id: '5', name: 'علي', avatar: '' },
];

export default function StoriesBar() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme as 'light' | 'dark'];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {MOCK_STORIES.map((story) => (
          <Pressable key={story.id} style={styles.storyItem}>
            <View style={[styles.avatarBorder, { borderColor: story.id === '1' ? '#ccc' : theme.primary }]}>
              <View style={styles.avatarPlaceholder} />
            </View>
            <Text style={[styles.storyName, { color: theme.text }]} numberOfLines={1}>
              {story.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  scrollContent: {
    paddingHorizontal: 15,
    flexDirection: 'row-reverse',
  },
  storyItem: {
    alignItems: 'center',
    marginLeft: 15,
    width: 70,
  },
  avatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e1e1e1',
  },
  storyName: {
    fontSize: 12,
    textAlign: 'center',
  }
});
