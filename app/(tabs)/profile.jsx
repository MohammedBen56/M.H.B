import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'


import {SafeAreaView} from "react-native-safe-area-context";


import EmptyState from '../components/EmptyState';

import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../components/VideoCard';
import { getUserPosts, signOut } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons } from '../../constants';
import InfoBox from '../components/InfoBox';
import { router } from 'expo-router';

const Profile = () => {
  const {User, setUser, setisLoggedIn} = useGlobalContext();
  
  const {data: posts, refetch} = useAppwrite(() => getUserPosts(User.$id));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async() => {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
  }

  const logout = async () => {
    await signOut();
    setUser(null);
    setisLoggedIn(false);

    router.replace('/sign-in');

  }
  
  
  //console.log(posts);


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
          <View className=" w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
            className="w-full items-end mb-10"
            onPress={logout}
            >
              <Image source={icons.logout}
              resizeMode='contain' className="w-6 h-6" />
              
            </TouchableOpacity> 

            <View className="w-16 h-16 border border-secondary rounded-lg justify-center">
              <Image source={{uri:User?.avatar}}
              className="w-[100%] h-[100%] rounded-lg"
              resizeMode='cover' />

            </View>

            <InfoBox
            title={User?.username}
            containerStyles='mt-5'
            titleStyles="text-lg"/>

          <View className="mt-5 flex-row">
            <InfoBox
            title={posts.length || 0}
            subtitle="Posts"
            containerStyles='mr-10'
            titleStyles="text-xl"/>
            <InfoBox
            title="1.2K"
            subtitle="Followers"
            titleStyles="text-xl"/>
          </View>

                
               
                
            
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

export default Profile