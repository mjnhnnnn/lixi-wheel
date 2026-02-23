// Biến đếm số lần trúng 50k (lưu ở memory - sẽ reset khi server restart)
// Nếu muốn persistent thì cần dùng database
let count50k = 0;
const MAX_50K = 2;

// Hàm lấy prizes dựa trên số lần đã trúng 50k
function getPrizesByCount() {
  if (count50k >= MAX_50K) {
    // Đã trúng đủ 2 lần 50k -> chỉ còn 10k và 20k, mỗi loại 50%
    return [
      { text: "10.000đ", prob: 50 },
      { text: "20.000đ", prob: 50 },
      { text: "50.000đ", prob: 0 },
      { text: "1.000.000đ", prob: 0 },
      { text: "5.000.000đ", prob: 0 }
    ];
  } else {
    // Chưa đủ 2 lần 50k -> tỷ lệ như yêu cầu
    return [
      { text: "10.000đ", prob: 40 },
      { text: "20.000đ", prob: 40 },
      { text: "50.000đ", prob: 20 },
      { text: "1.000.000đ", prob: 0 },
      { text: "5.000.000đ", prob: 0 }
    ];
  }
}

function getRandomPrize() {
  const currentPrizes = getPrizesByCount();
  const totalProb = currentPrizes.reduce((sum, p) => sum + p.prob, 0);
  
  let rand = Math.random() * totalProb;
  let cum = 0;

  for (const p of currentPrizes) {
    cum += p.prob;
    if (rand < cum) {
      // Nếu trúng 50k thì tăng biến đếm
      if (p.text === "50.000đ") {
        count50k++;
      }
      return p.text;
    }
  }

  return "10.000đ"; // fallback
}

exports.handler = async () => {
  try {
    const prize = getRandomPrize();
    
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Cho phép CORS
      },
      body: JSON.stringify({ 
        prize: prize,
        remaining50k: Math.max(0, MAX_50K - count50k) // Trả về số lượt 50k còn lại (nếu muốn hiển thị)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};