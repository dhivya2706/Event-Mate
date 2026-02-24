package com.event.eventmate.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;

import javax.imageio.ImageIO;
import java.io.File;

public class QRCodeService {

    public static String generateQRCode(String text, String fileName) throws Exception {

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 250, 250);

        
        String uploadDir = "target/classes/static/qrcodes/";
        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String filePath = uploadDir + fileName + ".png";

        ImageIO.write(
                MatrixToImageWriter.toBufferedImage(bitMatrix),
                "PNG",
                new File(filePath)
        );

       
        return "/qrcodes/" + fileName + ".png";
    }
}
