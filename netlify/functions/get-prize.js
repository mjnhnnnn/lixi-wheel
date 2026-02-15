const prizes = [
  { text: "10.000đ", prob: 70 },
  { text: "20.000đ", prob: 15 },
  { text: "50.000đ", prob: 10 },
  { text: "100.000đ", prob: 5 },
  { text: "500.000đ", prob: 0.1 }
];

const totalProb = prizes.reduce((sum, p) => sum + p.prob, 0); // ≈100.1

function getRandomPrize() {
  let rand = Math.random() * totalProb;
  let cum = 0;
  for (const p of prizes) {
    cum += p.prob;
    if (rand < cum) return p.text;
  }
  return "10.000đ"; // fallback
}

exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prize: getRandomPrize() })
  };
};