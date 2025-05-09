package mh.michael.personal_health_record_webapp.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.impl.DefaultClock;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import java.io.Serializable;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import lombok.extern.slf4j.Slf4j;
import mh.michael.personal_health_record_webapp.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtTokenUtil implements Serializable {

  private static final long serialVersionUID = -3301605591108950415L;
  private final Clock clock = DefaultClock.INSTANCE;

  @Value("${jwt.signing.key.secret}")
  private String secret;

  @Value("${jwt.token.expiration.in.seconds}")
  private Long expiration;

  private static final String ISSUER = "phr-webapp";
  private static final String AUTH_AUD = "phr-webapp--auth";
  private static final String FORGOT_PASSWORD_AUD = "phr-webapp--forgot-password";

  public String getSubjectFromToken(String token) {
    return getClaimFromToken(token, Claims::getSubject);
  }

  public String getAudienceFromToken(String token) {
    return getClaimFromToken(token, Claims::getAudience);
  }

  public Date getIssuedAtDateFromToken(String token) {
    return getClaimFromToken(token, Claims::getIssuedAt);
  }

  public Date getExpirationDateFromToken(String token) {
    return getClaimFromToken(token, Claims::getExpiration);
  }

  public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = getAllClaimsFromToken(token);
    return claimsResolver.apply(claims);
  }

  private Claims getAllClaimsFromToken(String token) {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    Key key = Keys.hmacShaKeyFor(keyBytes);
    JwtParser jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
    return jwtParser.parseClaimsJws(token).getBody();
  }

  private Boolean isTokenExpired(String token) {
    final Date expiration = getExpirationDateFromToken(token);
    return expiration.before(clock.now());
  }

  private Boolean ignoreTokenExpiration(String token) {
    // here you specify tokens, for that the expiration is ignored
    return false;
  }

  public String generateTokenForAuthentication(JwtUserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("aud", AUTH_AUD);
    claims.put("iss", ISSUER);
    return doGenerateToken(claims, userDetails.getUserUuid().toString());
  }

  public String generateTokenForForgotPassword(User user) {
    String emailAddress = user.getEmail();
    Map<String, Object> claims = new HashMap<>();
    claims.put("aud", FORGOT_PASSWORD_AUD);
    claims.put("iss", ISSUER);
    return doGenerateToken(claims, emailAddress);
  }

  private String doGenerateToken(Map<String, Object> claims, String subject) {
    final Date createdDate = clock.now();
    final Date expirationDate = calculateExpirationDate(createdDate);

    byte[] keyBytes = Decoders.BASE64.decode(secret);
    Key key = Keys.hmacShaKeyFor(keyBytes);

    return Jwts.builder()
      .setClaims(claims)
      .setSubject(subject)
      .setIssuedAt(createdDate)
      .setExpiration(expirationDate)
      .signWith(key, SignatureAlgorithm.HS512)
      .compact();
  }

  public Boolean canTokenBeRefreshed(String token) {
    return (!isTokenExpired(token) || ignoreTokenExpiration(token));
  }

  public String refreshToken(String token) {
    final Date createdDate = clock.now();
    final Date expirationDate = calculateExpirationDate(createdDate);

    final Claims claims = getAllClaimsFromToken(token);
    claims.setIssuedAt(createdDate);
    claims.setExpiration(expirationDate);

    byte[] keyBytes = Decoders.BASE64.decode(secret);
    Key key = Keys.hmacShaKeyFor(keyBytes);

    return Jwts.builder()
      .setClaims(claims)
      .signWith(key, SignatureAlgorithm.HS512)
      .compact();
  }

  public Boolean validateTokenForAuthentication(
    String token,
    JwtUserDetails userDetails
  ) {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    Key key = Keys.hmacShaKeyFor(keyBytes);

    try {
      Jwts.parserBuilder()
        .setSigningKey(key)
        .requireIssuer(ISSUER)
        .requireSubject(userDetails.getUserUuid().toString())
        .requireAudience(AUTH_AUD)
        .build()
        .parseClaimsJws(token);
    } catch (
      ExpiredJwtException
      | UnsupportedJwtException
      | MalformedJwtException
      | SignatureException
      | IllegalArgumentException e
    ) {
      log.error("validateTokenForAuthentication error: ", e);
      return false;
    }

    return true;
  }

  public Boolean validateTokenForForgotPassword(String token, User user) {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    Key key = Keys.hmacShaKeyFor(keyBytes);

    try {
      Jwts.parserBuilder()
        .setSigningKey(key)
        .requireIssuer(ISSUER)
        .requireSubject(user.getEmail())
        .requireAudience(FORGOT_PASSWORD_AUD)
        .build()
        .parseClaimsJws(token);
    } catch (
      ExpiredJwtException
      | UnsupportedJwtException
      | MalformedJwtException
      | SignatureException
      | IllegalArgumentException e
    ) {
      log.error("validateTokenForForgotPassword error: ", e);
      return false;
    }

    return true;
  }

  private Date calculateExpirationDate(Date createdDate) {
    return new Date(createdDate.getTime() + expiration * 1000);
  }
}
