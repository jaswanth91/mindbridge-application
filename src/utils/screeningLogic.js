/**
 * MindBridge Clinical Screening Logic
 * Based on PHQ-9, GAD-7, and GHQ-12 standards.
 */

export const SCORING_LEVELS = {
  PHQ9: {
    MINIMAL: { min: 0, max: 4, label: 'Minimal Depression', color: 'text-mb-mint' },
    MILD: { min: 5, max: 9, label: 'Mild Depression', color: 'text-mb-lavender' },
    MODERATE: { min: 10, max: 14, label: 'Moderate Depression', color: 'text-mb-sky' },
    MOD_SEVERE: { min: 15, max: 19, label: 'Moderately Severe Depression', color: 'text-mb-blush' },
    SEVERE: { min: 20, max: 27, label: 'Severe Depression', color: 'text-red-400' },
  },
  GAD7: {
    MINIMAL: { min: 0, max: 4, label: 'Minimal Anxiety', color: 'text-mb-mint' },
    MILD: { min: 5, max: 9, label: 'Mild Anxiety', color: 'text-mb-lavender' },
    MODERATE: { min: 10, max: 14, label: 'Moderate Anxiety', color: 'text-mb-sky' },
    SEVERE: { min: 15, max: 21, label: 'Severe Anxiety', color: 'text-red-400' },
  }
};

export const calculateResult = (type, score) => {
  const levels = SCORING_LEVELS[type];
  for (const level in levels) {
    if (score >= levels[level].min && score <= levels[level].max) {
      return levels[level];
    }
  }
  return null;
};

export const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];

export const OPTIONS = [
  { value: 0, labelEn: "Not at all", labelTa: "இல்லவே இல்லை" },
  { value: 1, labelEn: "Several days", labelTa: "சில நாட்கள்" },
  { value: 2, labelEn: "More than half the days", labelTa: "பாதிக்கும் மேலான நாட்கள்" },
  { value: 3, labelEn: "Nearly every day", labelTa: "கிட்டத்தட்ட தினமும்" }
];
