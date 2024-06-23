import { Redirect } from "expo-router";
import { useState } from "react";
import {Client, Account, ID} from "react-native-appwrite"

let client;
let account;

client = new Client()
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66694f2c003d7561352e")
  .setPlatform("com.crunchtime-Driver.app")

  account = new Client(account)

export default function Index() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null)
  const [userDetails, setUserDetails] = useState(null)

  //create a new appwrite account
  async function createAccount(){
    await account.create(ID.unique(), email, password, name)
    console.log("Successfully created accont");
  }

  //sign in with email and password
  async function signIn(){
    await account.createEmailSession(email, password)
    setUserDetails(await account.get()) //add try and catch
  }

  //signout

  async function signOut(){
    await account.deleteSessions()
    setUserDetails(null)
  }

  return <Redirect href={'/home'} />
}
