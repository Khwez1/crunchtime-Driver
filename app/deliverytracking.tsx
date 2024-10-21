// Import necessary modules and components
import Mapbox, { Camera, LocationPuck, MapView, PointAnnotation } from '@rnmapbox/maps';
import axios from 'axios';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';

// Set Mapbox access token
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

// Function to get location suggestions based on user input
const getSuggestions = async (query, proximity) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
      {
        params: {
          access_token: process.env.EXPO_PUBLIC_MAPBOX_KEY || '',
          autocomplete: true,
          limit: 5,
          proximity: `${proximity.longitude},${proximity.latitude}`,
        },
      }
    );
    return response.data.features;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

// Function to reverse geocode coordinates to an address
const reverseGeocode = async (longitude, latitude) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
      {
        params: {
          access_token: process.env.EXPO_PUBLIC_MAPBOX_KEY || '',
        },
      }
    );
    const address = response.data.features[0]?.place_name;
    return address;
  } catch (error) {
    console.error('Error reverse geocoding coordinates:', error);
    return null;
  }
};

// Main DeliveryTracking component
const DeliveryTracking = () => {
  // State variables
  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const [markerId, setMarkerId] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Effect hook to fetch user's current location on component mount
  useEffect(() => {
    const fetchUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    fetchUserLocation();
  }, []);

  // Handle input changes in the search box
  const handleInputChange = async (text) => {
    setQuery(text);
    if (text.length > 2) {
      const results = await getSuggestions(text, userLocation);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  // Handle selection of a suggestion
  const handleSuggestionPress = (suggestion) => {
    setQuery(suggestion.place_name);
    setSuggestions([]);
    setMarkerCoordinates(suggestion.geometry.coordinates);
    setMarkerId((prevId) => prevId + 1);
    setIsModalVisible(false);
  };

  // Handle using current location as the marker
  const handleUseCurrentLocation = async () => {
    if (userLocation) {
      setMarkerCoordinates([userLocation.longitude, userLocation.latitude]);
      setMarkerId((prevId) => prevId + 1);
      const address = await reverseGeocode(userLocation.longitude, userLocation.latitude);
      setQuery(address);
    }
  };

  // Show loading text if user location is not yet available
  if (!userLocation) {
    return <Text>Loading...</Text>;
  }

  // Main component render
  // return (
  //   <View style={{ flex: 1 }}>
  //     {/* Mapbox map component */}
  //     <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/standard">
  //       <Camera
  //         centerCoordinate={markerCoordinates || [userLocation.longitude, userLocation.latitude]}
  //         zoomLevel={14}
  //         animationDuration={1000}
  //       />
  //       <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
  //       {markerCoordinates && (
  //         <PointAnnotation id={`marker-${markerId}`} coordinate={markerCoordinates}>
  //           <Image source={require('~/assets/location_icon.png')} />
  //         </PointAnnotation>
  //       )}
  //     </MapView>

  //     {/* Modal for search input */}
  //     <Modal
  //       visible={isModalVisible}
  //       transparent
  //       animationType="slide"
  //       onRequestClose={() => setIsModalVisible(false)}>
  //       <View style={styles.modalContainer}>
  //         <View style={styles.modalContent}>
  //           <TextInput
  //             value={query}
  //             onChangeText={handleInputChange}
  //             placeholder="Enter an address"
  //             style={styles.textInput}
  //           />
  //           {suggestions.length > 0 && (
  //             <FlatList
  //               data={suggestions}
  //               keyExtractor={(item) => item.id}
  //               renderItem={({ item }) => (
  //                 <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
  //                   <Text style={styles.suggestionText}>{item.place_name}</Text>
  //                 </TouchableOpacity>
  //               )}
  //             />
  //           )}
  //           <Button title="Close" onPress={() => setIsModalVisible(false)} />
  //         </View>
  //       </View>
  //     </Modal>

  //     {/* Button to open the search modal */}
  //     <TouchableOpacity style={styles.buttonContainer} onPress={() => setIsModalVisible(true)}>
  //       <Text style={styles.buttonText}>Search Location</Text>
  //     </TouchableOpacity>

  //     {/* Button for using current location */}
  //     <TouchableOpacity
  //       style={[styles.buttonContainer, { bottom: 70 }]}
  //       onPress={handleUseCurrentLocation}>
  //       <Text style={styles.buttonText}>Use Current Location</Text>
  //     </TouchableOpacity>
  //   </View>
  // );
};

// Styles for the component
const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 10,
  },
  suggestionText: {
    padding: 10,
  },
});

export default DeliveryTracking;
