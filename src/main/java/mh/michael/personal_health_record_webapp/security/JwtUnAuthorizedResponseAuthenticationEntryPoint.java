package mh.michael.personal_health_record_webapp.security;

import java.io.IOException;
import java.io.Serializable;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class JwtUnAuthorizedResponseAuthenticationEntryPoint
  implements AuthenticationEntryPoint, Serializable {

  private static final long serialVersionUID = -6607005317015851623L;

  @Override
  public void commence(
    HttpServletRequest request,
    HttpServletResponse response,
    AuthenticationException authException
  ) throws IOException {
    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
  }
}
