import { Client, Avatars, Databases, Account, ID, Query, Storage } from 'react-native-appwrite';

let client = new Client();
let databases = new Databases(client);
let avatars = new Avatars(client);
let account = new Account(client);
let storage = new Storage(client)

export { account, storage, databases, avatars, client };

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66694f2c003d7561352e")
  // .setPlatform('com.ct-Driver.app');

// Register
export async function Register(email: string, password: string, username: string) {
  try {
    const user = await account.create(ID.unique(), email, password, username);
    console.log('Account created!');

    await databases.createDocument(
      '66797c090028543355dd', // Database ID
      '66797f5a0006b641046a', // Collection ID, Users
      ID.unique(),
      {
        accountId: user.$id,
        email: email,
        username: username,
        avatar: avatars.getInitials(username),
      }
    );
    console.log('Document created with user details!');
  } catch (error) {
    console.error('Failed to create account:', error);
    throw error;
  }
}


// Sign in
// export async function signIn(email: string, password: string) {
//   try {
//     await account.createEmailPasswordSession(email, password); // Ensure this is the correct method
//     const user = await account.get();
//     console.log('User signed in:', user);
//     return user;
//   } catch (error) {
//     console.error('Failed to sign in:', error);
//     throw error;
//   }
// }

// export async function signIn(email: string, password: string) {
//   try {
//     // Attempt to sign in with email and password
//     await account.createEmailPasswordSession(email, password);
//     // If no exception is thrown, the user is signed in without needing MFA
//     setIsLogged(true);
//     router.push('/home');
//   } catch (error) {
//     if (error.type === 'user_more_factors_required') {
//       try {
//         // If more factors are required, create an MFA challenge
//         const challenge = await account.createMfaChallenge('email');
//         // Store the challenge ID for later use
//         setChallengeId(challenge.$id);
//         // Notify the user and redirect to the MFA screen
//         console.log('OTP Sent', 'Please check your email for the OTP.');
//         router.push('/mfa');
//       } catch (mfaError) {
//         console.error('Failed to create MFA challenge:', mfaError);
//         throw mfaError;
//       }
//     } else {
//       console.error('Failed to sign in:', error);
//       throw error;
//     }
//   }
// }

//Mfa


//messaging
// Send message
export async function sendMessage(payload: {}, Permissions: []) {
  try {
    await databases.createDocument(
      '66797c090028543355dd', // Database ID
      '667e783500102010cd30', // Collection ID, messages
      ID.unique(),
      payload,
      Permissions
    );
  } catch (err) {
    console.log("Error! Couldn't send", err);
  }
}

// Get messages
export async function getMessages() {
  try {
    const response = await databases.listDocuments(
      '66797c090028543355dd', // Database ID
      '667e783500102010cd30', // Collection ID, messages
      [
        Query.orderDesc('$createdAt')
      ]
    );
    console.log('RESPONSE:', response);
    return response.documents;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw error;
  }
}

//Delete message
export async function deleteMessage(message_id: string) {
  try{
    await databases.deleteDocument(
    '66797c090028543355dd', // Database ID
    '667e783500102010cd30',// Collection ID, messages
    message_id)
  }catch(err){
    console.log("Couldn't delete");
  }
}

//get user details
export async function fetchProfile(user_id: string) {
  try {
    const response = await databases.listDocuments(
      '66797c090028543355dd', // Database ID
      '66797f5a0006b641046a', // Collection ID, users
      [
        Query.equal('accountId', user_id)
      ]
    );
    console.log(response.documents);
    if (response.documents.length > 0) {
      console.log("User document retrieved:", response.documents[0]);
      return response.documents[0];
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.log("Error fetching user info:", error.message);
    throw error;
  }
}

// Update user details for the logged-in user
export async function updateProfile(documentId: string, updatedData: {}) {
  try {
    const response = await databases.updateDocument(
      '66797c090028543355dd', // Database ID
      '66797f5a0006b641046a', // Collection ID, users
      documentId, // Use the document.$id
      updatedData
    );
    console.log("User profile updated successfully");
    return response;
  } catch (error) {
    console.log("Failed to update user info", error);
    throw error;
  }
}

export async function uploadPhoto(photoUri) {
  try {
    // Replace 'file://' with empty string if it exists
    const processedUri = photoUri.replace('file://', '');

    const response = await fetch(processedUri);
    const pfp = await response.blob();

    const file = await storage.createFile(
      '66bc6f82001a5b627b81', // Your bucket ID
      ID.unique(),
      pfp
    );

    return file;
  } catch (error) {
    console.error('Failed to upload photo:', error);
    throw new Error(`Failed to upload photo: ${error.message}`);
  }
}

export async function searchPosts(query: string) {
  try {
    const posts = await databases.listDocuments(
      '66797c090028543355dd', // Database ID
      '667e783500102010cd30', // Collection ID, messages
      [Query.search('title', query)]
    )

    return posts.documents
  } catch (err) {
    throw new Error (err)
  }
}