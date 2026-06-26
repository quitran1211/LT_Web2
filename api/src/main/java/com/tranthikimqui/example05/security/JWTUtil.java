package com.tranthikimqui.example05.security;

import java.util.Collections;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

@Component
public class JWTUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms:3600000}")
    private long expirationMs;

    /**
     * Tạo JWT token chứa email và roles
     */
    public String generateToken(String email, Set<String> roles) {

        // Tránh NullPointerException
        if (roles == null) {
            roles = Collections.emptySet();
        }

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withClaim("email", email)
                    .withClaim("roles", roles.stream().collect(Collectors.toList()))
                    .withIssuedAt(new Date())
                    .withExpiresAt(new Date(System.currentTimeMillis() + expirationMs))
                    .withIssuer("E-Commerce Application")
                    .sign(algorithm);

        } catch (JWTCreationException ex) {
            throw new RuntimeException("Error creating JWT token", ex);
        }
    }

    /**
     * Validate token và trả về email
     */
    public String validateTokenAndRetrieveSubject(String token)
            throws JWTVerificationException {

        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withIssuer("E-Commerce Application")
                .build();

        DecodedJWT jwt = verifier.verify(token);
        return jwt.getClaim("email").asString();
    }

    /**
     * Lấy roles từ token
     */
    public Set<String> getRolesFromToken(String token) {

        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withIssuer("E-Commerce Application")
                .build();

        DecodedJWT jwt = verifier.verify(token);

        if (jwt.getClaim("roles").isNull()) {
            return Collections.emptySet();
        }

        return jwt.getClaim("roles")
                .asList(String.class)
                .stream()
                .collect(Collectors.toSet());
    }
}