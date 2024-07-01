import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { sendMessage, getMessages, deleteMessage, client} from '../lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useGlobalContext } from '../context/GlobalProvider';
import { Permission } from 'react-native-appwrite';

export default function Room() {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const {user} = useGlobalContext()

  useEffect(() => {
    fetchMessages();

    const unsubscribe = client.subscribe(`databases.${'66797c090028543355dd'}.collections.${'667e783500102010cd30'}.documents`, response => {

      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        console.log('A message was CREATED');
        setMessages(prevState => [response.payload, ...prevState]);
      }
      if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
        console.log('A message was DELETED');
        setMessages(messages => messages.filter(message => message.$id !== response.payload.$id))
      }
    });

    return () => {
      unsubscribe()
    }

  }, []);

  const fetchMessages = async () => {
    try {
      const messages = await getMessages();
      setMessages(messages)
    } catch (error) {
      Alert.alert('Failed to fetch messages:', error);
    }finally{
    console.log(messages);
    }
  };

  const handleDelete = async (message_id) => {
    try {
      await deleteMessage(message_id)
    } catch (error) {
      Alert.alert("Failed to delete!")
    }
  }

  const handleSubmit = async () => {
    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody
    }
    const Permissions = [
      Permission.write(Role.user(user.$id))
    ]
    setSubmitting(true);
    try {
      await sendMessage(payload, Permissions);
      Alert.alert('Success', 'Message sent!');
      setMessageBody('');
      fetchMessages(); // Refresh messages after sending a new one
    } catch (error) {
      Alert.alert('Error', 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={tw``}>
      <ScrollView>{/* main */}
        <View style={tw`p-8 bg-white`}>{/* room--container */}
          <View style={tw`flex flex-col gap-2 mb-8`}>{/* message--form */}
            <TextInput
              required
              style={tw`mt-7 border border-gray-300 p-4 rounded-lg`}
              maxLength={1000}
              placeholder="Message"
              value={messageBody}
              onChangeText={setMessageBody}
            />
          </View>
          <View style={tw`flex justify-end mb-8`}>{/* send-btn--wrapper */}
            <TouchableOpacity
              style={tw`w-full mt-7 p-4 bg-red-600 text-black font-semibold rounded-xl`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >{/* btn btn--secondary */}
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={tw`text-center text-white`}>Send</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View>
            {messages.map((message) => (
              <View key={message.$id} style={tw`flex flex-col gap-2 mb-4 p-4 bg-[rgba(27,27,39,1)] border border-[rgba(40,41,57,1)] rounded-lg`}>{/* message--wrapper */}
                <View style={tw`flex justify-between items-center mb-2`}>{/* message--header */}
                  <Text>
                    {message?.username ? (
                      <Text style={tw`text-white`}>{message.username}</Text>
                    ):(
                      <Text style={tw`text-white`}>
                        Anonymous user
                      </Text>
                    )}
                  </Text>
                  <Text style={tw`text-gray-400`}>{new Date(message.$createdAt).toLocaleString()}</Text>{/* message timestamp */}

                  {message.$permissions.includes(`delete(\"user:${user.id}\")`) && (
                  <TouchableOpacity
                    onPress={() => handleDelete(message.$id)}
                  >
                    <Ionicons name="trash-bin-sharp" size={24} color="black" />
                  </TouchableOpacity>
                  )}

                </View>
                <View style={tw`p-4 bg-[rgba(219,26,90,1)] text-[rgb(226,227,232)] rounded-xl max-w-full`}>{/* message--body */}
                  <Text>{message.body}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
