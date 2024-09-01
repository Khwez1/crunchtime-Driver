import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, TextInput, Alert, StyleSheet } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { fetchProfile, updateProfile } from '../../lib/appwrite';
import { useGlobalContext } from '~/providers/GlobalProvider';
import { uploadPhoto, storage } from '../../lib/appwrite';

export default function Profile() {
  const { user, signOut } = useGlobalContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Camera-related state
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    if (user && user.$id) {
      getProfile(user.$id);
    } else {
      setLoading(false);
    }
  }, [user]);

  const getProfile = async (userId) => {
    try {
      const fetchedProfile = await fetchProfile(userId);
      setProfile(fetchedProfile);
      setNewUsername(fetchedProfile.username);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      const updatedData = { username: newUsername, email:newEmail };
      const response = await updateProfile(profile.$id, updatedData);
      setProfile(response);
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    if (permission?.granted) {
      setIsCameraVisible(true);
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      console.log('Photo taken:', photo);
      setIsCameraVisible(false);
  
      try {
        const uploadedFile = await uploadPhoto(photo.uri);
  
        // Construct the file URL
        const newAvatarUrl = `https://cloud.appwrite.io/v1/storage/buckets/66bc6f82001a5b627b81/files/${uploadedFile.$id}/view`;
  
        // Update profile with the new avatar URL
        await updateProfile(profile.$id, { avatarUrl: newAvatarUrl });
        setProfile({ ...profile, avatarUrl: newAvatarUrl });
  
        Alert.alert('Success', 'Profile picture updated successfully!');
      } catch (error) {
        console.error('Failed to upload photo:', error);
        Alert.alert('Error', 'Failed to upload photo.');
      }
    }
  };
  
  
  

  const closeCamera = () => {
    setIsCameraVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!user || !profile) {
    return (
      <SafeAreaView>
        <ScrollView>
          <Text>Please log in to view your profile</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 16 }}>
          <Image
            source={{
              uri: `https://cloud.appwrite.io/v1/avatars/initials?name=${encodeURIComponent(
                profile.username
              )}&project=66694f2c003d7561352e`,
            }}
            style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 16 }}
          />
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
            👋Welcome! {profile.username}
          </Text>

          {editMode ? (
            <View style={{ marginBottom: 16 }}>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="New username"
              />
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="New email"
              />

              <TouchableOpacity
                style={{ backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, marginBottom: 8 }}
                onPress={handleUpdateProfile}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8 }}
                onPress={() => setEditMode(false)}
              >
                <Text style={{ textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{ backgroundColor: '#2196F3', padding: 12, borderRadius: 8, marginBottom: 16 }}
              onPress={() => setEditMode(true)}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Edit Profile</Text>
            </TouchableOpacity>
          )}

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>Username:</Text>
            <Text>{profile.username}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>Email:</Text>
            <Text>{profile.email}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>phone:</Text>
            <Text>{profile.phone}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>Account ID:</Text>
            <Text>{profile.accountId}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>Avatar:</Text>
            <Text>{profile.avatar}</Text>
          </View>



          <TouchableOpacity
            style={{ backgroundColor: '#f44336', padding: 16, borderRadius: 8, marginTop: 16 }}
            onPress={() => signOut()}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Log Out</Text>
          </TouchableOpacity>

          {/* Button to open camera */}
          <TouchableOpacity
            style={{
              backgroundColor: '#4CAF50',
              padding: 12,
              borderRadius: 8,
              marginTop: 16,
              alignItems: 'center',
            }}
            onPress={openCamera}
          >
            <Text style={{ color: '#fff' }}>Open Camera</Text>
          </TouchableOpacity>

          {/* Camera View */}
          {isCameraVisible && (
            <View style={{ marginTop: 20 }}>
              <CameraView
                style={{ width: '100%', height: 300 }}
                facing={facing}
                ref={(ref) => setCameraRef(ref)}
              >
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
                    <Text style={styles.text}>Take Picture</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cameraButton} onPress={closeCamera}>
                    <Text style={styles.text}>Close Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cameraButton} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
                    <Text style={styles.text}>Flip Camera</Text>
                  </TouchableOpacity>
                </View>
              </CameraView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  cameraButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});
