import React, { useState } from 'react';
import { Briefcase, Plus, BrainCircuit, Sparkles, X } from 'lucide-react';
import { MatchResult, Job } from '../../types';
import CandidateProfile from './CandidateProfile';
import JobDescriptionGenerator from './JobDescriptionGenerator';
import { fetchEmployerApplications } from '../../services/dbService';
import { auth } from '../../firebase';

interface EmployerDashboardProps {
  jobs: Job[];
  selectedJob: Job | null;
  setSelectedJob: (job: Job) => void;
  matches: MatchResult[];
  selectedMatch: MatchResult | null;
  setSelectedMatch: (match: MatchResult) => void;
  isJobModalOpen: boolean;
  setIsJobModalOpen: (open: boolean) => void;
  newJob: Partial<Job>;
  setNewJob: (job: Partial<Job>) => void;
  handleCreateJob: () => void;
  isAiExplaining: boolean;
  aiExplanation: string;
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  jobs, selectedJob, setSelectedJob,
  matches, selectedMatch, setSelectedMatch,
  isJobModalOpen, setIsJobModalOpen,
  newJob, setNewJob, handleCreateJob,
  isAiExplaining, aiExplanation
}) => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);

  // Fetch employer applications
  React.useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    let mounted = true;
    fetchEmployerApplications(uid).then((res) => {
      if (!mounted) return;
      setApplications(res || []);
    }).catch(err => console.error('Error loading applications', err));
    return () => { mounted = false; };
  }, [selectedJob]);

  // Close applicant modal with Escape key
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedApplicant(null);
    };
    if (selectedApplicant) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedApplicant]);

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Left Sidebar - Active Vacancies */}
      <div className="lg:col-span-4 space-y-6">
        <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 overflow-hidden relative">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-100 text-indigo-600">
                <Briefcase size={20}/>
              </div>
              <h2 className="text-xl font-black text-slate-900">Active Vacancies</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsJobModalOpen(true)} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                <Plus size={20} />
              </button>
              <button onClick={() => setShowGenerator(true)} className="p-2 bg-white text-indigo-600 rounded-xl hover:bg-slate-50 transition-all border border-slate-100">
                JD
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {jobs.map(job => (
              <button key={job.job_id} onClick={() => setSelectedJob(job)} className={`w-full p-5 rounded-3xl text-left transition-all relative ${selectedJob?.job_id === job.job_id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                <div className="flex justify-between items-start mb-2">
                   <div className="font-black text-lg leading-none">{job.title}</div>
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${selectedJob?.job_id === job.job_id ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {job.location} • {job.experience_required}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-6">
         {/* Context Header */}
         <div className="rounded-[32px] p-10 text-white shadow-2xl overflow-hidden relative transition-all duration-700 bg-indigo-600">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="text-white animate-pulse" size={32} />
                <div className="text-sm font-black tracking-widest uppercase opacity-70">
                  Hiring Intelligence: {selectedJob?.title}
                </div>
            </div>
            <h2 className="text-4xl font-black mb-4">
              {matches.length} Candidates Screened
            </h2>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full translate-x-20 -translate-y-20"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          

          {/* Match Analysis / Applications */}
          
          {/* Applications list for selected job */}
          <div className="lg:col-span-8">
            <section className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg">Applications</h3>
                <div className="text-sm text-slate-400">{applications.length} total</div>
              </div>
              {selectedJob ? (
                <div>
                  {applications.filter(a => a.job_id === selectedJob.job_id).length === 0 ? (
                    <div className="text-slate-500">No applications yet for this vacancy.</div>
                  ) : (
                    <div className="divide-y">
                      {applications.filter(a => a.job_id === selectedJob.job_id).map(app => (
                        <div key={app.application_id} className="py-4 flex items-center justify-between">
                          <div>
                            <div className="font-black">{app.candidate_name || app.candidate_profile?.name || 'Applicant'}</div>
                            <div className="text-sm text-slate-400">{new Date(app.applied_at).toLocaleString()}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedApplicant(app.candidate_profile)} className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded">View Profile</button>
                            <button className="px-3 py-2 border rounded">Mark Reviewed</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500">Select a vacancy to see its applications.</div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* CREATE JOB MODAL */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsJobModalOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl relative z-10 p-10 overflow-hidden border border-slate-100">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">New Vacancy</h2>
                  <p className="text-slate-400 font-medium">Define your target professional profile.</p>
               </div>
               <button onClick={() => setIsJobModalOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"><X size={24} className="text-slate-400" /></button>
            </div>
            <div className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Job Title" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none font-bold" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                  <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none font-bold" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})}>
                    <option>Remote</option><option>Bangalore</option><option>Hyderabad</option>
                  </select>
               </div>
               <input type="text" placeholder="Required Expertise (Comma separated)" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none font-bold" value={newJob.required_skills?.join(", ")} onChange={e => setNewJob({...newJob, required_skills: e.target.value.split(",").map(s => s.trim())})} />
               <button onClick={handleCreateJob} className="w-full py-6 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all mt-6">Publish Opportunity</button>
            </div>
          </div>
        </div>
      )}
      {showGenerator && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowGenerator(false)}></div>
          <div className="bg-white w-full max-w-3xl rounded-[24px] shadow-2xl relative z-10 p-6 overflow-hidden border border-slate-100">
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowGenerator(false)} className="p-2 bg-slate-50 rounded-lg">Close</button>
            </div>
            <JobDescriptionGenerator onClose={() => setShowGenerator(false)} />
          </div>
        </div>
      )}
      {/* Applicant profile modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedApplicant(null)}></div>
          <div className="bg-white w-full max-w-3xl rounded-[24px] shadow-2xl relative z-10 p-6 overflow-hidden border border-slate-100">
            <button onClick={() => setSelectedApplicant(null)} aria-label="Close profile" className="absolute top-4 right-4 p-2 bg-slate-50 rounded-lg shadow-sm">
              <X size={18} />
            </button>
            <div className="pt-4">
              <CandidateProfile candidate={selectedApplicant} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;