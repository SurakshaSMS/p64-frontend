import { AppRegistry } from "react-native";
import { incomingSmsTask } from "./src/tasks/incomingSmsTask";

AppRegistry.registerHeadlessTask(
  "IncomingSmsTask",
  () => incomingSmsTask
);

import "expo-router/entry";