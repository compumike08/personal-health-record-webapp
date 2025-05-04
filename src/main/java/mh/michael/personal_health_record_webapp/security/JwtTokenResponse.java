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
public class JwtTokenResponse implements Serializable {

  private static final long serialVersionUID = 9058760437300668823L;

  private String token;
}
