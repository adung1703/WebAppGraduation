// src/fetchAllData.js (hoặc tên file bạn muốn)
const { MongoClient } = require('mongodb');

// --- Cấu hình ---
const uri = "mongodb://dungnh:20215545@mongodb.toolhub.app:27017/ambient_dungnh?authSource=ambient_dungnh";
const dbName = "ambient_dungnh";
// Đảm bảo tên collection là chính xác
const collectionName = "environmentdatas";
// --- Kết thúc cấu hình ---

async function fetchAllDataFromMongoDB() {
  console.log("Đang cố gắng kết nối tới MongoDB...");
  // Không cần các option useNewUrlParser và useUnifiedTopology nữa với driver mới
  const client = new MongoClient(uri);

  try {
    // Kết nối tới MongoDB
    await client.connect();
    console.log("Đã kết nối thành công tới MongoDB!");

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    console.log(`\nĐang lấy tất cả dữ liệu từ collection: ${dbName}.${collectionName} ...`);

    // Tìm tất cả các documents trong collection
    // find({}) với bộ lọc rỗng sẽ trả về tất cả documents
    const cursor = collection.find({});

    // Chuyển cursor thành một mảng các documents
    const allData = await cursor.toArray();

    // Kiểm tra xem có dữ liệu không
    if (allData.length > 0) {
      console.log(`\n--- Tìm thấy ${allData.length} bản ghi ---`);
      // In từng document ra màn hình
      allData.forEach((doc, index) => {
        console.log(`\nBản ghi ${index + 1}:`);
        console.log(JSON.stringify(doc, null, 2)); // In dạng JSON đẹp mắt
        // Hoặc dùng console.dir để xem cấu trúc đối tượng
        // console.dir(doc, { depth: null });
      });
      console.log("\n--- Kết thúc danh sách bản ghi ---");
    } else {
      console.log("\nKhông tìm thấy bản ghi nào trong collection.");
    }

  } catch (err) {
    console.error("\n--- LỖI KẾT NỐI HOẶC TRUY VẤN ---");
    console.error("Đã xảy ra lỗi:", err);
    console.error("---------------------------------\n");
  } finally {
    // Rất quan trọng: Luôn đóng kết nối sau khi hoàn tất hoặc gặp lỗi
    if (client) {
      await client.close();
      console.log("\nĐã đóng kết nối MongoDB.");
    }
  }
}

// Chạy hàm chính
fetchAllDataFromMongoDB();