// All numbers here are made up. No real residents, cases or counts.
// null means "no data". The page shows a gap, never a zero.
window.DASHBOARD_DATA = {
  label: "Synthetic data (made up)",
  source: "Made-up pilot sample",
  qualityThreshold: 92,
  slaTarget: 90,
  weeks: [
    { range: "1 to 7 Sep",   sla: 72, quality: 80, enquiries: 42500 },
    { range: "8 to 14 Sep",  sla: 78, quality: 86, enquiries: 42100 },
    { range: "15 to 21 Sep", sla: 84, quality: 92, enquiries: null },
    { range: "22 to 28 Sep", sla: 89, quality: 89, enquiries: 41900 }
  ]
};
