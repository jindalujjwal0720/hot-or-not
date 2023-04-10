import React, { useContext, useEffect, useState } from "react";
import { auth, firestore, storage } from "../utils/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { updateProfile } from "firebase/auth";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(user) {
    return auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((cred) => {
        const uid = cred.user.uid;
        // upload image to storage
        const imageRef = ref(storage, `user-images/${v4() + user.image.name}`);
        uploadBytes(imageRef, user.image).then(async (res) => {
          const imageURL = await getDownloadURL(imageRef);
          // upload to firestore
          const uploadUserData = {
            id: uid,
            email: user.email,
            name: user.name,
            yearOfStudy: user.yearOfStudy,
            firehearts: 300,
            image: imageURL,
            lastEdited: user.lastEdited,
          };
          const usersRef = doc(firestore, `users/${uid}`);
          setDoc(usersRef, uploadUserData).then(() => {
            console.log("User Created Successfully");
            updateProfile(auth.currentUser, {
              displayName: uploadUserData.name,
              photoURL: imageURL,
            }).then(() => {
              console.log("User info added");
            });
          });
        });
      });
  }

  function update(updates) {
    const uid = currentUser.uid;
    if (updates.image) {
      //delete old image from storage
      let imageID = currentUser.photoURL.substr(
        currentUser.photoURL.indexOf("%2F") + 3,
        currentUser.photoURL.indexOf("?") -
          (currentUser.photoURL.indexOf("%2F") + 3)
      );
      imageID = imageID.replace("%20", " ");
      const oldImageRef = ref(storage, `user-images/${imageID}`);
      deleteObject(oldImageRef).then(() => {
        // upload new image to storage
        const imageRef = ref(
          storage,
          `user-images/${v4() + updates.image.name}`
        );
        uploadBytes(imageRef, updates.image).then(async (res) => {
          const imageURL = await getDownloadURL(imageRef);
          // update on firestore
          const docRef = doc(firestore, `users/${uid}`);
          const userDoc = {};
          userDoc["image"] = imageURL;
          if (updates.name) userDoc.name = updates.name;
          if (updates.yearOfStudy) userDoc.yearOfStudy = updates.yearOfStudy;
          updateDoc(docRef, userDoc).then(() => {
            updateProfile(auth.currentUser, {
              displayName: updates.name ?? currentUser.displayName,
              photoURL: imageURL,
            }).then(() => {
              console.log("User info updated");
            });
          });
        });
      });
    } else {
      // update on firestore
      const docRef = doc(firestore, `users/${uid}`);
      const userDoc = {};
      if (updates.name) userDoc.name = updates.name;
      if (updates.yearOfStudy) userDoc.yearOfStudy = updates.yearOfStudy;
      updateDoc(docRef, userDoc).then(() => {
        updateProfile(auth.currentUser, {
          displayName: updates.name ?? currentUser.displayName,
        }).then(() => {
          console.log("User info updated");
        });
      });
    }
  }

  function login(user) {
    return auth.signInWithEmailAndPassword(user.email, user.password);
  }

  function logout() {
    console.log("logged out");
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    update,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
