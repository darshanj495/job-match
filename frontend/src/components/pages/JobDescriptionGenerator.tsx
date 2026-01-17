import React, { useEffect, useMemo, useState } from 'react';
import { generateJobDescription } from '../../data/jobTemplates';
import { saveGeneratedDescription } from '../../services/dbService';

type Props = {
  onClose?: () => void;
  employerId?: string;
};

const JobDescriptionGenerator: React.FC<Props> = ({ onClose, employerId }) => {
  const [step, setStep] = useState(1);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('Tech');
  const [experience, setExperience] = useState<'Entry'|'Mid'|'Senior'>('Mid');
  const [skillsText, setSkillsText] = useState('');
  const [culture, setCulture] = useState<'Startup'|'Corporate'|'Remote-first'>('Startup');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [saved, setSaved] = useState(false);

  const skills = useMemo(() => skillsText.split(',').map(s => s.trim()).filter(Boolean), [skillsText]);

  const generated = useMemo(() => {
    if (!jobTitle) return null;
    return generateJobDescription({
      jobTitle,
      company,
      industry,
      experience,
      skills,
      culture,
      specialRequirements
    });
  }, [jobTitle, company, industry, experience, skills, culture, specialRequirements]);

  useEffect(() => {
    setSaved(false);
  }, [generated]);

  const handleSave = async () => {
    if (!generated) return;
    try {
      await saveGeneratedDescription(employerId || 'unknown', { input: { jobTitle, company, industry, experience, skills, culture, specialRequirements }, output: generated });
      setSaved(true);
    } catch (err) {
      console.error(err);
      setSaved(false);
    }
  };

  const handleCopy = async () => {
    if (!generated) return;
    const text = [generated.title, '\n\nAbout the Role:\n' + generated.about, '\n\nKey Responsibilities:\n' + generated.responsibilities.map(r => '- ' + r).join('\n'), '\n\nRequired Skills:\n' + generated.requiredSkills.join(', '), generated.preferredSkills.length ? ('\n\nPreferred Skills:\n' + generated.preferredSkills.join(', ')) : '', '\n\nExperience:\n' + generated.experience, '\n\nWhat We Offer:\n' + generated.benefits.map(b => '- ' + b).join('\n'), '\n\nAbout ' + (company || 'Company') + ':\n' + generated.aboutCompany].join('\n\n');
    await navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black">AI-Powered Job Description Generator</h3>
          <div className="text-sm text-slate-500">Step {step} / 3</div>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <input className="w-full p-3 border rounded" placeholder="Job Title (required)" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
            <input className="w-full p-3 border rounded" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
            <div className="grid grid-cols-3 gap-2">
              <select value={industry} onChange={e => setIndustry(e.target.value)} className="p-3 border rounded">
                <option>Tech</option>
                <option>Finance</option>
                <option>Healthcare</option>
                <option>Other</option>
              </select>
              <select value={experience} onChange={e => setExperience(e.target.value as any)} className="p-3 border rounded">
                <option>Entry</option>
                <option>Mid</option>
                <option>Senior</option>
              </select>
              <select value={culture} onChange={e => setCulture(e.target.value as any)} className="p-3 border rounded">
                <option value="Startup">Startup</option>
                <option value="Corporate">Corporate</option>
                <option value="Remote-first">Remote-first</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <label className="text-sm text-slate-600">Key Skills (comma separated, 3-10)</label>
            <input className="w-full p-3 border rounded" placeholder="e.g. Python, React, SQL" value={skillsText} onChange={e => setSkillsText(e.target.value)} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <label className="text-sm text-slate-600">Special Requirements (optional)</label>
            <textarea className="w-full p-3 border rounded" rows={3} value={specialRequirements} onChange={e => setSpecialRequirements(e.target.value)} />
          </div>
        )}

        <div className="flex items-center gap-2">
          {step > 1 && <button className="px-4 py-2 border rounded" onClick={() => setStep(step - 1)}>Back</button>}
          {step < 3 && <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => setStep(step + 1)}>Next</button>}
          {step === 3 && <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => setStep(3)}>Generate</button>}
          <div className="ml-auto flex items-center gap-2">
            <button className="px-3 py-2 border rounded" onClick={handleCopy} disabled={!generated}>Copy</button>
            <button className="px-3 py-2 border rounded" onClick={handleSave} disabled={!generated}>Save</button>
          </div>
        </div>

        <div className="mt-4 p-4 border rounded bg-slate-50 max-h-[360px] overflow-y-auto">
          {!generated ? (
            <div className="text-slate-400">Fill in the job title and skills to preview the description.</div>
          ) : (
            <div>
              <h4 className="font-black text-lg">{generated.title}</h4>
              <h5 className="mt-3 font-bold">About the Role</h5>
              <p className="text-sm text-slate-700">{generated.about}</p>
              <h5 className="mt-3 font-bold">Key Responsibilities</h5>
              <ul className="list-disc ml-6">{generated.responsibilities.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul>
              <h5 className="mt-3 font-bold">Required Skills</h5>
              <p>{generated.requiredSkills.join(', ')}</p>
              {generated.preferredSkills.length > 0 && (<>
                <h5 className="mt-3 font-bold">Preferred Skills</h5>
                <p>{generated.preferredSkills.join(', ')}</p>
              </>)}
              <h5 className="mt-3 font-bold">Experience</h5>
              <p>{generated.experience}</p>
              <h5 className="mt-3 font-bold">What We Offer</h5>
              <ul className="list-disc ml-6">{generated.benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}</ul>
              <h5 className="mt-3 font-bold">About {company || 'Company'}</h5>
              <p>{generated.aboutCompany}</p>
              {generated.specialRequirements ? (
                <>
                  <h5 className="mt-3 font-bold">Special Requirements</h5>
                  <p>{generated.specialRequirements}</p>
                </>
              ) : null}
              {saved && <div className="mt-3 text-sm text-green-600 font-bold">Saved</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionGenerator;
