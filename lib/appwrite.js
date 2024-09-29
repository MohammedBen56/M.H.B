import { Alert } from 'react-native';
import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';



export const Config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.Benhayoun.Aora',
    projectId: '6649fd2d00239be6b7ff',
    databaseId: '664a0389001db6c11f83',
    UserCollectionId: '664a03c200259340f67e',
    VideoCollectionId: '664a0404003b83dcd54a',
    storageId: "664a0603000aacb3aeda"
}

const { endpoint, platform, projectId, databaseId, UserCollectionId, VideoCollectionId, storageId } = Config;


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(Config.endpoint) // Your Appwrite Endpoint
    .setProject(Config.projectId) // Your project ID
    .setPlatform(Config.platform) // Your application ID or bundle ID.


    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);
    const storage = new Storage(client);
    

    // Register User
    export const createUser = async (email, password, username) => {
            
    try {
        const newAccount = await account.create(ID.unique(), email, password, username );
        if(!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser= await databases.createDocument(
            Config.databaseId,
            Config.UserCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email : email,
                username : username,
                avatar: avatarUrl
            })
        return newUser;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
    }

    export const signIn = async (email, password) => {
        try {
            const session = await account.createEmailPasswordSession(email, password);
            return session;
        } catch(error) {
            throw new Error(error);
        }
    
    
    }

    export const getCurrentUser = async () => {
        try {
            const currentAccount= await account.get();

            if(!currentAccount) throw Error;
            
            const currentUser = await databases.listDocuments(
                Config.databaseId,
                Config.UserCollectionId,
                [Query.equal('accountId', currentAccount.$id)]
                
            )

            if(!currentUser) throw Error;

            return currentUser.documents[0];
        }catch (error){
            console.log(error);
        }



    }

    export const getAllPosts = async () => {

        try{
            const posts = await databases.listDocuments(
                databaseId,
                VideoCollectionId,
                [Query.orderDesc('$createdAt')]
            )
            return posts.documents;

        } catch (error){
            throw new Error(error);
        }


    }

    export const getLatestPosts = async () => {

        try{
            const posts = await databases.listDocuments(
                databaseId,
                VideoCollectionId,
                [Query.orderDesc('$createdAt', Query.limit(7))]
            )
            return posts.documents;

        } catch (error){
            throw new Error(error);
        }


    }

    export const SearchPosts  = async (query) => {

        try{
            const posts = await databases.listDocuments(
                databaseId,
                VideoCollectionId,
                [Query.search('title', query)]
            )
            return posts.documents;

        } catch (error){
            throw new Error(error);
        }


    }
    export const Saving = async (postId, Saved) => {
        try {
            await databases.updateDocument(databaseId, VideoCollectionId, postId, {Saved : !Saved})
        } catch (error) {
            throw new Error(error);
        }

    }
    export const SavedPosts = async () => {
        
        try {
            
            const posts = await databases.listDocuments(
                databaseId,
                VideoCollectionId,
                [Query.equal('Saved', true)])
            return posts.documents;
    
        } catch (error) {
            throw new Error(error);
        }
    }
    export const getUserPosts  = async (userID) => {

        try{
            const posts = await databases.listDocuments(
                databaseId,
                VideoCollectionId,
                [Query.equal('creator', userID)]
            )
            return posts.documents;

        } catch (error){
            throw new Error(error);
        }


    }

    export const signOut = async () => {

        try {
            const session = await account.deleteSession('current');
            return session;
        }
        catch (error){
            throw new Error(error);
        }
    }
    
    export const getFilePreview = async (fileId, type) => {

        let fileUrl;

        try {
            if(type ==='image'){
                fileUrl = await storage.getFilePreview(storageId,fileId, 200, 200, 'top', 100)
            }
            else if(type === 'video'){
                fileUrl = await storage.getFileView(storageId,fileId)
            }
            if(!fileUrl) throw Error;
            return fileUrl;
        } catch (error) {
            throw new Error(error);
        }


    }

    export const uploadFile = async (file, type) => {

        if(!file.fileName || !file.mimeType || !file.fileSize || !file.uri) {

            Alert.alert('Error uploadFile', 'NO FILE SELECTED')

        }  

        const asset = {
            "name": file.fileName,
            "type": file.mimeType,
            "size": file.fileSize,
            "uri":  file.uri

        }
        try {
            //console.log(asset)
            const uploadedFile = await storage.createFile(storageId,ID.unique(),asset)
            //console.log('Upload',uploadedFile)

            const fileUrl = await getFilePreview(uploadedFile.$id, type)
            return fileUrl;
        } catch (error) {
            Alert.alert('Error uploadFile', error.message)
        }

    }


    export const CreatePost = async (form) => {
        if(!form.title || !form.video || !form.thumbnail || !form.prompt) {

            Alert.alert('ERROR POST', 'NO ')
            
        }  

        try {
            const [thumbnailUrl, VideoUrl]= await Promise.all([
                uploadFile(form.thumbnail, 'image'),
                uploadFile(form.video, 'video')
            ])
            //console.log('User', userId)
            const newpost = await databases.createDocument(
                databaseId,
                VideoCollectionId,
                ID.unique(),
                {
                    title: form.title,
                    prompts: form.prompt,
                    thumbnail: thumbnailUrl,
                    video: VideoUrl,
                    creator: form.userId
                }
            )
            
            Alert.alert('Success appwrite', 'Post uploaded successfully')
            return newpost;

        } catch (error) {
            Alert.alert('Error here', error.message)
            
        }



    }


    
    