import { Client, Account, ID } from 'react-native-appwrite';

let client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66694f2c003d7561352e");

let account = new Account(client);
export {account}
// Register
export async function Register(email, password, username) {
  try {
    await account.create(ID.unique(), email, password, username);
    console.log('Account created!');
  } catch (error) {
    console.error('Failed to create account:', error);
    throw error;
  }
}

// Sign in
export async function signIn(email, password) {
  try {
    await account.createEmailPasswordSession(email, password);
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
