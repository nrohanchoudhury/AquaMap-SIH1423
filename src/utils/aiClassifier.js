/**
 * Rule-based AI Classifier Engine for AquaMap (SIH 1423 Phase 1)
 * Analyzes issue type and description keywords to determine Category, Priority, Confidence score, and Operational Action.
 */
export function classifyWaterIssue(issueType, description = '') {
  const text = (issueType + ' ' + description).toLowerCase();

  let category = 'Other';
  let priority = 'Normal';
  let confidence = '85%';
  let recommendation = 'Schedule routine field inspection within 48 hours.';
  let estimatedSLA = '48 Hours';

  // Rule set 1: Critical Burst / Heavy Leakage
  if (
    text.includes('burst') ||
    text.includes('gushing') ||
    text.includes('flood') ||
    text.includes('heavy leak') ||
    text.includes('main break') ||
    text.includes('major leak')
  ) {
    category = 'Leakage';
    priority = 'Critical';
    confidence = '98%';
    recommendation =
      'CRITICAL: Immediately isolate upstream control valve and dispatch emergency pipe clamp repair team.';
    estimatedSLA = '2 to 4 Hours';
  }
  // Rule set 2: Standard Leakage / Pressure Drop
  else if (
    text.includes('leak') ||
    text.includes('leaking') ||
    text.includes('drip') ||
    text.includes('seepage') ||
    text.includes('low pressure') ||
    text.includes('trickle') ||
    text.includes('weak flow')
  ) {
    category = text.includes('leak') ? 'Leakage' : 'Low Pressure';
    priority = 'High';
    confidence = '94%';
    recommendation =
      'High Priority: Check line pressure sensors, inspect valve packings, and dispatch crew for joint sealing.';
    estimatedSLA = '12 Hours';
  }
  // Rule set 3: No Water Supply / Complete Outage
  else if (
    text.includes('no water') ||
    text.includes('no supply') ||
    text.includes('dry tap') ||
    text.includes('shut down') ||
    text.includes('outage')
  ) {
    category = 'No Supply';
    priority = 'Medium';
    confidence = '92%';
    recommendation =
      'Medium Priority: Verify local booster pump status at nearest reservoir tank and check for line air-locks.';
    estimatedSLA = '18 Hours';
  }
  // Rule set 4: Contaminated / Discolored / Odor Issue
  else if (
    text.includes('dirty') ||
    text.includes('smell') ||
    text.includes('foul') ||
    text.includes('color') ||
    text.includes('muddy') ||
    text.includes('contamination') ||
    text.includes('sewage mix')
  ) {
    category = 'Water Quality';
    priority = 'High';
    confidence = '95%';
    recommendation =
      'Urgent Water Quality Alert: Flush distribution branch lines and collect water quality lab samples immediately.';
    estimatedSLA = '8 Hours';
  }

  return {
    category,
    priority,
    confidence,
    recommendation,
    estimatedSLA
  };
}
