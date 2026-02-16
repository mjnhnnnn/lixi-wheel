const prizes = [
  { text: "10.000đ", prob: 48 },
  { text: "20.000đ", prob: 48 },
  { text: "100.000đ", prob: 3 },
  { text: "500.000đ", prob: 0.8 },
  { text: "5.000.000đ", prob: 0.2 }
];

const totalProb = prizes.reduce((sum, p) => sum + p.prob, 0);

function getRandomPrize() {
  let rand = Math.random() * totalProb;
  let cum = 0;

  for (const p of prizes) {
    cum += p.prob;
    if (rand < cum) return p.text;
  }

  return "10.000đ";
}

exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prize: getRandomPrize() })
  };
};