import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from 'expo-router';
import { account, ID, databases, avatars } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [challengeId, setChallengeId] = useState(null);

  // Register
  async function Register(email: string, password: string, username: string, phone: string) {
    try {
      // Step 1: Create the user account
      await account.create(ID.unique(), email, password, username);
      console.log('Account created!');

      // Step 2: Sign in to get session and set user
      await account.createEmailPasswordSession(email, password);
      const user = await account.get(); // Fetch user details after creating a session
      setUser(user);

      // Step 3: Update the user's phone number
      await account.updatePhone(phone, password);
      await account.createPhoneVerification();

      // Step 4: Create a user document in the database
      await databases.createDocument(
        '669a5a3d003d47ff98c7', // Database ID
        '66bc885a002d237e96b9', // Collection ID (Users)
        ID.unique(),
        {
          driverId: user.$id,
          name: username,
          email: email,
          phone: phone,
          pfp: avatars.getInitials(username),
          createdAt: new Date().toISOString()
        }
      );
      console.log('Document created with user details!');

      // Consider the account "MFA-enabled" based on phone verification
      console.log('Please verify your phone number to continue.');
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Attempt to sign in with email and password
      await account.createEmailPasswordSession(email, password);
      const user = await account.get(); // Fetch user details
      setUser(user);
      // Check if the user has MFA enabled
      const factors = await account.listMfaFactors();
      if (factors.totp || factors.email || factors.phone) {
        throw { type: 'user_more_factors_required' };
      }
      // If no exception is thrown, the user is signed in without needing MFA
      setIsLogged(true);
      router.push('/');
    } catch (error) {
      if (error.type === 'user_more_factors_required') {
        try {
          // If more factors are required, create an MFA challenge using phone
          const challenge = await account.createMfaChallenge('phone');
          // Store the challenge ID for later use
          setChallengeId(challenge.$id);
          // Notify the user and redirect to the MFA screen
          console.log('OTP Sent', 'Please check your phone for the OTP.');
          router.push('/mfa');
        } catch (mfaError) {
          console.error('Failed to create MFA challenge:', mfaError);
          throw mfaError;
        }
      } else {
        console.error('Failed to sign in:', error);
        throw error;
      }
    }
  };

  const signOut = async () => {
    await account.deleteSession('current');
    setUser(null);
    setIsLogged(false);
    router.push('/');
  };

  const completeMfa = async (otp: string) => {
    try {
      const response = await account.updateMfaChallenge(challengeId, otp);
      // Successfully authenticated
      console.log('Success', 'You have been authenticated successfully.');
      setIsLogged(true);
      router.push('/home');
    } catch (error) {
      console.error('Failed to complete MFA challenge:', error);
      console.log('Error', 'Failed to verify OTP. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await account.get();
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        challengeId,
        setChallengeId,
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        signOut,
        signIn,
        Register,
        completeMfa
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;