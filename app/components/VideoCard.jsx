import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import {icons} from "../../constants";
import { useState } from 'react/cjs/react.development';
import { Video, ResizeMode } from 'expo-av'; 
import { FontAwesome } from '@expo/vector-icons';
import { Saving } from '../../lib/appwrite';

const VideoCard = ({ video:{title, creator:{username, avatar}, video, thumbnail, Saved}, id }) => { 
    const [play, setplay] = useState(false);
    //const [Status, setStatus] = useState(false);
  return (
    <View className="flex-col items-center px-4 mb-14">
        <View className= "flex-row gap-3 items-start>">
            <View className= "justify-center items-center flex-row flex-1">
                <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
                    <Image source ={{uri:avatar}}
                    className="w-full h-full rounded-lg "
                    resizeMode='cover' />
                </View>
                <View className ="justify-center flex-1 ml-3 gap-y-1">
                    <Text className="text-white font-psemibold text-sm" numberOfLines={1}>{title}</Text>
                    <Text className= "text-xs text-gray-100 font-pregular" numberOfLines={1}>{username}</Text>
                </View>
            </View>
            <View className= "pt-2 flex-row space-x-2">
              <TouchableOpacity onPress={async () => {
                
                await Saving(id, Saved)
              }
            }>
                {Saved ? (<FontAwesome name="bookmark" size={24} color="#FF9C01" />) :
                (<FontAwesome name="bookmark-o" size={24} color="gray" />) }
              </TouchableOpacity>
              
                
                <Image source= {icons.menu} className="w-5 h-5" resizeMode='contain' />
            </View>
        </View>
        {play ? ( 
        <Video
        source={{ uri: video }}
        className="w-full h-60 rounded-xl mt-3 relative justify-center items-center border border-secondary"
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        shouldPlay
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            setplay(false);
          }
        }}
      />
        ) : (
            <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setplay(true)}
            className="w-full h-60 rounded-xl mt-3 relative justify-center items-center border border-secondary">
              <Image source ={{uri:thumbnail}}
                    className="w-full h-full rounded-xl mt-3"
                    resizeMode='cover' /> 
                <Image source={icons.play}
                className="w-12 h-12 absolute"
                resizeMode='contain' />
            </TouchableOpacity>

        )}

       
    </View>
  )
}

export default VideoCard