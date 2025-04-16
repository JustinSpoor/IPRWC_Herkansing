package nl.kingdom.fenrin.controllers;

import nl.kingdom.fenrin.models.LoginForm;
import nl.kingdom.fenrin.services.JwtService;
import nl.kingdom.fenrin.services.MyUserDetailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailService myUserDetailService;

    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateAndGenerateToken(@RequestBody LoginForm loginForm) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginForm.getUsername(),
                loginForm.getPassword()
        ));
        if (authentication.isAuthenticated()) {
            logger.info("User '{}' authenticated successfully", loginForm.getUsername());
            String accessToken = jwtService.generateToken(myUserDetailService.loadUserByUsername(loginForm.getUsername()));
            String refreshToken = jwtService.generateRefreshToken(myUserDetailService.loadUserByUsername(loginForm.getUsername()));

            Map<String, String> tokens = new HashMap<>();
            tokens.put("token", accessToken);
            tokens.put("refreshToken", refreshToken);

            return ResponseEntity.ok(tokens);
        } else {
            logger.warn("Authentication failed for user '{}'. Invalid credentials", loginForm.getUsername());
            return ResponseEntity.status(401).body("Invallid Credentials");
        }
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (jwtService.isTokenValid(refreshToken)) {
            String username = jwtService.extractUsername(refreshToken);
            String newToken = jwtService.generateToken(myUserDetailService.loadUserByUsername(username));

            Map<String, String> tokens = new HashMap<>();
            tokens.put("token", newToken);

            return ResponseEntity.ok(tokens);
        }
        return ResponseEntity.status(403).body("Invalid refresh token");
    }
}
