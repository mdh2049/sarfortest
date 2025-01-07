package dev.hyunlab.dummy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

import dev.hyunlab.gravity.cmmn.misc.GcCryptoUtils;

@SpringBootApplication(scanBasePackages = { "dev.hyunlab" })
@EnableScheduling
@EnableCaching
public class DummyApplication {

  public static void main(String[] args) {

    SpringApplication.run(DummyApplication.class, args);
  }
}