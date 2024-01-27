import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDxh14i2y8VwJ_PxUUQcQJngNBOsWBpUzc",
    authDomain: "litelearn-78140.firebaseapp.com",
    projectId: "litelearn-78140",
    storageBucket: "litelearn-78140.appspot.com",
    messagingSenderId: "604845283451",
    appId: "1:604845283451:web:0eb03d621e0b4e1eb1aade",
    measurementId: "G-2LH1RSCBXQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// setting up multer as a middleware to grab photo uploads
// const upload = multer({storage: multer.memoryStorage()})



