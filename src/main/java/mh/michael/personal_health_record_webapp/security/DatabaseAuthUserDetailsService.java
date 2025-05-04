package mh.michael.personal_health_record_webapp.security;

import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.model.User;
import mh.michael.personal_health_record_webapp.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DatabaseAuthUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public DatabaseAuthUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username)
    throws UsernameNotFoundException {
    User user = userRepository
      .findByUsername(username)
      .orElseThrow(() ->
        new UsernameNotFoundException("User Not Found with username: " + username)
      );

    return JwtUserDetails.build(user);
  }

  public JwtUserDetails loadUserByUuid(UUID userUuid) throws UsernameNotFoundException {
    User user = userRepository
      .findByUserUuid(userUuid)
      .orElseThrow(() ->
        new UsernameNotFoundException("User not found with uuid: " + userUuid.toString())
      );

    return JwtUserDetails.build(user);
  }

  public JwtUserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
    User user = userRepository
      .findByEmail(email)
      .orElseThrow(() ->
        new UsernameNotFoundException("User not found with email: " + email)
      );

    return JwtUserDetails.build(user);
  }
}
