import { Client, Avatars, Databases, Account, ID, Query } from 'react-native-appwrite';
let client = new Client();
let databases = new Databases(client);
let avatars = new Avatars(client);
let account = new Account(client);


export { account, databases, avatars, client };

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
    await signIn(email, password)
    console.log('Document created with user details!');
  } catch (error) {
    console.error('Failed to create account:', error);
    throw error;
  }
}


// Sign in
export async function signIn(email: string, password: string) {
  try {
    await account.createEmailPasswordSession(email, password); // Ensure this is the correct method
    const user = await account.get();
    console.log('User signed in:', user);
    return user;
  } catch (error) {
    console.error('Failed to sign in:', error);
    throw error;
  }
}

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