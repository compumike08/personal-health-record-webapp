package mh.michael.personal_health_record_webapp.repositories;

import java.util.Optional;
import java.util.UUID;
import mh.michael.personal_health_record_webapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);
  Optional<User> findByUserUuid(UUID userUuid);
  Optional<User> findByEmail(String email);
  Boolean existsByUsername(String username);
  Boolean existsByEmail(String email);
}
