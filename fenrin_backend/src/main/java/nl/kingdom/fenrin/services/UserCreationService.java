package nl.kingdom.fenrin.services;

import nl.kingdom.fenrin.models.MyUser;
import nl.kingdom.fenrin.repositories.MyUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserCreationService {

    @Autowired
    private MyUserRepository myUserRepository;


    public Optional<MyUser> getUserByUsername(String username) {
        return this.myUserRepository.findByUsername(username);
    }

    public MyUser createUser(MyUser user) {
        return this.myUserRepository.save(user);
    }
}
