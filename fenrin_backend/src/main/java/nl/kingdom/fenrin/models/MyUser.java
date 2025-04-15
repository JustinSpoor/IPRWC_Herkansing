package nl.kingdom.fenrin.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;


@Entity
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Table(name = "users")
public class MyUser {

    @Id
    @GeneratedValue()
    @Column(name = "id")
    private UUID id;
    private String username;
    private String password;
    private String role;

    @OneToMany(mappedBy = "user")
    @JsonBackReference
    private List<Cart> carts;
}
