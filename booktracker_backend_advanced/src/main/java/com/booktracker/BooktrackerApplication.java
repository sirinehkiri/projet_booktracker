
package com.booktracker;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BooktrackerApplication {
    public static void main(String[] args) {
        System.setProperty("mail.debug", "false");
        SpringApplication.run(BooktrackerApplication.class, args);
    }
}
