package com.booktracker.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;
import java.util.List;

public class JwtUtil {

    private static final String SECRET =
            "MaCleSecreteSuperSecuriseePourJwt1234567890!";

    private static final long EXPIRATION_TIME = 900000; // 15 min

    private static Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // =========================
    // GENERATE TOKEN
    // =========================
    public static String generateToken(String username, List<String> roles) {

        Date now = new Date();
        Date expiry = new Date(System.currentTimeMillis() + EXPIRATION_TIME);

        System.out.println("TOKEN CREATED AT: " + now);
        System.out.println("TOKEN EXPIRES AT: " + expiry);

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // EXTRACT CLAIMS SAFE
    // =========================
    private static Claims getClaims(String token) {

        try {

            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (ExpiredJwtException e) {

            System.out.println("TOKEN EXPIRED");

            throw e; // important pour déclencher 401 dans le filter

        } catch (JwtException e) {

            System.out.println("TOKEN INVALID");

            throw e;
        }
    }

    // =========================
    // EXTRACT DATA
    // =========================
    public static String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public static List<String> extractRoles(String token) {
        return getClaims(token).get("roles", List.class);
    }

    // =========================
    // VALIDATION
    // =========================
    public static boolean validateToken(String token, String username) {
        try {
            return extractUsername(token).equals(username)
                    && !isTokenExpired(token);

        } catch (ExpiredJwtException e) {
            return false;
        }
    }

    private static boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }
}