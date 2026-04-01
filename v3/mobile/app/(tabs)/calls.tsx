import { StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

export default function CallsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme as 'light' | 'dark'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>المكالمات</Text>
      <View style={styles.emptyContainer}>
        <Text style={{ color: theme.text, opacity: 0.6 }}>سجل المكالمات فارغ</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'right',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
