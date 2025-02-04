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
import CryptoJS from 'crypto-js';
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
      '677d5197000b1aefb3d0', // Collection ID, messages
      ID.unique(),
      payload,
      Permissions
    );
  } catch (err) {
    console.log("Error! Couldn't send", err);
  }
}

// Get messages
export async function getMessages(activeOrderId: string) {
  try {
    const response = await databases.listDocuments(
      '669a5a3d003d47ff98c7', // Database ID
      '677d5197000b1aefb3d0', // Collection ID, messages
      [
        Query.orderDesc('$createdAt'),
        Query.equal('orderId', activeOrderId)
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
  try {
    await databases.deleteDocument(
      '669a5a3d003d47ff98c7', // Database ID
      '677d5197000b1aefb3d0', // Collection ID, messages
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
    // console.log(response.documents);
    if (response.documents.length > 0) {
      // console.log('User document retrieved:', response.documents[0]);
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

export async function getOrders() {
  try {
    const response = await databases.listDocuments(
      '669a5a3d003d47ff98c7',
      '6731ec1a001ab4994c0c',
      [
        Query.equal('orderStatus','READY_FOR_PICKUP')
      ]
    );
    
    const orders = response.documents.map((doc) => {
      // Handle restaurant parsing (it's an array)
      const restaurant = Array.isArray(doc.restaurant) 
        ? doc.restaurant[0] 
        : JSON.parse(doc.restaurant);

      // Parse user if needed
      const user = typeof doc.user === 'string'
        ? JSON.parse(doc.user)
        : doc.user;

      return {
        ...doc,
        restaurant,
        user
      };
    });

    return orders;
  } catch (error) {
    console.error('Failed to fetch orders: ', error);
    return [];
  }
}

export async function getOrder(id: string) {
  try {
    const response = await databases.listDocuments(
      '669a5a3d003d47ff98c7',
      '6731ec1a001ab4994c0c',
      [Query.equal('$id', id)]
    );

    // Ensure the response contains only one document
    const [doc] = response.documents;
    if (!doc) {
      console.warn(`No order found for ID: ${id}`);
      return null;
    }

    // Parse and validate restaurant
    let restaurant;
    try {
      const parsedRestaurant = typeof doc.restaurant === 'string' 
        ? JSON.parse(doc.restaurant) 
        : doc.restaurant;

      // Handle the case where restaurant is an array
      if (Array.isArray(parsedRestaurant)) {
        restaurant = parsedRestaurant[0]; // Use the first restaurant in the array
        if (!restaurant || typeof restaurant.lng !== 'number' || typeof restaurant.lat !== 'number') {
          console.warn('Invalid restaurant data:', restaurant);
          restaurant = null; // Default to null if validation fails
        }
      } else {
        console.warn('Restaurant is not an array:', parsedRestaurant);
        restaurant = null;
      }
    } catch (error) {
      console.warn('Error parsing restaurant data:', error);
      restaurant = null;
    }

    // Parse and validate user
    let user;
    try {
      user = typeof doc.user === 'string' ? JSON.parse(doc.user) : doc.user;
    } catch (error) {
      console.warn('Error parsing user data:', error);
      user = null;
    }

    if (doc?.otp) {
      // Using expo-crypto to hash the OTP
      doc.otp = CryptoJS.SHA256(doc.otp).toString(CryptoJS.enc.Base64);
    }

    // Return the normalized order
    return {
      ...doc,
      restaurant,
      user,
    };
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return null; // Return null in case of failure
  }
};

export async function getActiveOrder(driverId: string) {
  try {
    const response = await databases.listDocuments(
      '669a5a3d003d47ff98c7', // Database ID
      '6731ec1a001ab4994c0c', // Collection ID
      [
        Query.equal('driverId', driverId),
        Query.notEqual('orderStatus', 'CANCELLED'),
        Query.notEqual('orderStatus', 'NEW'),
        Query.notEqual('orderStatus', 'READY_FOR_PICKUP'),
        Query.notEqual('orderStatus', 'COMPLETED'),
      ]
    );

    // Ensure the response contains only one document
    const [activeOrder] = response.documents;
    if (!activeOrder) {
      // console.warn(`No active order found for driver ID: ${driverId}`);
      return null;
    }

    // Parse and validate restaurant
    let restaurant = null;
    try {
      const parsedRestaurant =
        typeof activeOrder.restaurant === 'string'
          ? JSON.parse(activeOrder.restaurant)
          : activeOrder.restaurant;

      if (Array.isArray(parsedRestaurant) && parsedRestaurant[0]) {
        const firstRestaurant = parsedRestaurant[0];
        if (typeof firstRestaurant.lng === 'number' && typeof firstRestaurant.lat === 'number') {
          restaurant = firstRestaurant;
        } else {
          console.warn('Invalid restaurant coordinates:', firstRestaurant);
        }
      } else if (!Array.isArray(parsedRestaurant)) {
        console.warn('Unexpected restaurant format:', parsedRestaurant);
      }
    } catch (error) {
      console.warn('Error parsing restaurant data:', error);
    }

    // Parse and validate user
    let user = null;
    try {
      user =
        typeof activeOrder.user === 'string'
          ? JSON.parse(activeOrder.user)
          : activeOrder.user;
    } catch (error) {
      console.warn('Error parsing user data:', error);
    }
    if (activeOrder?.otp) {
      // Using expo-crypto to hash the OTP
      activeOrder.otp = CryptoJS.SHA256(activeOrder.otp).toString(CryptoJS.enc.Base64);
    }
    // Return the normalized order
    return {
      ...activeOrder,
      restaurant,
      user,
    };
  } catch (error) {
    console.error('Failed to fetch active order:', error);
    return null; // Return null in case of failure
  }
};

export async function getOrdersHistory(driverId) {
  try {
    const response = await databases.listDocuments(
      '669a5a3d003d47ff98c7',
      '6731ec1a001ab4994c0c',
      [
        Query.equal('driverId', driverId),
        Query.equal('orderStatus','COMPLETED'),
      ]
    );
    
    const orders = response.documents.map((doc) => {
      // Handle restaurant parsing (it's an array)
      const restaurant = Array.isArray(doc.restaurant) 
        ? doc.restaurant[0] 
        : JSON.parse(doc.restaurant);

      // Parse user if needed
      const user = typeof doc.user === 'string'
        ? JSON.parse(doc.user)
        : doc.user;

      return {
        ...doc,
        restaurant,
        user
      };
    });
    console.log(orders);
    return orders;
  } catch (error) {
    console.error('Failed to fetch orders: ', error);
    return [];
  }
}