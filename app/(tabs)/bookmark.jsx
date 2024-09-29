import { View, Text, FlatList,RefreshControl } from 'react-native'
import React, { useState, } from 'react'

import {SafeAreaView} from "react-native-safe-area-context";


import EmptyState from '../components/EmptyState';

import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../components/VideoCard';
import { SavedPosts } from '../../lib/appwrite';
//import { useLocalSearchParams } from 'expo-router';


const bookmark = () => {
  
  const {data: posts, refetch} = useAppwrite(() => SavedPosts());
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async() => {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
  }

  

  return (
    <SafeAreaView className= " bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor = {(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard
            video={item}
            id= {item.$id}
          />
        )}
        ListHeaderComponent={ () => (
          <View className=" my-6 px-4"> 

            <Text className="text-2xl font-psemibold text-white "> Saved Videos  </Text>
          </View>
        )}
        ListEmptyComponent= {() => (
          <EmptyState
          title="No Video Found"
          subtitle="No videos foiund for this search query"/>
        )}

        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      
      {/*<Text>Home</Text>*/}
    </SafeAreaView>
  )
}

export default bookmark