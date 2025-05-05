<?php
require_once "config.php";

// Fetch the 5 most recent UUIDs and user preferences from session_memory and user_memory
$recent_stm = $pdo->prepare("
    SELECT sm.uuid, sm.session_start, sm.conversation_log, um.preferences
    FROM session_memory sm
    LEFT JOIN user_memory um ON sm.uuid = um.uuid
    ORDER BY sm.session_start DESC
    LIMIT 5
");
$recent_stm->execute();
$recent_sessions = $recent_stm->fetchAll(PDO::FETCH_ASSOC);
?>

<h1>Xavigate Debug Dashboard</h1>

<form method="GET" action="debug.php">
    <label for="uuid">Manually Enter UUID:</label>
    <input type="text" name="uuid" id="uuid" style="width: 400px;" required>
    <button type="submit">View</button>
</form>

<hr>

<h2>Recent Sessions</h2>
<ul>
    <?php foreach ($recent_sessions as $row): ?>
        <?php
        $uuid = htmlspecialchars($row['uuid']);
        $dt = new DateTime($row['session_start'], new DateTimeZone('UTC'));
        $dt->setTimezone(new DateTimeZone('Asia/Ho_Chi_Minh'));
        $timestamp = $dt->format("Y-m-d H:i");
        // Decode conversation log JSON
        $log = json_decode($row['conversation_log'], true);
        // Decode user preferences for fallback (e.g., avatar_profile)
        $preferences = [];
        if (!empty($row['preferences'])) {
            $preferences = json_decode($row['preferences'], true);
        }
        // Determine avatar: prefer session avatar, then user preferences, else Default
        $avatar = 'Default';
        if (isset($log['avatar_profile']) && is_array($log['avatar_profile'])) {
            $avatar_name = $log['avatar_profile']['name'] ?? 'Default';
            $tone = $log['avatar_profile']['tone'] ?? '';
            $avatar = htmlspecialchars(trim($avatar_name . ' (' . $tone . ')'));
        } elseif (isset($preferences['avatar_profile']) && is_array($preferences['avatar_profile'])) {
            $avatar_name = $preferences['avatar_profile']['avatar_id'] ?? 'Default';
            $tone = $preferences['avatar_profile']['prompt_framing'] ?? '';
            $avatar = htmlspecialchars(trim($avatar_name . ' (' . $tone . ')'));
        }

        // Determine session goal: may be string or structured data
        $goal = '';
        if (isset($log['goal_setter'])) {
            if (is_string($log['goal_setter'])) {
                $goal = htmlspecialchars($log['goal_setter']);
            } elseif (is_array($log['goal_setter'])) {
                // If structured, try 'goal' key or JSON-encode
                if (isset($log['goal_setter']['goal'])) {
                    $goal = htmlspecialchars($log['goal_setter']['goal']);
                } else {
                    $goal = htmlspecialchars(json_encode($log['goal_setter']));
                }
            }
        }
        // echo "<pre>" . print_r($log, true) . "</pre>";

        ?>
        <li>
            <a href="debug.php?uuid=<?php echo $uuid; ?>">
                <strong><?php echo $avatar; ?></strong> @ <?php echo $timestamp; ?>
            </a>
            <br>
            <em><?php echo $goal; ?></em>
        </li>
    <?php endforeach; ?>
</ul>