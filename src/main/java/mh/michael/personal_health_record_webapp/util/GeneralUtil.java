package mh.michael.personal_health_record_webapp.util;

import static mh.michael.personal_health_record_webapp.constants.Constants.DATE_FORMAT_STRING;
import static mh.michael.personal_health_record_webapp.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
public class GeneralUtil {

  private static final SimpleDateFormat dateFormatter = new SimpleDateFormat(
    DATE_FORMAT_STRING,
    Locale.US
  );

  private GeneralUtil() {}

  public static Date parseDate(String dateString, Date ifNullReturnThis) {
    Date date = null;
    if (dateString != null && !dateString.isEmpty()) {
      try {
        date = dateFormatter.parse(dateString);
      } catch (ParseException e) {
        log.error("Unable to parse date {}", dateString);
        log.error(e.getMessage(), e);
        throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          INTERNAL_SERVER_ERROR_MSG
        );
      }
    }

    if (date == null && ifNullReturnThis != null) {
      date = ifNullReturnThis;
    }

    return date;
  }
}
