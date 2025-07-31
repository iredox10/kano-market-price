
import { Client, Account, Databases, Functions, Storage } from 'appwrite';
import { Users } from 'node-appwrite'

const client = new Client();

const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT, // e.g., https://cloud.appwrite.io/v1
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
};

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);
export const users = new Users(client)


export default client;
