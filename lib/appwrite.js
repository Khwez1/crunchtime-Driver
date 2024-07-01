import { Client, Avatars, Databases, Account, ID, Query, Role, Permission } from 'react-native-appwrite';

let client = new Client();
let databases = new Databases(client);
let avatars = new Avatars(client);
let account = new Account(client);

console.log('Account object:', account);

export { account, databases, avatars, client };

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66694f2c003d7561352e")
  .setPlatform('com.ct-Driver.app');

// Register
export async function Register(email, password, username) {
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
    return user;
  } catch (error) {
    console.error('Failed to create account:', error);
    throw error;
  }
}

// Sign in
export async function signIn(email, password) {
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

// Sign out
export async function signOut() {
  try {
    await account.deleteSessions();
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
}
//messaging
// Send message
export async function sendMessage(payload, Permissions) {

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
export async function deleteMessage(message_id) {
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
export async function userDetails(document_id) {
  try {
    await databases.getDocument(
    '66797c090028543355dd', // Database ID
    '66797f5a0006b641046a',// Collection ID, users
    document_id)
  } catch (error) {
    console.log("User info not found:",document_id);
  }
}

// Update user details
export async function updateUserDetails(document_id, updatedData) {
  try {
    const updatedDocument = await databases.updateDocument(
      '66797c090028543355dd', // Database ID
      '66797f5a0006b641046a', // Collection ID, users
      document_id,
      updatedData
    );
    return updatedDocument;
  } catch (error) {
    console.log("Failed to update user info", error);
    throw error;
  }
}