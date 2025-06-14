# Feest 🎉

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app) and enhanced with [NativeWind](https://www.nativewind.dev/) for utility-first styling.

## Tech Stack

This project uses the following technologies:

- **[Expo](https://expo.dev)** - React Native framework for building universal apps
- **[React Native](https://reactnative.dev)** - Mobile app development framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[NativeWind](https://www.nativewind.dev/)** - Utility-first CSS framework for React Native
- **[TailwindCSS](https://tailwindcss.com/)** - CSS framework for rapid UI development
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - File-based routing for React Native

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Styling with NativeWind

This project is configured with NativeWind, which allows you to use Tailwind CSS classes directly in your React Native components. Here's how to use it:

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-600">
        Hello NativeWind!
      </Text>
    </View>
  );
}
```

### Configuration Files

- `tailwind.config.js` - TailwindCSS configuration
- `nativewind-env.d.ts` - TypeScript declarations for NativeWind
- `app/global.css` - Global CSS imports

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo and the technologies used, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [NativeWind documentation](https://www.nativewind.dev/): Learn how to use Tailwind CSS in React Native.
- [TailwindCSS documentation](https://tailwindcss.com/docs): Complete guide to utility-first CSS framework.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
