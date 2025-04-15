package mh.michael.personal_health_record_webapp.repositories;

import mh.michael.personal_health_record_webapp.constants.EUserRole;
import mh.michael.personal_health_record_webapp.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    Optional<UserRole> findByName(EUserRole name);
}
