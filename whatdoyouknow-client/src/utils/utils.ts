export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateUniqueString = () => {
  const randomPart = Math.random().toString(36).slice(2, 8);
  const timePart = performance.now().toString(36).slice(-4);
  return randomPart + timePart;
};

export const getLeaderboardEmoji = (position: number) => {
  if (position === 1) {
    return "🥇";
  }
  if (position === 2) {
    return "🥈";
  }
  if (position === 3) {
    return "🥉";
  }
  return "";
};
