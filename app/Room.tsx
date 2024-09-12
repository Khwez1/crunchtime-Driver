import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { sendMessage, getMessages, deleteMessage, client} from '../lib/appwrite';
import { useGlobalContext } from '~/providers/GlobalProvider';
import { Permission, Role } from 'react-native-appwrite';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Room() {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const {user} = useGlobalContext()

  useEffect(() => {
    fetchMessages();

    const unsubscribe = client.subscribe(`databases.${'669a5a3d003d47ff98c7'}.collections.${'66d053d10001a7923c43'}.documents`, response => {

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

  const handleDelete = async (message_id: string) => {
    try {
      await deleteMessage(message_id)
    } catch (error) {
      Alert.alert("Failed to delete!")
    }
  }

  const handleSubmit = async () => {
    const payload = {
      user_Id: user.$id,
      username: user.name,
      Body: messageBody
    }

    const Permissions = [
      Permission.write(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id))
    ];

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
    <SafeAreaView>
      <ScrollView>{/* main */}
        <View className="p-8 bg-white">{/* room--container */}

          <View className="flex flex-col gap-2 mb-8">{/* message--form */}
            <TextInput
              required
              className="mt-7 border border-gray-300 p-4 rounded-lg"
              maxLength={1000}
              placeholder="Message"
              value={messageBody}
              onChangeText={setMessageBody}
            />
          </View>

          <View className="flex justify-end mb-8">{/* send-btn--wrapper */}
            <TouchableOpacity
              className="w-full mt-7 p-4 bg-red-600 text-black font-semibold rounded-xl"
              onPress={handleSubmit}
              disabled={isSubmitting}
            >{/* btn btn--secondary */}
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center text-white">Send</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View>
            {messages.map((message) => (
              <View key={message.$id} className="flex flex-col gap-2 mb-4 p-4 bg-[rgba(27,27,39,1)] border border-[rgba(40,41,57,1)] rounded-lg">{/* message--wrapper */}
                <View className="flex justify-between items-center mb-2">{/* message--header */}
                  <Text>
                    {message?.username ? (
                      <Text className="text-white">{message.username}</Text>
                    ):(
                      <Text className="text-white">
                        Anonymous user
                      </Text>
                    )}
                  </Text>
                  <Text className="text-gray-400">{new Date(message.$createdAt).toLocaleString()}</Text>{/* message timestamp */}

                  {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                  <TouchableOpacity
                    onPress={() => handleDelete(message.$id)}
                  >
                    <FontAwesome name="trash" size={24} color="grey" />
                  </TouchableOpacity>
                  )}

                </View>
                <View className="p-4 bg-[rgba(219,26,90,1)] text-[rgb(226,227,232)] rounded-xl max-w-full">{/* message--body */}
                  <Text>{message.Body}</Text>
                </View>
              </View>
            ))}
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
