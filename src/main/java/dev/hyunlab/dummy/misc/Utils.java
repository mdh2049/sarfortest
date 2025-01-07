package dev.hyunlab.dummy.misc;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

import dev.hyunlab.gravity.cmmn.misc.GcJwtUtils;
import dev.hyunlab.gravity.cmmn.misc.GcUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Utils extends GcUtils {
public static boolean isJwtOk(HttpServletRequest request) {
  String authentication = request.getHeader("Authentication");

  if (Utils.isEmpty(authentication)) {
    return false;
  }

  if (!authentication.startsWith("Bearer ")) {
    log.error("{} {}", "E_JWT;BEARER_NOT_EXISTS", authentication);
    return false;
  }

  String token = authentication.replaceAll("Bearer ", "");

  if (!GcJwtUtils.validateToken(token)) {
    log.error("{} {}", "E_JWT;INVALID_TOKEN", token);
    return false;
  }

  return true;
}

public static boolean isJwtNotOk(HttpServletRequest request) {
  return !isJwtOk(request);
}

public static boolean existsJwt(HttpServletRequest request) {
  return getBodyMap(request).isPresent();
}

public static Optional<Map<String, Object>> getBodyMap(HttpServletRequest request) {
  if (isJwtNotOk(request)) {
    return Optional.empty();
  }

  String authentication = request.getHeader("Authentication");

  String token = authentication.replaceAll("Bearer ", "");

  return Optional.of(GcJwtUtils.getBody(token));
}

public static Optional<String> getUserId(HttpServletRequest request) {

  if (isJwtNotOk(request)) {
    return Optional.empty();
  }

  return Optional.of(getBodyMap(request).get().get(Const.KEY_USER_ID).toString());
}

public static Optional<String> getLoginId(HttpServletRequest request) {
  if (isJwtNotOk(request)) {
    return Optional.empty();
  }

  return Optional.of(getBodyMap(request).get().get(Const.KEY_LOGIN_ID).toString());
}

public static Path getTmpPath() {
  return Paths.get(System.getProperty("java.io.tmpdir"));
}

public static int calcAge(LocalDateTime wrtDt, String birthDe) {
  if (wrtDt == null) {
    return 0;
  }

  if (Utils.isEmpty(birthDe) || birthDe.length() != 8) {
    return 0;
  }

  DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
  LocalDate birth = LocalDate.parse(birthDe, formatter);

  return wrtDt.getYear() - birth.getYear();

}
}