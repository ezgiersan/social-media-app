import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

interface LoadingBarProps {
  visible: boolean;
  message?: string;
  width?: number;
  color?: string;
}

const LoadingBar: React.FC<LoadingBarProps> = ({
  visible,
  // width = 300,
  color = "#C5BEE1",
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.progressWrapper}>
      <Progress.Bar
        indeterminate
        width={null}
        color={color}
        borderWidth={0}
        height={6}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%"
  },
  progressWrapper: {
    width: "100%",
  },
});

export default LoadingBar;


// import React, { useRef, useEffect } from "react";
// import { View, Animated, StyleSheet } from "react-native";

// const ProgressBar = ({ progress }: { progress: number }) => {
//   const widthAnim = useRef(new Animated.Value(0)).current;

//   console.log("progress", progress);
  
//   useEffect(() => {
//     Animated.timing(widthAnim, {
//       toValue: progress,
//       duration: 3000,
//       useNativeDriver: false,
//     }).start();
//   }, [progress]);

//   return (
//     <View style={styles.backgroundBar}>
//         <Animated.View
//           style={[
//             styles.progressBar,
//             {
//               width: widthAnim.interpolate({
//                 inputRange: [0, 100],
//                 outputRange: ["0%", "100%"],
//               }),
//             },
//           ]}
//         />
//     </View>
//   );
  
// };

// const styles = StyleSheet.create({
//   backgroundBar: {
//     height: 4,
//     backgroundColor: "#fff",
//     width: "100%",
//     borderRadius: 50,
//     // marginBottom: 10
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: "rgba(90,71, 171, 0.4)",
//     borderRadius: 50,
//   },
// });

// export default ProgressBar;
