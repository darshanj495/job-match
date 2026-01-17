import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { db } from "../firebase";

// Fetch candidate user profiles from Firestore
export const fetchCandidates = async () => {
  try {
    const usersQuery = query(collection(db, 'users'), where('role', '==', 'candidate'));
    const snap = await getDocs(usersQuery);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching candidates', err);
    return [];
  }
};

// --- JOBS ---

// 1. Post a new Job (Employer)
export const postJobToFirestore = async (jobData, employerId) => {
  try {
    const docRef = await addDoc(collection(db, "jobs"), {
      ...jobData,
      employer_id: employerId,
      created_at: new Date().toISOString(),
      applicants: [] // Array to track applicant IDs
    });
    return { ...jobData, job_id: docRef.id };
  } catch (error) {
    console.error("Error posting job:", error);
    throw error;
  }
};

// 2. Fetch All Jobs (For Candidate Dashboard)
export const fetchAllJobs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      job_id: doc.id
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

// --- APPLICATIONS ---

// 3. Apply for a Job (Candidate)
export const applyForJob = async (jobId, candidateProfile) => {
  try {
    const candidateId = candidateProfile.uid || candidateProfile.id;
    // Check for existing application
    const existsQuery = query(collection(db, 'applications'), where('job_id', '==', jobId), where('candidate_id', '==', candidateId));
    const existsSnap = await getDocs(existsQuery);
    if (!existsSnap.empty) {
      // Already applied
      return { success: false, alreadyApplied: true };
    }

    // A. Create an Application Document
    // We store a SNAPSHOT of the candidate's profile at the time of application
    const docRef = await addDoc(collection(db, "applications"), {
      job_id: jobId,
      candidate_id: candidateId, // Handle both ID naming conventions
      candidate_name: candidateProfile.name,
      candidate_email: candidateProfile.email || "",
      candidate_profile: candidateProfile, // Full profile snapshot
      status: 'pending',
      applied_at: new Date().toISOString()
    });

    // B. Update the Job document to include this candidate's ID (optimization for queries)
    const jobRef = doc(db, "jobs", jobId);
    await updateDoc(jobRef, {
      applicants: arrayUnion(candidateId)
    });

    return { success: true, applicationId: docRef.id };
  } catch (error) {
    console.error("Error applying:", error);
    throw error;
  }
};

export const hasApplied = async (jobId, candidateId) => {
  try {
    const q = query(collection(db, 'applications'), where('job_id', '==', jobId), where('candidate_id', '==', candidateId));
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (err) {
    console.error('Error checking application existence', err);
    return false;
  }
};

// 4. Fetch Applications for an Employer's Jobs
export const fetchEmployerApplications = async (employerId) => {
  try {
    // First, find all jobs owned by this employer
    const jobsQuery = query(collection(db, "jobs"), where("employer_id", "==", employerId));
    const jobsSnapshot = await getDocs(jobsQuery);
    
    const jobIds = jobsSnapshot.docs.map(d => d.id);
    
    if (jobIds.length === 0) return [];

    // Then, find all applications where job_id is in that list
    // Note: Firestore 'in' query supports max 10 items. 
    // For production, you might structure this differently, but for this demo, it works.
    const appsQuery = query(collection(db, "applications"), where("job_id", "in", jobIds));
    const appsSnapshot = await getDocs(appsQuery);

    return appsSnapshot.docs.map(doc => ({
      application_id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};

  // --- GENERATED DESCRIPTIONS ---

  // Save a generated job description (backend-storable)
  export const saveGeneratedDescription = async (employerId, descData) => {
    try {
      const docRef = await addDoc(collection(db, "generated_descriptions"), {
        ...descData,
        employer_id: employerId,
        created_at: new Date().toISOString()
      });
      return { ...descData, id: docRef.id };
    } catch (error) {
      console.error('Error saving generated description:', error);
      throw error;
    }
  };

  export const fetchGeneratedDescriptions = async (employerId) => {
    try {
      const q = query(collection(db, 'generated_descriptions'), where('employer_id', '==', employerId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error fetching generated descriptions:', error);
      return [];
    }
  };