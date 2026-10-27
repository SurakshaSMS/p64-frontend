import { Tabs } from 'expo-router';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type TabIconProps = {
  source: ImageSourcePropType;
  focused: boolean;
  label: string;
};

function TabIcon({
  source,
  focused,
  label,
}: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <View
        style={[
          styles.normalIconContainer,
          focused && styles.normalIconActive,
        ]}
      >
        <Image
          source={source}
          style={[
            styles.normalIcon,
            {
              opacity: focused ? 1 : 0.5,
            },
          ]}
          resizeMode="contain"
        />
      </View>

      <Text
        style={[
          styles.tabLabel,
          focused && styles.tabLabelActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,

        tabBarStyle: {
          height: 90,
          backgroundColor: '#080E1E',
          borderTopWidth: 1,
          borderTopColor: '#19284B',

          paddingBottom: 40,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Home"
              source={
                require('@/assets/images/navbar/home.png')
              }
            />
          ),
        }}
      />

      {/* MESSAGES */}
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Messages"
              source={
                require('@/assets/images/navbar/message-circle.png')
              }
            />
          ),
        }}
      />

      {/* ALERTS */}
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Alerts"
              source={
                require('@/assets/images/navbar/shield-check.png')
              }
            />
          ),
        }}
      />

      {/* SETTINGS */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Settings"
              source={
                require('@/assets/images/navbar/setting-gear.png')
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 55,
    gap: 4,
  },

  normalIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 11,

    alignItems: 'center',
    justifyContent: 'center',
  },

  normalIconActive: {
    backgroundColor: '#6D3DF5',
  },

  normalIcon: {
    width: 24,
    height: 24,
  },

  tabLabel: {
    color: '#536183',
    fontSize: 11,
    fontWeight: '500',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

});