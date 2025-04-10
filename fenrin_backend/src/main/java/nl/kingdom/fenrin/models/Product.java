package nl.kingdom.fenrin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue
    private UUID id;

    private String productName;

    @Column(columnDefinition = "TEXT")
    private String productDescription;

    @Column(precision = 10, scale = 2)
    private BigDecimal productPrice;

    private int productStock;

    private String productImageUrl;

}
