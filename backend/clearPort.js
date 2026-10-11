const { execSync } = require('child_process');

function isPortListening(port) {
  try {
    const output = execSync('netstat -ano', { encoding: 'utf8' });
    const regex = new RegExp(`:${port}\\s+.*LISTENING`, 'i');
    return output.split('\n').some((line) => regex.test(line));
  } catch (_) {
    return false;
  }
}

function clearPort(port = 2903) {
  try {
    const output = execSync('netstat -ano', { encoding: 'utf8' });
    const lines = output.split('\n');
    const pidsToKill = new Set();
    const regex = new RegExp(`:${port}\\s+.*LISTENING`, 'i');

    for (const line of lines) {
      if (regex.test(line)) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && pid !== String(process.pid)) {
          pidsToKill.add(pid);
        }
      }
    }

    if (pidsToKill.size > 0) {
      for (const pid of pidsToKill) {
        console.log(`[AYUSH.OS] Freeing port ${port} (terminating lingering process PID ${pid})...`);
        try {
          execSync(`taskkill /F /PID ${pid} /T`, { stdio: 'ignore' });
        } catch (_) {}
      }

      // Wait until socket is confirmed deallocated
      let attempts = 0;
      while (isPortListening(port) && attempts < 10) {
        try {
          execSync('powershell -NoProfile -Command "Start-Sleep -Milliseconds 200"', { stdio: 'ignore' });
        } catch (_) {}
        attempts++;
      }
      console.log(`[AYUSH.OS] Port ${port} is now free and ready.`);
    } else {
      console.log(`[AYUSH.OS] Port ${port} is ready.`);
    }
  } catch (err) {
    console.log(`[AYUSH.OS] Port ${port} check completed.`);
  }
}

if (require.main === module) {
  const port = process.env.PORT || 2903;
  clearPort(port);
}

module.exports = clearPort;
