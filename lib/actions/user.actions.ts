"user server";

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// Create
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
// export để chỉ hàm này có thế được xuất ra ở nơi khác trong ứng dụng
// async chỉ ra hàm này là một hàm bất đồng bộ và trả về một promise
// userId: là một tham số của hàm, có kiểu dữ liệu là string
export async function getUserById(userId: string) {
  try {
    await connectToDatabase(); // được sử dụng để đợi hàm connectToDatabase hoàn thành, Đây là hàm bất đồng bộ
    const user = await User.findOne({ clerkId: userId }); // là một truy vấn MongoDB thông qua Mongoose để tìm một tài liệu trong bộ sưu tập 'User', awit được sử dụng để đợi kết quả truy vấn này
    if (!user) throw new Error("User not found"); // Nếu không tìm thấy người dùng sẽ trả về thông báo lỗi
    return JSON.parse(JSON.stringify(user)); // Kết quả đối tượng tìm thấy được chuyển đổi thành chuỗi JSON và sau đó phân tích cú pháp ngước lại thành JS
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();
    const updateUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    if (!updateUser) throw new Error("User update failed");
    return JSON.parse(JSON.stringify(updateUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();
    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });
    if (!userToDelete) {
      throw new Error("User not found");
    }
    // Delete user
    const deleteUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");
    return deleteUser ? JSON.parse(JSON.stringify(deleteUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();
    const updateUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    );
    if (!updateUserCredits) throw new Error("User credits update failed");
    return JSON.parse(JSON.stringify(updateCredits));
  } catch (error) {
    handleError(error);
  }
}
