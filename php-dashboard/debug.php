<?php
echo "<style>
body { font-family: sans-serif; padding: 20px; }
pre { background: #f4f4f4; padding: 15px; border-radius: 8px; overflow-x: auto; }
h3 { margin-top: 2em; }
</style>";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once "config.php";

$uuid = $_GET['uuid'] ?? null;
if (!$uuid) {
    die("Missing ?uuid= parameter");
}

// Pull persistent memory
$stm = $pdo->prepare("SELECT initial_personality_scores, preferences FROM user_memory WHERE uuid = :uuid");
$stm->execute(['uuid' => $uuid]);
$persistent = $stm->fetch(PDO::FETCH_ASSOC);

// Pull session memory
$stm = $pdo->prepare("SELECT conversation_log, interim_scores FROM session_memory WHERE uuid = :uuid");
$stm->execute(['uuid' => $uuid]);
$session = $stm->fetch(PDO::FETCH_ASSOC);

// Decode JSON fields inside persistent memory
if (!empty($persistent['initial_personality_scores'])) {
    $persistent['initial_personality_scores'] = json_decode($persistent['initial_personality_scores'], true);
}
if (!empty($persistent['preferences'])) {
    $persistent['preferences'] = json_decode($persistent['preferences'], true);
}

// Decode JSON fields inside session memory
if (!empty($session['conversation_log'])) {
    $session['conversation_log'] = json_decode($session['conversation_log'], true);
}
if (!empty($session['interim_scores'])) {
    $session['interim_scores'] = json_decode($session['interim_scores'], true);
}

// Prepare conversation data
$conversation_raw = $session['conversation_log'] ?? [];
$conversation = is_string($conversation_raw)
    ? json_decode($conversation_raw, true)
    : $conversation_raw;

$log = $conversation;

$system_prompt = $log['system_prompt'] ?? null;
$final_prompt = $log['final_prompt'] ?? null;
$critique = $log['critique'] ?? null;
$followup = $log['followup'] ?? null;
$goal = '';
if (isset($log['goal_setter'])) {
    if (is_array($log['goal_setter'])) {
        $goal = json_encode($log['goal_setter']);
    } elseif (is_string($log['goal_setter'])) {
        $goal = htmlspecialchars($log['goal_setter']);
    }
}
$plan_snapshot = $log['plan_snapshot'] ?? null;
$system_prompt = $log['system_prompt'] ?? null;
$final_prompt = $log['final_prompt'] ?? null;
$avatar_profile = $log['avatar_profile'] ?? null;
// Fallback to persistent preferences if session avatar not set
if (empty($avatar_profile) && !empty($persistent['preferences']['avatar_profile'])) {
    $avatar_profile = $persistent['preferences']['avatar_profile'];
}
$synthesized = $log['synthesized_persistent_update'] ?? null;
$active_tags = $log['active_tags'] ?? null;
$recent_tags = $log['recent_tags'] ?? null;
$tag_timeline = $log['tag_timeline'] ?? [];


// Display conversation history: support both 'exchanges' and 'messages' formats
if (!empty($conversation['exchanges'])) {
    echo "<h3>Conversation Exchanges</h3>";
    foreach ($conversation['exchanges'] as $i => $exchange) {
        echo "<strong>Exchange " . ($i + 1) . "</strong><br>";
        echo "<em>User:</em> " . htmlspecialchars($exchange['user_prompt'] ?? '') . "<br>";
        echo "<em>Assistant:</em> " . htmlspecialchars($exchange['assistant_response'] ?? '') . "<br><br>";
    }
} elseif (!empty($conversation['messages'])) {
    echo "<h3>Conversation Messages</h3>";
    foreach ($conversation['messages'] as $i => $msg) {
        echo "<strong>Message " . ($i + 1) . "</strong><br>";
        echo "<em>" . ucfirst(htmlspecialchars($msg['sender'] ?? '')) . ":</em> " . htmlspecialchars($msg['text'] ?? '') . "<br>";
        if (!empty($msg['sources'])) {
            echo "<em>Sources:</em><ul>";
            foreach ($msg['sources'] as $source) {
                $term = $source['term'] ?? ($source['metadata']['term'] ?? '');
                echo "<li>" . htmlspecialchars($term) . "</li>";
            }
            echo "</ul>";
        }
        if (!empty($msg['followup'])) {
            echo "<em>Follow-up:</em> " . htmlspecialchars($msg['followup']) . "<br>";
        }
        echo "<br>";
    }
}
$synthesized = $conversation['synthesized_persistent_update'] ?? null;

echo "<h3>Plan Snapshot</h3>";
echo pretty_json($plan_snapshot);

echo "<h3>System Prompt</h3>";
echo $system_prompt ? pretty_json($system_prompt) : "<em>No system prompt stored.</em>";

echo "<h3>Avatar Profile Used in This Session</h3>";
echo pretty_json($avatar_profile);

echo "<h3>Final Prompt Sent to GPT</h3>";
echo pretty_json($final_prompt);

echo "<h3>Active Tags Emphasized This Session</h3>";
echo pretty_json($active_tags);

echo "<h3>Recent Tags (Trait History)</h3>";
echo pretty_json($recent_tags);

if (!empty($final_prompt)) {
    $encoded_prompt = rawurlencode($final_prompt);
    echo "<a href='data:text/plain;charset=utf-8,{$encoded_prompt}' download='final_prompt.txt'>Download Final Prompt</a><br>";
} else {
    echo "<em>No final prompt available for download.</em><br>";
}

echo "<h3>Inferred Session Goal</h3>";
echo $goal ? pretty_json($goal) : "<em>No goal inferred.</em>";

echo "<h3>Critique (Agent Feedback on Assistant's Response)</h3>";
echo $critique ? pretty_json($critique) : "<em>No critique found.</em>";

echo "<h3>Follow-Up (Agent-Generated Next Question)</h3>";
echo $followup ? pretty_json($followup) : "<em>No follow-up found.</em>";

if (!empty($tag_timeline['new_tags'])) {
    echo "<strong style='color:green;'>New Tags:</strong> " . implode(', ', $tag_timeline['new_tags']) . "<br>";
}
if (!empty($tag_timeline['removed_tags'])) {
    echo "<strong style='color:red;'>Removed Tags:</strong> " . implode(', ', $tag_timeline['removed_tags']) . "<br>";
}

echo "<h3>Synthesized Persistent Memory (From This Session)</h3>";
echo pretty_json($synthesized);

function pretty_json($data)
{
    if (!$data) {
        return "<pre><em>No data found.</em></pre>";
    }

    // Try decoding JSON-encoded string first
    if (is_string($data)) {
        $decoded = json_decode($data, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return "<pre style='white-space: pre-wrap; word-wrap: break-word;'>" .
                json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) .
                "</pre>";
        }

        // Fallback to plain string rendering
        return "<pre style='white-space: pre-wrap; word-wrap: break-word;'>" .
            htmlspecialchars($data) .
            "</pre>";
    }

    // Handle array/object input directly
    if (is_array($data) || is_object($data)) {
        return "<pre style='white-space: pre-wrap; word-wrap: break-word;'>" .
            json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) .
            "</pre>";
    }

    // Final fallback
    return "<pre><em>Unable to display</em>: " . htmlspecialchars((string)$data) . "</pre>";
}

echo "<h1>Xavigate Debug Dashboard</h1>";
echo "<h2>UUID: " . htmlspecialchars($uuid) . "</h2>";

echo "<h3>Persistent Memory</h3>";
echo pretty_json(json_encode($persistent));

echo "<h3>Session Memory</h3>";
echo pretty_json(json_encode($session));

// Show backend file-based user profile (in dev mode)
echo "<h3>User Profile File (backend/memory/data)</h3>";
$profile_path = __DIR__ . '/../backend/memory/data/user_' . $uuid . '.json';
if (file_exists($profile_path)) {
    $file_contents = file_get_contents($profile_path);
    echo "<pre style='white-space: pre-wrap; word-wrap: break-word;'>" . htmlspecialchars($file_contents) . "</pre>";
} else {
    echo "<p><em>No file-based user profile found at <code>" . htmlspecialchars($profile_path) . "</code>.</em></p>";
}
