package com.tranthikimqui.example05.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.tranthikimqui.example05.service.FileService;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public String uploadImage(String path, MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();

        // ✅ Kiểm tra tên file hợp lệ
        if (originalFileName == null || !originalFileName.contains(".")) {
            throw new IOException("Tên tệp không hợp lệ: " + originalFileName);
        }

        // ✅ Tạo tên file ngẫu nhiên + giữ lại phần mở rộng
        String randomId = UUID.randomUUID().toString();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        String fileName = randomId + fileExtension;

        // ✅ Tạo thư mục nếu chưa tồn tại
        File folder = new File(path);
        if (!folder.exists()) {
            folder.mkdirs(); // tạo cả cây thư mục nếu cần
        }

        // ✅ Đường dẫn đến file đích
        File destination = new File(folder, fileName);

        // ✅ Ghi file (ghi đè nếu đã tồn tại)
        Files.copy(file.getInputStream(), destination.toPath(), StandardCopyOption.REPLACE_EXISTING);

        // 🖼️ In ra đường dẫn tuyệt đối để debug
        System.out.println("File saved to: " + destination.getAbsolutePath());

        return fileName;
    }

    @Override
    public InputStream getResource(String path, String fileName) throws FileNotFoundException {
        String filePath = path + File.separator + fileName;
        return new FileInputStream(filePath);
    }
}
