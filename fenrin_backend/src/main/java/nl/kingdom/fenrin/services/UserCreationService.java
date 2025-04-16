package nl.kingdom.fenrin.services;

import nl.kingdom.fenrin.models.MyUser;
import nl.kingdom.fenrin.repositories.MyUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserCreationService {

    @Autowired
    private MyUserRepository myUserRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserCreationService.class);

    public Optional<MyUser> getUserByUsername(String username) {
        logger.debug("Attempting to fetch user by username: {}", username);
        return this.myUserRepository.findByUsername(username);
    }

    public MyUser createUser(MyUser user) {
        logger.info("Attempting to create user: {}", user.getUsername());
        return this.myUserRepository.save(user);
    }
}
