interface MNProfileViewProps {
    traitScores: Record<string, number>;
    onAskGPT?: (prompt: string) => void;
  }
  
  const MULTIPLE_INTELLIGENCES = [
    "Gross Bodily", "Fine Bodily", "Interpersonal", "Logical", "Linguistic",
    "Graphic Visual", "Spatial Visual", "Musical", "Intrapersonal", "Naturalistic"
  ];
  
  const MULTIPLE_NATURES = [
    "Protective", "Educative", "Administrative", "Creative", "Healing",
    "Entertaining", "Providing", "Entrepreneurial", "Adventurous"
  ];
  
  function Bar({ label, score }: { label: string; score: number }) {
    return (
      <li className="bg-white px-6 py-4 shadow rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-base font-medium text-gray-800">{label}</span>
          <span className="text-sm font-bold text-gray-600">{score.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${(score / 10) * 100}%` }}
          />
        </div>
      </li>
    );
  }
  
  export default function MNProfileView({ traitScores, onAskGPT }: MNProfileViewProps) {
    const askAI = () => {
      const prompt = `You are a career coach. This person's MN trait profile (on a 10-point scale):
  
  ${Object.entries(traitScores)
    .map(([trait, score]) => `- ${trait}: ${score.toFixed(2)}`)
    .join("\n")}
  
  Based on this, suggest career paths, work environments, or strengths.`;
  
      onAskGPT?.(prompt);
    };
  
    return (
      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-4xl font-bold text-center text-indigo-800 mb-10">Your MN Profile</h2>
  
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-700 uppercase mb-6 border-b pb-2">
            Multiple Intelligences
          </h3>
          <ul className="space-y-4">
            {MULTIPLE_INTELLIGENCES.map((trait) => (
              <Bar key={trait} label={trait} score={traitScores[trait] ?? 0} />
            ))}
          </ul>
        </section>
  
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-700 uppercase mb-6 border-b pb-2">
            Multiple Natures
          </h3>
          <ul className="space-y-4">
            {MULTIPLE_NATURES.map((trait) => (
              <Bar key={trait} label={trait} score={traitScores[trait] ?? 0} />
            ))}
          </ul>
        </section>
  
        <div className="text-center">
          <button
            onClick={askAI}
            className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded shadow hover:bg-indigo-700 transition"
          >
            💬 Ask AI: What careers fit my profile?
          </button>
        </div>
      </div>
    );
  }
  