package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.sql.DataSource;

@SpringBootApplication
public class DemoApplication implements CommandLineRunner {

    private final DataSource dataSource;

    public DemoApplication(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Trying MySQL connection...");
            var con = dataSource.getConnection();
            if (con != null && !con.isClosed()) {
                System.out.println("✅ MySQL Connected Successfully!");
                System.out.println("DB Product: " + con.getMetaData().getDatabaseProductName());
                System.out.println("DB Version: " + con.getMetaData().getDatabaseProductVersion());
            }
            con.close();
        } catch (Exception e) {
            System.out.println("❌ MySQL Connection Failed: " + e.getMessage());
        }
    }
}
