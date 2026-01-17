// src/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile,
  sendEmailVerification,
  signOut
} from "firebase/auth";
// 1. Added 'updateDoc' to imports
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; 
import { auth, db } from "./firebase";

// --- SIGN UP ---
export const signupEmail = async (email, password, role, name) => {
  try {
    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Send Verification Email
    await sendEmailVerification(user);

    // 3. Update Display Name
    if (name) {
      await updateProfile(user, { displayName: name });
    }

    // 4. Save Role to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name || "",
      email: email,
      role: role,
      createdAt: new Date()
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// --- LOGIN (With Verification Check) ---
export const loginEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 1. BLOCK if email is not verified
    if (!user.emailVerified) {
      await signOut(auth); // Log them out immediately
      throw new Error("Email not verified. Please check your inbox.");
    }

    // 2. Get User Role
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    let role = 'candidate'; // Default fallback
    if (docSnap.exists()) {
      role = docSnap.data().role;
    }

    return { user, role };
  } catch (error) {
    throw error;
  }
};

// --- RESEND VERIFICATION EMAIL ---
export const resendVerificationEmail = async (email, password) => {
  try {
    // We must sign them in temporarily to send the email
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      throw new Error("This email is already verified!");
    }

    await sendEmailVerification(user);
    await signOut(auth); // Log out again for security
    return true;
  } catch (error) {
    throw error;
  }
};

// --- GOOGLE LOGIN ---
export const continueWithGoogle = async (preferredRole) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Google accounts are verified by default, so we don't need to check emailVerified here.

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    let finalRole = preferredRole;

    if (docSnap.exists()) {
      finalRole = docSnap.data().role;
    } else {
      await setDoc(docRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: preferredRole,
        createdAt: new Date()
      });
    }

    return { user, role: finalRole };
  } catch (error) {
    throw error;
  }
};

// --- NEW FUNCTION: UPDATE USER PROFILE ---
export const updateUserProfile = async (uid, profileData) => {
  try {
    const userRef = doc(db, "users", uid);

    // Prepare data, ensuring no 'undefined' values are sent to Firestore
    const cleanData = {
      bio: profileData.bio || "",
      skills: profileData.skills || [],
      experience_years: Number(profileData.experience_years) || 0,
      expected_salary: Number(profileData.expected_salary) || 0,
      preferred_locations: profileData.preferred_locations || [],
      preferred_roles: profileData.preferred_roles || [],
      education: profileData.education || {},
      contact_phone: profileData.contact_phone || "",
      contact_email: profileData.contact_email || "",
      updatedAt: new Date()
    };

    await updateDoc(userRef, cleanData);
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};