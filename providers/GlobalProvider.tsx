import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from 'expo-router';
import { account, signIn } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [challengeId, setChallengeId] = useState(null);

  const signIn = async (email: string, password: string) => {
    try {
      // Attempt to sign in with email and password
      await account.createEmailPasswordSession(email, password);

      // Check if the user has MFA enabled
      const factors = await account.listMfaFactors();
      if (factors.totp || factors.email || factors.phone) {
        throw { type: 'user_more_factors_required' };
      }

      // If no exception is thrown, the user is signed in without needing MFA
      setIsLogged(true);
      router.push('/home');
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
    await account.deleteSession('current')
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
    account.get()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
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
        completeMfa
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;