package mh.michael.personal_health_record_webapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class PersonalHealthRecordWebappApplication {

  public static void main(String[] args) {
    SpringApplication.run(PersonalHealthRecordWebappApplication.class, args);
  }
}
