interface MNProfileViewProps {
    traitScores: Record<string, number>;
    onAskGPT?: (prompt: string) => void;
  }
  
  export default function MNProfileView({ traitScores }: MNProfileViewProps) {
    const traits = Object.entries(traitScores);
  
    return (
      <div className="max-w-2xl mx-auto p-10">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          🎯 Raw Trait Scores View
        </h2>
  
        {traits.length === 0 ? (
          <p className="text-center text-gray-500">No scores to display.</p>
        ) : (
          <ul className="space-y-6">
            {traits.map(([trait, score]) => (
              <li key={trait} className="bg-white p-4 shadow rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-medium text-gray-800">{trait}</span>
                  <span className="text-sm font-bold text-gray-600">{score.toFixed(2)}</span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${(score / 10) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  