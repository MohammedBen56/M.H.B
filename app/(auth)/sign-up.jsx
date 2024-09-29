import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import FormField from '../components/FormField'
import {useState} from 'react'
import CustomButton from '../components/CustomButton'
import {Link, router} from 'expo-router'
import {createUser} from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
const SignUp = () => {
  const {setUser, setisLoggedIn} = useGlobalContext();
  const [form, setform] = useState({
    username:'',
    email:'',
    password:''
})
 const [isSubmitting, setisSubmitting] = useState(false)
  const submit = async () => {
    if(!form.username || !form.email || !form.password) {
      Alert.alert('Please fill in all fields');
    }

    setisSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username)
      setUser(result);
      setisLoggedIn(true);

      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setisSubmitting(false)
    }}      
      //createUser();
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center min-h-[10vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

        </View>
      <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">Sign up to Aora</Text>
      <FormField 
        title="Username"
        value={form.username}
        handleChangeText={(e) => setform({...form, username: e})}
        otherStyles="mt-10"
    
      />
      <FormField 
        title="Email"
        value={form.email}
        handleChangeText={(e) => setform({...form, email: e})}
        otherStyles="mt-7"
        keyboardType="email-address"
      />
      <FormField 
        title="Password"
        value={form.password}
        handleChangeText={(e) => setform({...form, password: e})}
        otherStyles="mt-7"
      />
      <CustomButton
          title='Sign Up'
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
      />
      <View className='justify-center pt-5 flex-row gap-2'>
          <Text className="text-lg text-gray-100 font-pregular">
            Have an account already? {' '}
            <Link href="./sign-in" className="text-secondary text-pbold">
            Sign In
          </Link>
          </Text>
          
      </View>


      </ScrollView>
      
    </SafeAreaView>
  )
}

export default SignUp