package nl.kingdom.fenrin.repositories;

import nl.kingdom.fenrin.models.MyUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MyUserRepository extends JpaRepository<MyUser, UUID> {

    Optional<MyUser> findByUsername(String username);
}
