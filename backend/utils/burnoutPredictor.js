/**
 * Analyzes recent wellness entries and predicts burnout risk.
 * Factors: Stress increasing, Sleep decreasing, Mood decreasing, Energy decreasing.
 * Returns: Low, Medium, or High risk.
 */
function predictBurnoutRisk(entries) {
  if (!entries || entries.length < 2) {
    return 'Low'; // Not enough data
  }

  // Sort entries by timestamp ascending (oldest first)
  const sorted = [...entries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  const recent = sorted.slice(-7); // Look at up to last 7 entries
  
  let riskScore = 0; // 0-100

  // Calculate averages for first half vs second half
  const mid = Math.floor(recent.length / 2);
  const firstHalf = recent.slice(0, mid);
  const secondHalf = recent.slice(mid);

  const avgFirstHalf = {
    mood: getAvg(firstHalf, 'mood'),
    sleep: getAvg(firstHalf, 'sleepHours'),
    stress: getAvg(firstHalf, 'stressLevel'),
    energy: getAvg(firstHalf, 'energyLevel')
  };

  const avgSecondHalf = {
    mood: getAvg(secondHalf, 'mood'),
    sleep: getAvg(secondHalf, 'sleepHours'),
    stress: getAvg(secondHalf, 'stressLevel'),
    energy: getAvg(secondHalf, 'energyLevel')
  };

  // Rule 1: Stress increasing significantly (stress out of 10)
  if (avgSecondHalf.stress > avgFirstHalf.stress + 1.5) {
    riskScore += 30;
  } else if (avgSecondHalf.stress > 7) {
    riskScore += 20;
  }

  // Rule 2: Sleep decreasing significantly
  if (avgSecondHalf.sleep < avgFirstHalf.sleep - 1) {
    riskScore += 25;
  } else if (avgSecondHalf.sleep < 5) {
    riskScore += 20; // Consistently low sleep
  }

  // Rule 3: Mood decreasing
  if (avgSecondHalf.mood < avgFirstHalf.mood - 1.5) {
    riskScore += 25;
  } else if (avgSecondHalf.mood < 4) {
    riskScore += 15;
  }

  // Rule 4: Energy decreasing
  if (avgSecondHalf.energy < avgFirstHalf.energy - 1.5) {
    riskScore += 20;
  } else if (avgSecondHalf.energy < 4) {
    riskScore += 10;
  }

  if (riskScore >= 70) return 'High';
  if (riskScore >= 40) return 'Medium';
  return 'Low';
}

function getAvg(array, key) {
  if (array.length === 0) return 0;
  const sum = array.reduce((acc, curr) => acc + Number(curr[key] || 0), 0);
  return sum / array.length;
}

module.exports = { predictBurnoutRisk };
