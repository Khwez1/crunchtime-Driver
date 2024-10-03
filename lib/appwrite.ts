import {
  Client,
  Avatars,
  Databases,
  Account,
  ID,
  Query,
  Storage,
  Functions,
} from 'react-native-appwrite';

const client = new Client();
const databases = new Databases(client);
const avatars = new Avatars(client);
const account = new Account(client);
const storage = new Storage(client);
const functions = new Functions(client);

export { account, functions, storage, databases, avatars, client, ID, Query };

client.setEndpoint('https://cloud.appwrite.io/v1').setProject('66bb50ba003a365f917d');

//messaging
// Send message
export async function sendMessage(payload: object, Permissions: []) {
  try {
    await databases.createDocument(
      '669a5a3d003d47ff98c7', // Database ID
      '66d053d10001a7923c43', // Collection ID, messages
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
      '669a5a3d003d47ff98c7', // Database ID
      '66d053d10001a7923c43', // Collection ID, messages
      [Query.orderDesc('$createdAt')]
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
  try {
    await databases.deleteDocument(
      '669a5a3d003d47ff98c7', // Database ID
      '66d053d10001a7923c43', // Collection ID, messages
      message_id
    );
  } catch (err) {
    console.log("Couldn't delete");
  }
}

//get user details
export async function fetchProfile(user_id: string) {
  try {
    const response = await databases.listDocuments(
      '669a5a3d003d47ff98c7', // Database ID
      '66bc885a002d237e96b9', // Collection ID, users
      [Query.equal('driverId', user_id)]
    );
    console.log(response.documents);
    if (response.documents.length > 0) {
      console.log('User document retrieved:', response.documents[0]);
      return response.documents[0];
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.log('Error fetching user info:', error.message);
    throw error;
  }
}

// Update user details for the logged-in user
export async function updateProfile(documentId: string, updatedData: object) {
  try {
    const response = await databases.updateDocument(
      '669a5a3d003d47ff98c7', // Database ID
      '66bc885a002d237e96b9', // Collection ID, users
      documentId, // Use the document.$id
      updatedData
    );
    console.log('User profile updated successfully');
    return response;
  } catch (error) {
    console.log('Failed to update user info', error);
    throw error;
  }
}

export async function uploadPhoto(photoUri: string) {
  try {
    // Log the URI to check if it's valid
    console.log('Processed Photo URI:', photoUri);

    // Create a FormData object to upload the file
    const formData = new FormData();

    // Append the file to the FormData with the correct fileId and file attributes
    formData.append('fileId', ID.unique()); // Generate a unique fileId
    formData.append('file', {
      uri: photoUri,
      name: `photo_${Date.now()}.jpg`, // Set a unique name
      type: 'image/jpeg', // Set the MIME type
    });

    // Perform the file upload to Appwrite
    const response = await fetch(
      'https://cloud.appwrite.io/v1/storage/buckets/669e0b5000145d872e7c/files',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Appwrite-Project': '66bb50ba003a365f917d', // Replace with your Appwrite project ID
        },
        body: formData,
      }
    );

    // Check if response is successful
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Failed to upload file: ${errorResponse.message}`);
    }

    // Parse the response JSON if the file upload is successful
    const file = await response.json();
    console.log('Uploaded File:', file);

    return file;
  } catch (error) {
    console.error('Failed to upload photo:', error);
    throw new Error(`Failed to upload photo: ${error.message}`);
  }
}

export async function searchPosts(query: string) {
  try {
    const posts = await databases.listDocuments(
      '669a5a3d003d47ff98c7', // Database ID
      '', // Collection ID, messages
      [Query.search('title', query)]
    );
    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
}
