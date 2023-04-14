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
import Compressor from "compressorjs";
import axios from "axios";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(user) {
    return auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((cred) => {
        const uid = cred.user.uid;
        // upload image to storage
        const formData = new FormData();
        formData.append("image", user.image);
        axios
          .post(`${process.env.REACT_APP_API_BASE_URL}/upload`, formData, {
            "Content-type": "multipart/form-date",
          })
          .then((res) => {
            const image = res.data;
            // upload to database
            const uploadUserData = {
              id: uid,
              email: user.email,
              name: user.name,
              yearOfStudy: user.yearOfStudy,
              image: image,
            };
            axios
              .post(
                `${process.env.REACT_APP_API_BASE_URL}/profile`,
                uploadUserData,
                {
                  "Content-type": "application/json",
                }
              )
              .then((res) => {
                const tokens = res.data;
                console.log("User Created Successfully");
                // save tokens in local storage or cookies
                localStorage.setItem("accessToken", tokens.accessToken);
                localStorage.setItem("refreshToken", tokens.refreshToken);
                // update firebase auth info
                updateProfile(auth.currentUser, {
                  displayName: uploadUserData.name,
                  photoURL: image.url,
                }).then(() => {
                  console.log("User info added to Auth");
                });
              });
          });
      });
  }

  async function requestUpdate(userDoc, accessToken) {
    axios
      .patch(`${process.env.REACT_APP_API_BASE_URL}/update`, userDoc, {
        "Content-type": "application/json",
        "x-auth-token-header": accessToken,
      })
      .then((res) => {
        const user = res.data;
        console.log("User Updated Successfully");
        updateProfile(auth.currentUser, {
          displayName: user.name,
          photoURL: user.image.url,
        }).then(() => {
          console.log("User info added to Auth");
        });
      });
  }

  async function update(updates) {
    const uid = currentUser.uid;
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (updates.image) {
      // upload image to storage
      const formData = new FormData();
      formData.append("image", updates.image);
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/upload`, formData, {
          "Content-type": "multipart/form-date",
          headers: {
            "x-auth-token-header": `BEARER ${accessToken}`,
          },
        })
        .then((res) => {
          const image = res.data;
          // update on database
          const userDoc = {};
          userDoc["image"] = image;
          if (updates.name) userDoc.name = updates.name;
          if (updates.yearOfStudy) userDoc.yearOfStudy = updates.yearOfStudy;
          try {
            requestUpdate(userDoc, accessToken);
          } catch (err) {
            console.log(err);
          }
        });
    } else {
      // update on database
      const userDoc = {};
      if (updates.name) userDoc.name = updates.name;
      if (updates.yearOfStudy) userDoc.yearOfStudy = updates.yearOfStudy;
      axios
        .patch(`${process.env.REACT_APP_API_BASE_URL}/update`, userDoc, {
          "Content-type": "application/json",
          headers: {
            "x-auth-token-header": `BEARER ${accessToken}`,
          },
        })
        .then((res) => {
          const user = res.data;
          console.log("User Updated Successfully");
          updateProfile(auth.currentUser, {
            displayName: user.name,
          }).then(() => {
            console.log("User info added to Auth");
          });
        });
    }
  }

  async function login(user) {
    return auth
      .signInWithEmailAndPassword(user.email, user.password)
      .then((cred) => {
        axios
          .post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
            id: cred.user.uid,
          })
          .then((res) => {
            const tokens = res.data;
            // save tokens in local storage or cookies
            localStorage.setItem("accessToken", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);
          });
      });
  }

  async function logout() {
    const accessToken = localStorage.getItem("accessToken");
    await axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
        headers: {
          "x-auth-token-header": `BEARER ${accessToken}`,
        },
      })
      .then(() => {
        localStorage.setItem("accessToken", null);
        localStorage.setItem("refreshToken", null);
        console.log("logged out");
        return auth.signOut();
      });
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

export default AuthProvider;
