package nl.kingdom.fenrin.controllers;

import nl.kingdom.fenrin.dto.RegisterDTO;
import nl.kingdom.fenrin.models.MyUser;
import nl.kingdom.fenrin.services.UserCreationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserCreationController {

    @Autowired
    private UserCreationService userCreationService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody RegisterDTO user) {
        Optional<MyUser> checkIfUsernameExists = this.userCreationService.getUserByUsername(user.getUsername());

        if(checkIfUsernameExists.isEmpty()) {
            MyUser newUser = new MyUser();

            newUser.setUsername(user.getUsername());
            newUser.setPassword(passwordEncoder.encode(user.getPassword()));
            newUser.setRole("SPELER");

            return ResponseEntity.ok(this.userCreationService.createUser(newUser));
        } else {
            return ResponseEntity.status(409).body("A user with the name " + user.getUsername() + " already exists.");
        }
    }

}
