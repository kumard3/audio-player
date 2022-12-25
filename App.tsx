import * as MediaLibrary from "expo-media-library";
import { Audio, Video, AVPlaybackStatus } from "expo-av";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [audios, setAudio] = useState([]);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  async function playSound(uri) {
    console.log(uri, "uri");
    const { sound } = await Audio.Sound.createAsync({
      uri: uri,
    });
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    (async () => {
      const { granted } = await MediaLibrary.requestPermissionsAsync();
      if (granted) {
        const options = {
          mediaType: MediaLibrary.MediaType.video,
        };
        const video = await MediaLibrary.getAssetsAsync(options);
        setAudio(video);
      }
    })();
  }, []);

  console.log(audios);

  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: "center", marginTop: 100 }}>
        <FlatList
          data={audios?.assets}
          renderItem={({ item }) => (
            <View>
              {/* <Button title={"Play"} onPress={() => playSound(item.uri)} /> */}
              <Video
                ref={video}
                style={styles.video}
                source={{
                  uri: item.uri,
                }}
                useNativeControls
                resizeMode='contain'
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              />
              {/* <View style={styles.buttons}>
                <Button
                  title={status.isPlaying ? "Pause" : "Play"}
                  onPress={() =>
                    status.isPlaying
                      ? video.current.pauseAsync()
                      : video.current.playAsync()
                  }
                />
              </View> */}
              {/* <Text>{item.filename}</Text> */}
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
