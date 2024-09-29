import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../components/FormField'
import {useState} from 'react'
import {Video, ResizeMode} from 'expo-av'
import {icons} from '../../constants'
import CustomButton from '../components/CustomButton'
import * as ImagePicker from 'expo-image-picker';
import {router} from 'expo-router'
import { CreatePost } from '../../lib/appwrite'
import {useGlobalContext} from '../../context/GlobalProvider';

const Create = () => {
  const {User} = useGlobalContext();
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState( 
    {title: '',
    video:null,
    thumbnail:null,
    prompt: ''}
  )
  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType ==='image' ? ImagePicker.MediaTypeOptions.Images 
      : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if(!result.canceled){
      if(selectType ==="image"){
        setForm({...form, thumbnail:result.assets[0]})
      }
      if(selectType ==="video"){
        setForm({...form, video:result.assets[0]})
      }
    }

  }

  const submit =  async () => {
    if(!form.title || !form.video || !form.thumbnail || !form.prompt){
      return Alert.alert("Please fill all fields")
      
    }
    setUploading(true)

    try {
      /* if(!form.title || !form.video || !form.thumbnail || !form.prompt) {

        Alert.alert('ERROR CREATE', 'NO ')
        return;
        
    }   */
    //console.log('Form', User)
    //let userID= User.$id;
      await CreatePost({...form, userId: User.$id});
      //Alert.alert('Success create', 'Post uploaded successfully')
      router.push("/home")
    }
     catch (error) {
      Alert.alert('Error hnan', error.message)
  }
  finally{
    setUploading(false)
    setForm({title: '',
      video:null,
      thumbnail:null,
      prompt: ''})
  }
}
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Upload Video
        </Text>
        <FormField
        title="Video title"
        value={form.title}
        placeholder="Give your video a catchy title..."
        handleChangeText={(e) => setForm({...form, title:e})}
        otherStyles="mt-10" />

        <View className="  mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              <Video
                source={{uri: form.video.uri}}
                className="w-full h-64 rounded-2xl  "
                resizeMode={ResizeMode.COVER}
               />

            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14  border border-dashed border-secondary-100 justify-center items-center">
                  <Image  
                  source={icons.upload}
                  resiseMode='contain'
                  className="w-10 h-10"
                  />
                </View> 

              </View>
            )}

          </TouchableOpacity>

        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Thumbnail
          </Text> 

          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image
                source={{uri: form.thumbnail.uri}}
                className="w-full h-64 rounded-2xl  "
                resizeMode='cover'
               />

            ) : (
              <View className="w-full h-20 px-4 bg-black-100 rounded-2xl justify-center items-center flex-row space-x-2">
                
                  <Image  
                  source={icons.upload}
                  resiseMode='contain'
                  className="w-7 h-7"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                

              </View>
            )}

          </TouchableOpacity>
        </View>

        <FormField
        title="AI Prompt"
        value={form.prompt}
        placeholder="The prompt youu used to create this video"
        handleChangeText={(e) => setForm({...form, prompt:e})}
        otherStyles="mt-10" />

        <CustomButton
        title="Submit  & Upload"
        handlePress={submit}
        containerStyles="mt-7 "
        isLoading={uploading}
        />


      </ScrollView>
    </SafeAreaView>
  )
}

export default Create