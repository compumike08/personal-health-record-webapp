package mh.michael.personal_health_record_webapp.security;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtTokenRequest implements Serializable {

  private static final long serialVersionUID = -5580044272632709408L;

  private String username;
  private String password;
}
