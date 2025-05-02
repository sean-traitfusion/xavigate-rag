export default function AgentFeedback({ critique, followup }: { critique?: string, followup?: string }) {
    // console.log("🧠 AgentFeedback props:", { critique, followup }); // 🪵 Debug log
    return (
      <div className="p-4 bg-white rounded-lg shadow mt-4">
        <h2 className="text-md font-semibold text-gray-700">Agent Feedback</h2>
        {critique && (
          <div className="mt-2 text-sm text-red-700">
            <strong>Critique:</strong> {critique}
          </div>
        )}
        {followup && (
          <div className="mt-2 text-sm text-blue-700">
            <strong>Suggested Next Step:</strong> {followup}
          </div>
        )}
        {!critique && !followup && (
          <p className="text-sm text-gray-500">Awaiting agent feedback...</p>
        )}
      </div>
    );
  }