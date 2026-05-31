import "react-native-gesture-handler";
import Game from './src/components/Game';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <Game />
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

export default App;