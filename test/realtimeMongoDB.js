// src/watchChanges.js (hoặc tên file bạn muốn)
const { MongoClient } = require('mongodb');

// --- Cấu hình ---
const uri = "mongodb://dungnh:20215545@mongodb.toolhub.app:27017/ambient_dungnh?authSource=ambient_dungnh";
const dbName = "ambient_dungnh";
// Tên collection thường là dạng số nhiều, viết thường của tên Class Model.
// Hãy kiểm tra lại tên collection chính xác trong database của bạn.
const collectionName = "environmentdatas";
// --- Kết thúc cấu hình ---

async function watchMongoDBChanges() {
  console.log("Đang cố gắng kết nối tới MongoDB...");
  const client = new MongoClient(uri, {
      useNewUrlParser: true, // Các tùy chọn này có thể không cần thiết với driver mới nhất
      useUnifiedTopology: true, // nhưng không gây hại
  });

  try {
    // Kết nối tới MongoDB
    await client.connect();
    console.log("Đã kết nối thành công tới MongoDB!");

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    console.log(`Đang lắng nghe thay đổi trên collection: ${dbName}.${collectionName}`);

    // Mở một Change Stream trên collection
    // Bạn có thể thêm options vào watch(), ví dụ: { fullDocument: 'updateLookup' }
    // để lấy toàn bộ document sau khi update. Mặc định chỉ nhận được các trường thay đổi.
    const changeStream = collection.watch();

    // Bắt đầu lắng nghe sự kiện 'change'
    changeStream.on('change', (next) => {
      // next là một Change Event Document
      console.log("\n--- NHẬN ĐƯỢC THAY ĐỔI ---");
      console.log("Loại thao tác:", next.operationType);

      // Log chi tiết tùy theo loại thao tác
      switch (next.operationType) {
        case 'insert':
          console.log("Dữ liệu được chèn:", next.fullDocument);
          break;
        case 'update':
          console.log("ID Document được cập nhật:", next.documentKey._id);
          console.log("Các trường thay đổi:", next.updateDescription.updatedFields);
          // Nếu bạn cần xem toàn bộ document sau khi update, hãy dùng option khi watch:
          // const changeStream = collection.watch([], { fullDocument: 'updateLookup' });
          // console.log("Document sau khi cập nhật:", next.fullDocument);
          break;
        case 'replace':
           console.log("Document được thay thế:", next.fullDocument);
           break;
        case 'delete':
           console.log("ID Document bị xóa:", next.documentKey._id);
           break;
        default:
           console.log("Chi tiết sự kiện:", next); // Log các loại sự kiện khác
      }
      console.log("---------------------------\n");
    });

    // Lắng nghe lỗi từ Change Stream
    changeStream.on('error', (error) => {
      console.error("\n--- LỖI CHANGE STREAM ---");
      console.error(error);
      console.error("------------------------\n");
      // Ở đây bạn có thể thêm logic để thử kết nối lại hoặc xử lý lỗi
      // Ví dụ: client.close(); watchMongoDBChanges(); // Cẩn thận vòng lặp vô hạn
    });

    // Lắng nghe sự kiện đóng stream (ít khi xảy ra trừ khi có lỗi hoặc đóng chủ động)
    changeStream.on('close', () => {
        console.log("\n--- CHANGE STREAM ĐÃ ĐÓNG ---");
        // Cân nhắc việc kết nối lại ở đây nếu cần thiết
    });

    console.log("=> Đã thiết lập Change Stream. Đang chờ dữ liệu...");

    // Giữ cho tiến trình chạy để lắng nghe
    // Trong một ứng dụng thực tế, bạn sẽ không để nó kết thúc ở đây.
    // Ví dụ này sẽ chạy mãi mãi cho đến khi bạn dừng nó (Ctrl+C)
    await new Promise(() => {}); // Giữ tiến trình sống

  } catch (err) {
    console.error("\n--- LỖI KẾT NỐI HOẶC THIẾT LẬP ---");
    console.error("Không thể kết nối tới MongoDB hoặc thiết lập Change Stream.");
    console.error(err);
    console.error("---------------------------------\n");
    // Đảm bảo đóng client nếu có lỗi xảy ra trong quá trình kết nối
    if (client) {
        await client.close();
    }
    process.exit(1); // Thoát với mã lỗi
  } finally {
    // Khối finally này sẽ không bao giờ đạt được trong ví dụ này
    // vì `await new Promise(() => {})` chạy mãi mãi.
    // Trong ứng dụng thực tế, bạn cần cơ chế để đóng kết nối một cách an toàn khi dừng ứng dụng.
    // console.log("Đóng kết nối MongoDB.");
    // await client.close();
  }
}

// Chạy hàm chính
watchMongoDBChanges();

// Xử lý tín hiệu dừng (Ctrl+C) để đóng kết nối một cách nhẹ nhàng (tùy chọn)
process.on('SIGINT', async () => {
    console.log("\nNhận được SIGINT. Đang đóng kết nối MongoDB...");
    // Chỗ này cần truy cập được biến `client` - có thể cần cấu trúc lại code một chút
    // Hoặc bỏ qua việc đóng kết nối khi dùng Ctrl+C cho ví dụ đơn giản này.
    // await client.close(); // Sẽ báo lỗi vì client không trong scope này
    console.log("Đã dừng chương trình.");
    process.exit(0);
});